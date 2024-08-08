import { Body, Controller, Post, Delete, Param } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}
  // generate post method with message field in payload
  @Post(':id')
  async postChat(
    @Body() body: { message: string },
    @Param('id') id: string,
  ): Promise<string> {
    return await this.chatService.postChat(id, body.message);
  }

  @Delete(':id')
  async deleteChat(@Param('id') id: string): Promise<void> {
    await this.chatService.clearChat(id);
  }
}
