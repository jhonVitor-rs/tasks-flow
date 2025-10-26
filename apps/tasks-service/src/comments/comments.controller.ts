import { Controller } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  type ICreateComment,
  type IPagination,
  type ICommentsQuery,
  TASK_PATTERNS,
  IComment,
} from '@repo/core';
import { CreateCommentCommand } from './commands/create-comment/create-comment.command';
import { GetAllCommentsQuery } from './queries/get-all/get-all.query';

@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @MessagePattern(TASK_PATTERNS.CREATE_COMMENT)
  async createComment(@Payload() dto: ICreateComment): Promise<{ id: string }> {
    const command = new CreateCommentCommand(dto);
    return await this.commandBus.execute(command);
  }

  @MessagePattern(TASK_PATTERNS.GET_COMMENTS)
  async getAllComents(
    @Payload() dto: ICommentsQuery,
  ): Promise<IPagination<IComment>> {
    const query = new GetAllCommentsQuery(dto);
    return await this.queryBus.execute(query);
  }
}
