/**
 * Service for handling Langchain Chat operations.
 *
 * This service facilitates various types of chat interactions using OpenAI's language models.
 * It supports basic chat, context-aware chat, document context chat, and PDF uploading functionalities.
 * Basic chat and context-aware chat utilize pre-defined templates for processing user queries,
 * whereas document chat leverages document context for more nuanced responses.
 * The PDF upload feature processes and stores PDF content for document context chats.
 *
 * @class LangchainChatService
 *
 * @method basicChat - Processes a basic chat message using a predefined template, sends it to the OpenAI model for a response, and formats the response. Handles errors with HttpExceptions.
 * @param {BasicMessageDto} basicMessageDto - Data Transfer Object containing the user's query.
 * @returns Formatted response from the OpenAI model.
 *
 * @method contextAwareChat - Processes messages with consideration for the context of previous interactions, using a context-aware template for coherent responses. Handles errors with HttpExceptions.
 * @param {ContextAwareMessagesDto} contextAwareMessagesDto - Data Transfer Object containing the user’s current message and the chat history.
 * @returns Contextually relevant response from the OpenAI model.
 *
 * @method documentChat - Processes a chat message with context derived from document similarity search, using a document-context template. Handles errors with HttpExceptions.
 * @param {BasicMessageDto} basicMessageDto - Data Transfer Object containing the user's query.
 * @returns Response from the OpenAI model, contextualized with document information.
 *
 * @method uploadPDF - Processes a PDF file by loading, splitting into text, and storing its content for later use in document context chats. Handles file existence verification and errors with HttpExceptions.
 * @param {DocumentDto} documentDto - Data Transfer Object containing the file path of the PDF to be processed.
 * @returns Success message upon successful PDF processing and storage.
 *
 * The class utilizes several internal methods for operations such as loading chat chains, formatting messages, generating success responses, and handling exceptions.
 * These methods interact with external libraries and services, including the OpenAI API, file system operations, and custom utilities for message formatting and response generation.
 */

import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { BasicMessageDto } from './dtos/basic-message.dto';
import { PromptTemplate } from '@langchain/core/prompts';
import { ChatOpenAI } from '@langchain/openai';
import { ChatAnthropic } from '@langchain/anthropic';
import { HttpResponseOutputParser } from 'langchain/output_parsers';
import { TEMPLATES } from 'src/utils/constants/templates.constants';
import customMessage from 'src/utils/responses/customMessage.response';
import { MESSAGES } from 'src/utils/constants/messages.constants';
import { openAI, vercelRoles } from 'src/utils/constants/openAI.constants';
import { anthropic } from 'src/utils/constants/anthropic.constants';
import { ContextAwareMessagesDto } from './dtos/context-aware-messages.dto';
import { Message as VercelChatMessage } from 'ai';

import { existsSync } from 'fs';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
// import { VectorStoreService } from 'src/services/vector-store.service';
import * as path from 'path';
import { Document } from '@langchain/core/documents';
import { DocumentDto } from './dtos/document.dto';
import { PDF_BASE_PATH } from 'src/utils/constants/common.constants';
import {
  AgentExecutor,
  createOpenAIFunctionsAgent,
  createToolCallingAgent,
} from 'langchain/agents';
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from '@langchain/core/prompts';

import {
  HumanMessage,
  AIMessage,
  MessageContent,
} from '@langchain/core/messages';

import {
  suggestPortProfileAllocationTool,
  fundInformationTool,
  taxSavingFundTool,
} from 'src/langchain-chat/tools/customTools';

import { portfolioAllocationWithoutHistoryPrompt } from 'src/prompts/tax-saving-fund/portfolioAllocationWithoutHistory.prompts';
import { fundInfoPrompt } from 'src/prompts/fundInfo.prompts';
import { recommendPrompt } from 'src/prompts/tax-saving-fund/recommend.prompts';
import { knowledgePrompt } from 'src/prompts/tax-saving-fund/knowledge.prompts';

import { 
  createAnthropicModel,
  loadAgentExecutor 
} from 'src/langchain-chat/agents/init'
import { initSupervisorAgent } from 'src/langchain-chat/agents/supervisor'

@Injectable()
export class LangchainChatService {
  // constructor(private vectorStoreService: VectorStoreService) {}

  async basicChat(basicMessageDto: BasicMessageDto) {
    try {
      // const chain = this.loadSingleChainAnthropic(
      //   TEMPLATES.BASIC_CHAT_TEMPLATE,
      // );
      const chain = await createAnthropicModel()
      const response = await chain.invoke(basicMessageDto.question);
      return this.successResponseBasic(response.content as MessageContent);
    } catch (e: unknown) {
      this.exceptionHandling(e);
    }
  }

