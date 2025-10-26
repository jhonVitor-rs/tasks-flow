import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { AUTH_PATTERNS, IUser } from '@repo/core';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class UserLoaderService {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
  ) {}

  async verificationUsersExistence(ids: string[]): Promise<string[]> {
    return await Promise.all(
      ids.map(async (id) => {
        try {
          const userExists: boolean = await lastValueFrom(
            this.authService.send(AUTH_PATTERNS.CONFIRM_EXISTANCE_USER, {
              id,
            }),
          );

          if (!userExists) {
            throw new RpcException({
              status: HttpStatus.BAD_REQUEST,
              message: `User with id ${id} does not exist`,
            });
          }

          return id;
        } catch (error) {
          console.error(`Error verifying user ${id}:`, error);
          throw error;
        }
      }),
    );
  }

  async loadUser(userId: string): Promise<IUser> {
    try {
      const user: IUser = await lastValueFrom(
        this.authService.send(AUTH_PATTERNS.GET_USER_INFORMATION, {
          id: userId,
        }),
      );

      if (!user) {
        throw new RpcException({
          status: HttpStatus.NOT_FOUND,
          message: `User with id ${userId} not found`,
        });
      }

      return user;
    } catch (error) {
      if (error instanceof RpcException) throw error;

      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to load user',
      });
    }
  }

  async loadAuthorName(userId: string): Promise<string> {
    const user = await this.loadUser(userId);
    return user.name;
  }

  async loadUsers(userIds: string[]): Promise<{ id: string; name: string }[]> {
    if (!userIds || userIds.length === 0) return [];

    try {
      const users = await Promise.all(userIds.map((id) => this.loadUser(id)));
      return users.map((u) => ({ id: u.id, name: u.name }));
    } catch (error) {
      if (error instanceof RpcException) throw error;
      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to load users',
      });
    }
  }
}
