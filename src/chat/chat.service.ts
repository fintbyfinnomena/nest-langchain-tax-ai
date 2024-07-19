import { Inject, Injectable } from '@nestjs/common';
import { ChatOpenAI } from '@langchain/openai';
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

@Injectable()
export class ChatService {
  private chain: Runnable<any, AIMessageChunk, RunnableConfig>;
  private chatHistoryManager: ChatHistoryManager;

  constructor(@Inject('REDIS_CLIENT') redisClient) {
    this.chatHistoryManager = new ChatHistoryManagerImp(redisClient);
    const prompt = ChatPromptTemplate.fromMessages([
      [
        'system',
        `You are a love coach who has matched a couple on a dating app. You have to talk with Jame to help him win Athena's heart. James is male gender. First of all, you have to validate who you are talking is James by asking his name. If not James you have to reject all question util he tell you he is James`,
      ],
      new MessagesPlaceholder('messages'),
    ]);

    const chatModel = new ChatOpenAI({
      modelName: 'gpt-3.5-turbo',
      openAIApiKey: process.env.OPEN_AI_API_KEY,
    });

    const chain = prompt.pipe(chatModel);
    this.chain = chain;
  }

  async postChat(sessiongID: string, message: string): Promise<string> {
    let chatHistory = new ChatMessageHistory();
    try {
      chatHistory =
        await this.chatHistoryManager.GetHistoryMessagesBySessionID(sessiongID);
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
      await this.chatHistoryManager.SaveHistoryMessages(
        sessiongID,
        historyMessages,
      );
    } catch (error) {
      // catch something in this
    }

    return aiResp.content.toString();
  }

  async clearChat(sessiongID: string): Promise<void> {
    try {
      await this.chatHistoryManager.ClearHistoryMessagesBySessionID(sessiongID);
    } catch (error) {
      // catch something in this
    }
  }
}