  async contextAwareChat(contextAwareMessagesDto: ContextAwareMessagesDto) {
    try {
      const messages = contextAwareMessagesDto.messages ?? [];
      const formattedPreviousMessages = messages
        .slice(0, -1)
        .map(this.formatMessage);
      const currentMessageContent = messages[messages.length - 1].content;

      const chain = this.loadSingleChain(TEMPLATES.CONTEXT_AWARE_CHAT_TEMPLATE);

      const response = await chain.invoke({
        chat_history: formattedPreviousMessages.join('\n'),
        input: currentMessageContent,
      });
      return this.successResponse(response);
    } catch (e: unknown) {
      this.exceptionHandling(e);
    }
  }

  async documentChat(basicMessageDto: BasicMessageDto) {
    try {
      // const documentContext = await this.vectorStoreService.similaritySearch(
      //   basicMessageDto.user_query,
      //   3,
      // );

      const chain = this.loadSingleChain(
        TEMPLATES.DOCUMENT_CONTEXT_CHAT_TEMPLATE,
      );

      const response = await chain.invoke({
        // context: JSON.stringify(documentContext),
        question: basicMessageDto.question,
      });
      return this.successResponse(response);
    } catch (e: unknown) {
      this.exceptionHandling(e);
    }
  }

  async uploadPDF(documentDto: DocumentDto) {
    try {
      // Load the file
      const file = PDF_BASE_PATH + '/' + documentDto.file;
      const resolvedPath = path.resolve(file);
      // Check if the file exists
      if (!existsSync(resolvedPath)) {
        throw new BadRequestException('File does not exist.');
      }

      // Load the PDF using PDFLoader
      const pdfLoader = new PDFLoader(resolvedPath);
      const pdf = await pdfLoader.load();

      // Split the PDF into texts using RecursiveCharacterTextSplitter
      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 50,
      });
      const texts = await textSplitter.splitDocuments(pdf);
      let embeddings: Document[] = [];

