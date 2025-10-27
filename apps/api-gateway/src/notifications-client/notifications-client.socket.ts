// import { UseGuards } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { INotification } from '@repo/core';
import { Server, Socket } from 'socket.io';
// import { WsGuard } from 'src/guards/ws/ws.guard';

@WebSocketGateway({
  cors: { origin: process.env.FRONTEND_URL || 'http://localhost:5173' },
  namespace: '/api/notifications',
})
export class NotificationsClientSocket
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private userConnections = new Map<string, Set<string>>();

  // @UseGuards(WsGuard)
  async handleConnection(client: Socket) {
    const userId = client.handshake.auth.userId;

    if (!userId) {
      console.warn(`Unauthorized socket connection: ${client.id}`);
      client.disconnect(true);
      return;
    }

    const sockets = this.userConnections.get(userId) ?? new Set();
    sockets.add(client.id);
    this.userConnections.set(userId, sockets);

    client.join(`user:${userId}`);
    console.log(`User ${userId} connected with socket ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    const userId = client.data.user?.id;
    if (!userId) return;

    const sockets = this.userConnections.get(userId);
    if (!sockets) return;

    sockets.delete(client.id);
    if (sockets.size === 0) {
      this.userConnections.delete(userId);
    }

    console.log(`Socket ${client.id} disconnected`);
  }

  broadcast(event: string, data: INotification) {
    this.server.emit(event, data);
  }
}
