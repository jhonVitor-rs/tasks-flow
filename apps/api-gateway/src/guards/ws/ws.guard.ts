import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { WsException } from '@nestjs/websockets';
import { AUTH_PATTERNS } from '@repo/core';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class WsGuard implements CanActivate {
  constructor(
    @Inject('AUTH_SERVICE')
    private readonly authClient: ClientProxy,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient();
    const token =
      client.handshake?.auth?.token ||
      client.handshake?.headers?.authorization?.split(' ')[1];

    if (!token) {
      throw new WsException('Unauthorized');
    }

    const result = await lastValueFrom(
      this.authClient.send(AUTH_PATTERNS.VALIDATE_ACCESS_TOKEN, { token }),
    );

    if (!result.valid) throw new WsException('Invalid token');

    client.data.user = { id: result.userId };

    return true;
  }
}