      for (let index = 0; index < texts.length; index++) {
        const page = texts[index];
        const splitTexts = await textSplitter.splitText(page.pageContent);
        const pageEmbeddings = splitTexts.map((text) => ({
          pageContent: text,
          metadata: {
            pageNumber: index,
          },
        }));
        embeddings = embeddings.concat(pageEmbeddings);
      }
      // await this.vectorStoreService.addDocuments(embeddings);
      return customMessage(HttpStatus.OK, MESSAGES.SUCCESS);
    } catch (e: unknown) {
      console.log(e);

      this.exceptionHandling(e);
    }
  }

  async portAgentChat(contextAwareMessagesDto: ContextAwareMessagesDto) {
    try {
      const tools = [suggestPortProfileAllocationTool];
      const { formattedPreviousMessages, currentMessageContent } = this.scrapingContextMessage(contextAwareMessagesDto)

      const agentExecutor = await loadAgentExecutor(tools, portfolioAllocationWithoutHistoryPrompt)

      const response = await agentExecutor.invoke({
        input: currentMessageContent,
        chat_history: formattedPreviousMessages,
      });

      return customMessage(HttpStatus.OK, MESSAGES.SUCCESS, response.output);
    } catch (e: unknown) {
      this.exceptionHandling(e);
    }
  }

  async fundInfoAgentChat(contextAwareMessagesDto: ContextAwareMessagesDto) {
    try {
      const tools = [fundInformationTool];
      const { formattedPreviousMessages, currentMessageContent } = this.scrapingContextMessage(contextAwareMessagesDto)

      const agentExecutor = await loadAgentExecutor(tools, fundInfoPrompt)

      const response = await agentExecutor.invoke({
        input: currentMessageContent,
        chat_history: formattedPreviousMessages,
      });

      return customMessage(HttpStatus.OK, MESSAGES.SUCCESS, response.output);
    } catch (e: unknown) {
      this.exceptionHandling(e);
    }
  }

  async taxSavingFundAgentChat(
    contextAwareMessagesDto: ContextAwareMessagesDto,
  ) {
    try {
      const tools = [taxSavingFundTool];
      const { formattedPreviousMessages, currentMessageContent } = this.scrapingContextMessage(contextAwareMessagesDto)

      const agentExecutor = await loadAgentExecutor(tools, recommendPrompt)

      const response = await agentExecutor.invoke({
        input: currentMessageContent,
        chat_history: formattedPreviousMessages,
      });

      return customMessage(HttpStatus.OK, MESSAGES.SUCCESS, response.output);
    } catch (e: unknown) {
      this.exceptionHandling(e);
    }
  }

  async agentMultiToolsChat(contextAwareMessagesDto: ContextAwareMessagesDto) {
    try {
      const tools = [
        suggestPortProfileAllocationTool,
        fundInformationTool,
        taxSavingFundTool,
      ];

     const { formattedPreviousMessages, currentMessageContent } = this.scrapingContextMessage(contextAwareMessagesDto)

      const agentExecutor = await loadAgentExecutor(tools, 'You are a helpful assistant and master of fund')

      const response = await agentExecutor.invoke({
        input: currentMessageContent,
        chat_history: formattedPreviousMessages,
      });

      return customMessage(HttpStatus.OK, MESSAGES.SUCCESS, response.output);
    } catch (e: unknown) {
      this.exceptionHandling(e);
    }
  }

  async knowledgeAgentChat(contextAwareMessagesDto: ContextAwareMessagesDto) {
    try {
      const { formattedPreviousMessages, currentMessageContent } = this.scrapingContextMessage(contextAwareMessagesDto)
      const prompt = ChatPromptTemplate.fromMessages([
        ['system', knowledgePrompt],
        new MessagesPlaceholder({ variableName: 'chat_history' }),
        ['user', '{input}'],
      ]);

      const llm = await createAnthropicModel()
      const chain = prompt.pipe(llm);

      const response = await chain.invoke({
        input: currentMessageContent,
        chat_history: formattedPreviousMessages,
      });

      return customMessage(HttpStatus.OK, MESSAGES.SUCCESS, response);
    } catch (e: unknown) {
      this.exceptionHandling(e);
    }
  }

  async supervisorAgentChat(basicMessageDto: BasicMessageDto) {
    try {

      const supervisorGraph = await initSupervisorAgent()


      let streamResults = supervisorGraph.stream(
        {
          messages: [
            new HumanMessage({
              content: basicMessageDto.question,
            }),
          ],
        },
        { recursionLimit: 100 },
      );

      for await (const output of await streamResults) {
        if (!output?.__end__) {
          console.log("-->",JSON.stringify(output));
          console.log("----");
        }
      }

      return customMessage(HttpStatus.OK, MESSAGES.SUCCESS, 'response');
    } catch (e: unknown) {
      this.exceptionHandling(e);
    }
  }

  private loadSingleChain = (template: string) => {
    const prompt = PromptTemplate.fromTemplate(template);

    const model = new ChatOpenAI({
      temperature: +openAI.BASIC_CHAT_OPENAI_TEMPERATURE,
      modelName: openAI.GPT_3_5_TURBO_1106.toString(),
    });

    const outputParser = new HttpResponseOutputParser();

    return prompt.pipe(model).pipe(outputParser);
  };

  // private loadSingleChainAnthropic = (template: string) => {
  //   const model = new ChatAnthropic({
  //     modelName: anthropic.CLAUDE_3_5_SONNET_20240229.toString(),
  //     temperature: +anthropic.BASIC_CHAT_ANTHROPIC_TEMPERATURE,
  //   });

  //   return model;
  // };

  private formatMessage = (message: VercelChatMessage) =>
    `${message.role}: ${message.content}`;

  private formatBaseMessages = (message: VercelChatMessage) =>
    message.role === vercelRoles.user
      ? new HumanMessage({ content: message.content, additional_kwargs: {} })
      : new AIMessage({ content: message.content, additional_kwargs: {} });

  private successResponseBasic = (response: MessageContent) =>
    customMessage(HttpStatus.OK, MESSAGES.SUCCESS, response);

  private successResponse = (response: Uint8Array) =>
    customMessage(
      HttpStatus.OK,
      MESSAGES.SUCCESS,
      Object.values(response)
        .map((code) => String.fromCharCode(code))
        .join(''),
    );

  private exceptionHandling = (e: unknown) => {
    Logger.error(e);
    throw new HttpException(
      customMessage(
        HttpStatus.INTERNAL_SERVER_ERROR,
        MESSAGES.EXTERNAL_SERVER_ERROR,
      ),
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  };

  private scrapingContextMessage = (contextAwareMessagesDto: ContextAwareMessagesDto): { formattedPreviousMessages: (HumanMessage | AIMessage)[]; currentMessageContent:string; } => {
    const messages = contextAwareMessagesDto.messages ?? [];
    const formattedPreviousMessages = messages
        .slice(0, -1)
        .map(this.formatBaseMessages);
    const currentMessageContent = messages[messages.length - 1].content;

    return { 
      formattedPreviousMessages:formattedPreviousMessages,
      currentMessageContent:currentMessageContent
    }
  };

}
