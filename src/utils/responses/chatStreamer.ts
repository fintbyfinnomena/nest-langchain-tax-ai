import { ChatHistoryManager } from '../history/interface';
import { Readable } from 'stream';
import type { Response } from 'express';
import { IterableReadableStream } from '@langchain/core/utils/stream';
import { StreamEvent } from '@langchain/core/tracers/log_stream';

interface ChainStreamer {
  streamEvents(...args: any): IterableReadableStream<StreamEvent>;
}

export class ChatStreamer {
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

    const stream = this.chainStreamer.streamEvents(
      {
        input: message,
        chat_history: await history.getMessages(),
      },
      { version: 'v1' },
    );

    const readableStream = new Readable({
      read() {},
    });
    // Push data from the stream to the readable stream
    //basic-chat no longer work with this method
    (async () => {
      try {
        for await (const event of stream) {
          if (event.event == 'on_llm_stream') {
            readableStream.push(event.data.chunk.text);
            resMsg += event.data.chunk.text;
          }
        }
        readableStream.push(null); // Signal the end of the stream
      } catch (error) {
        readableStream.destroy(error); // Destroy the stream on error
      }
    })();

    res.writeHead(200, { 'Content-Type': 'text/plain' });
    readableStream.pipe(res);

    // Attach error event listener to the readable stream
    readableStream.on('error', (error) => {
      console.error('Error occurred while streaming:', error);
      res.end(); // End the response to prevent hanging
    });

    // Attach end event listener to the readable stream
    readableStream.on('end', async () => {
      history.addUserMessage(message);
      history.addAIMessage(resMsg);
      this.chatHistoryManager.SaveHistoryMessagesCache(
        this.sessionId,
        await history.getMessages(),
      );
      res.end(); // End the response when the stream ends
    });
  }
}
