import { Controller, Get, Param, Query } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('rooms')
  async getRooms() {
    return this.chatService.getRooms();
  }

  @Get('rooms/:roomId/messages')
  async getMessages(
    @Param('roomId') roomId: string,
    @Query('limit') limit?: string,
    @Query('before') before?: string,
  ) {
    return this.chatService.getMessages(
      roomId,
      limit ? parseInt(limit, 10) : 50,
      before,
    );
  }

  @Get('rooms/:roomId/rains')
  async getActiveRains(@Param('roomId') roomId: string) {
    return this.chatService.getActiveRains(roomId);
  }
}
