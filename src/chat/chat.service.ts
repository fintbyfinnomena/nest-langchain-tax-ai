import { Inject, Injectable, HttpStatus, HttpException, Logger } from '@nestjs/common';
import { ChatOpenAI } from '@langchain/openai';
import { openAI } from 'src/utils/constants/openAI.constants';
import {
  HumanMessage,
  AIMessage,
  AIMessageChunk,
  //   BaseMessage,
} from '@langchain/core/messages';
import { ChatMessageHistory } from 'langchain/stores/message/in_memory';
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from '@langchain/core/prompts';
import { Runnable, RunnableConfig } from '@langchain/core/runnables';
import { ChatHistoryManager } from 'src/utils/history/interface';
import { ChatHistoryManagerImp } from 'src/utils/history/implementation';
import { InjectModel } from '@nestjs/mongoose';
import { TaxChatHistory } from 'src/schemas/chatHistory.schema';
import { Model } from 'mongoose';
import customMessage from 'src/utils/responses/customMessage.response';
import { MESSAGES } from 'src/utils/constants/messages.constants';

@Injectable()
export class ChatService {
  private chain: Runnable<any, AIMessageChunk, RunnableConfig>;
  private chatHistoryManager: ChatHistoryManager;

  constructor(
    @Inject('REDIS_CLIENT') redisClient,
    @InjectModel('chat_histories')
    private taxChatHistoryModel: Model<TaxChatHistory>,
  ) {
    this.chatHistoryManager = new ChatHistoryManagerImp(
      redisClient,
      taxChatHistoryModel,
    );
    const prompt = ChatPromptTemplate.fromMessages([
      [
        'system',
        `You are a love coach who has matched a couple on a dating app. You have to talk with Jame to help him win Athena's heart. James is male gender. First of all, you have to validate who you are talking is James by asking his name. If not James you have to reject all question util he tell you he is James`,
      ],
      new MessagesPlaceholder('messages'),
    ]);

    const chatModel = new ChatOpenAI({
      modelName: openAI.GPT_4o_MINI.toString(),
      openAIApiKey: process.env.OPEN_AI_API_KEY,
    });

    const chain = prompt.pipe(chatModel);
    this.chain = chain;
  }

  async postChat(chatId: string, message: string): Promise<string> {
    let chatHistory = new ChatMessageHistory();
    try {
      chatHistory =
        await this.chatHistoryManager.GetHistoryMessagesBySessionID(chatId);
    } catch (error) {
      // catch something in this
    }

    await chatHistory.addMessage(new HumanMessage(message));

    const aiResp = await this.chain.invoke({
      messages: await chatHistory.getMessages(),
    });

    await chatHistory.addMessage(new AIMessage(aiResp.content.toString()));

    try {
      const historyMessages = await chatHistory.getMessages();
      await this.chatHistoryManager.SaveHistoryMessagesCache(
        chatId,
        historyMessages,
      );
    } catch (error) {
      // catch something in this
    }

    return aiResp.content.toString();
  }

  async clearChat(chatId: string): Promise<void> {
    try {
      await this.chatHistoryManager.ClearHistoryMessagesBySessionID(chatId);
    } catch (error) {
      // catch something in this
    }
  }

  async temporaryChatHistory(sessionId: string) {
    try {
      const history = await this.chatHistoryManager.GetHistoryMessagesBySessionID(
        sessionId,
      );
      const messages = await history.getMessages()
      const result = [];
      for (const h of messages) {
        if (h instanceof HumanMessage) {
          result.push({"human":h.content})
        }else if(h instanceof AIMessage) {
          result.push({"ai":h.content})
        }
      }
      return await customMessage(HttpStatus.OK, MESSAGES.SUCCESS, result);
    } catch (e: unknown) {
      Logger.error(e);
      throw new HttpException(
        customMessage(
          HttpStatus.INTERNAL_SERVER_ERROR,
          MESSAGES.EXTERNAL_SERVER_ERROR,
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

}
