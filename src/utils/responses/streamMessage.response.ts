import { Readable } from 'stream';
import type { Response } from 'express';
import { AIMessageChunk } from '@langchain/core/messages';
import { IterableReadableStream } from '@langchain/core/utils/stream';



function streamMessage(res: Response, stream: any) {

    const readableStream = new Readable({
        read() { }
    });
    // Push data from the stream to the readable stream
    //basic-chat no longer work with this method
    (async () => {
        try {
            for await (const event of stream) {
                if (event.event == "on_llm_stream") {
                    readableStream.push(event.data.chunk.text);
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
    readableStream.on('end', () => {
        // console.log("end of stream");
        res.end(); // End the response when the stream ends
    });

}
export default streamMessage;
