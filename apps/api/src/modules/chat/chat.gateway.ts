import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

/**
 * The Agora - Socket.io Chat Gateway
 */
@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  },
  namespace: '/chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private connectedUsers: Map<string, Set<string>> = new Map(); // roomId -> Set<socketId>

  constructor(private readonly chatService: ChatService) {}

  async handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  async handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    // Clean up user from all rooms
    this.connectedUsers.forEach((sockets, roomId) => {
      if (sockets.has(client.id)) {
        sockets.delete(client.id);
        this.broadcastUserCount(roomId);
      }
    });
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; userId: string },
  ) {
    const { roomId, userId } = data;
    
    await client.join(roomId);
    
    // Track connected users
    if (!this.connectedUsers.has(roomId)) {
      this.connectedUsers.set(roomId, new Set());
    }
    this.connectedUsers.get(roomId)!.add(client.id);
    
    // Send recent messages
    const messages = await this.chatService.getMessages(roomId);
    client.emit('recentMessages', messages);
    
    // Broadcast user count
    this.broadcastUserCount(roomId);
    
    return { success: true, roomId };
  }

  @SubscribeMessage('leaveRoom')
  async handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string },
  ) {
    const { roomId } = data;
    
    await client.leave(roomId);
    
    if (this.connectedUsers.has(roomId)) {
      this.connectedUsers.get(roomId)!.delete(client.id);
      this.broadcastUserCount(roomId);
    }
    
    return { success: true };
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; userId: string; content: string },
  ) {
    const { roomId, userId, content } = data;
    
    const message = await this.chatService.sendMessage(roomId, userId, content);
    
    // Broadcast to all clients in room
    this.server.to(roomId).emit('newMessage', message);
    
    return { success: true, message };
  }

  @SubscribeMessage('startRain')
  async handleStartRain(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: {
      roomId: string;
      userId: string;
      totalAmount: string;
      maxClaims: number;
      durationMinutes: number;
    },
  ) {
    try {
      const rain = await this.chatService.createCryptoRain(data.roomId, data.userId, {
        totalAmount: BigInt(data.totalAmount),
        maxClaims: data.maxClaims,
        durationMinutes: data.durationMinutes,
      });
      
      // Broadcast rain to all clients in room
      this.server.to(data.roomId).emit('cryptoRain', {
        id: rain.id,
        senderId: rain.senderId,
        totalAmount: rain.totalAmount.toString(),
        amountPerClaim: rain.amountPerClaim.toString(),
        maxClaims: rain.maxClaims,
        expiresAt: rain.expiresAt,
      });
      
      return { success: true, rain };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  @SubscribeMessage('claimRain')
  async handleClaimRain(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { rainId: string; userId: string; roomId: string },
  ) {
    try {
      const claim = await this.chatService.claimRain(data.rainId, data.userId);
      
      // Broadcast claim to room
      this.server.to(data.roomId).emit('rainClaimed', {
        rainId: data.rainId,
        userId: data.userId,
        amount: claim.amount.toString(),
      });
      
      return { success: true, claim };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  private broadcastUserCount(roomId: string) {
    const count = this.connectedUsers.get(roomId)?.size || 0;
    this.server.to(roomId).emit('userCount', { roomId, count });
  }
}
