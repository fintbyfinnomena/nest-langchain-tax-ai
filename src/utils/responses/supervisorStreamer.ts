import { ChatHistoryManager } from '../history/interface';
import { Readable } from 'stream';
import type { Response } from 'express';
import { IterableReadableStream } from '@langchain/core/utils/stream';
import { StreamEvent } from '@langchain/core/tracers/log_stream';

import { AIMessage, HumanMessage } from '@langchain/core/messages';
import { TaxChatMessage } from 'src/types/chatHistory.types';

interface ChainStreamer {
  streamEvents(...args: any): IterableReadableStream<StreamEvent>;
}

export class SupervisorStreamer {
  private chatHistoryManager: ChatHistoryManager;
  private sessionId: string;
  private chainStreamer: ChainStreamer;

  constructor(
    historyManager: ChatHistoryManager,
    sessionId: string,
    chainStreamer: ChainStreamer,
  ) {
    this.chatHistoryManager = historyManager;
    this.sessionId = sessionId;
    this.chainStreamer = chainStreamer;
  }

  async StreamMessage(res: Response, message: string) {
    const history = await this.chatHistoryManager.GetHistoryMessagesBySessionID(
      this.sessionId,
    );

    let resMsg = '';

    let messagesReq: any[] = [
      new HumanMessage({
        content: message,
      }),
    ];

    const historysMessage = await history.getMessages();

    if (historysMessage.length > 0) {
      messagesReq = [...historysMessage, ...messagesReq];
    }

    const stream = this.chainStreamer.streamEvents(
      {
        messages: messagesReq,
      },
      // {
      //   input: message,
      //   chat_history: await history.getMessages(),
      // },
      { version: 'v1' },
    );

    const readableStream = new Readable({
      read() {},
    });

    (async () => {
      try {
        for await (const event of stream) {
          if (event.event == 'on_llm_stream') {
            readableStream.push(event.data.chunk.text);
            resMsg += event.data.chunk.text;
          } else {
            console.log('\x1b[42m%s\x1b[0m', event.event);
            console.log(event.data, ' -> ', JSON.stringify(event.data));
          }
        }
        readableStream.push(null); // Signal the end of the stream
      } catch (error) {
        readableStream.destroy(error); // Destroy the stream on error
      }
    })();

    // res.writeHead(200, { 'Content-Type': 'text/event-stream','Transfer-Encoding': 'chunked', 'Connection' : 'keep-alive' });
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    readableStream.pipe(res);

    // Attach error event listener to the readable stream
    readableStream.on('error', (error) => {
      console.error('Error occurred while streaming:', error);
      res.end(); // End the response to prevent hanging
    });

    // Attach end event listener to the readable stream
    readableStream.on('end', async () => {
      try {
        history.addUserMessage(message);
        history.addAIMessage(resMsg);
        this.chatHistoryManager.AddMessagesToChatHistoryDB(this.sessionId, [
          convertMessageToCustomMessage(new HumanMessage(message)),
          convertMessageToCustomMessage(new AIMessage(resMsg)),
        ]);
        this.chatHistoryManager.SaveHistoryMessagesCache(
          this.sessionId,
          await history.getMessages(),
        );
      } catch (error) {
        console.error('Error occurred while streaming end:', error);
      }
      res.end(); // End the response when the stream ends
    });
  }
}

const convertMessageToCustomMessage = (
  message: AIMessage | HumanMessage,
): TaxChatMessage => {
  if (message instanceof AIMessage) {
    return {
      actor: 'ai',
      baseMessage: message.toDict().data,
    };
  } else if (message instanceof HumanMessage) {
    return {
      actor: 'human',
      baseMessage: message.toDict().data,
    };
  }
};
