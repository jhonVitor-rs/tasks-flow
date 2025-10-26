import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AUTH_PATTERNS } from '@repo/core';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject('AUTH_SERVICE')
    private readonly authClient: ClientProxy,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers['authorization'] as string;
    if (!authHeader) throw new UnauthorizedException('missing token!');
    const token = authHeader.split(' ')[1];

    const result = await lastValueFrom(
      this.authClient.send(AUTH_PATTERNS.VALIDATE_ACCESS_TOKEN, { token }),
    );

    if (!result.valid) throw new UnauthorizedException('Invalid token');

    req.user = { id: result.userId };
    return true;
  }
}
