import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  Query,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ClientProxy } from '@nestjs/microservices';
import {
  IBasicTask,
  IComment,
  ICommentsQuery,
  ICreateComment,
  IPagination,
  ITask,
  IUpdatedTask,
  TASK_PATTERNS,
} from '@repo/core';
import { catchError, lastValueFrom, throwError } from 'rxjs';
import { plainToInstance } from 'class-transformer';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { TasksQueryDto } from './dto/tasks-query.dto';
import { PaginationResponseDto } from './dto/pagination-response.dto';
import { BasicTaskDto, TaskDto } from './dto/task.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentsQueryDto } from './dto/comments-query.dto';
import { CommentDto } from './dto/comment.dto';

@ApiTags('Tasks')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('tasks')
export class TasksClientController {
  constructor(
    @Inject('TASKS_SERVICE')
    private readonly tasksClient: ClientProxy,
  ) {}

  private handleMicroserviceError(error: any) {
    const status = error?.status || error?.statusCode || 500;
    const message = error?.message || 'An error occurred';

    switch (status) {
      case 400:
        throw new BadRequestException(message);
      case 401:
        throw new UnauthorizedException(message);
      case 409:
        throw new ConflictException(message);
      default:
        console.error('Microservice error:', error);
        throw new InternalServerErrorException('Internal server error');
    }
  }

  // ───────────────────────────────────────────────
  // TASKS
  // ───────────────────────────────────────────────

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List all tasks with pagination and filters' })
  @ApiResponse({
    status: 200,
    description: 'List of tasks returned successfully',
    type: PaginationResponseDto<BasicTaskDto>,
  })
  async getAllTasks(
    @Query() queryParams: TasksQueryDto,
  ): Promise<PaginationResponseDto<BasicTaskDto>> {
    try {
      const result: IPagination<IBasicTask> = await lastValueFrom(
        this.tasksClient
          .send(TASK_PATTERNS.GET_ALL_TASKS, queryParams)
          .pipe(
            catchError((error) =>
              throwError(() => this.handleMicroserviceError(error)),
            ),
          ),
      );

      return plainToInstance(PaginationResponseDto<BasicTaskDto>, result);
    } catch (error) {
      throw error;
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({ status: 201, description: 'Task created successfully' })
  async createTask(@Body() dto: CreateTaskDto): Promise<{ id: string }> {
    try {
      return await lastValueFrom(
        this.tasksClient
          .send(TASK_PATTERNS.CREATE_TASK, dto)
          .pipe(
            catchError((error) =>
              throwError(() => this.handleMicroserviceError(error)),
            ),
          ),
      );
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a task by ID' })
  @ApiResponse({ status: 200, type: TaskDto })
  async getTask(@Param('id') id: string): Promise<TaskDto> {
    try {
      const result: ITask = await lastValueFrom(
        this.tasksClient
          .send(TASK_PATTERNS.GET_TASK, { id })
          .pipe(
            catchError((error) =>
              throwError(() => this.handleMicroserviceError(error)),
            ),
          ),
      );

      return plainToInstance(TaskDto, result);
    } catch (error) {
      throw error;
    }
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a task by ID' })
  @ApiResponse({ status: 200, description: 'Task updated successfully' })
  async updateTask(
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
  ): Promise<{ id: string }> {
    const data: IUpdatedTask = { id, ...dto };
    try {
      return await lastValueFrom(
        this.tasksClient
          .send(TASK_PATTERNS.UPDATE_TASK, data)
          .pipe(
            catchError((error) =>
              throwError(() => this.handleMicroserviceError(error)),
            ),
          ),
      );
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a task by ID' })
  @ApiResponse({ status: 200, description: 'Task deleted successfully' })
  async deleteTask(@Param('id') id: string) {
    try {
      return await lastValueFrom(
        this.tasksClient
          .send(TASK_PATTERNS.DELETE_TASK, { id })
          .pipe(
            catchError((error) =>
              throwError(() => this.handleMicroserviceError(error)),
            ),
          ),
      );
    } catch (error) {
      throw error;
    }
  }

  // ───────────────────────────────────────────────
  // COMMENTS
  // ───────────────────────────────────────────────

  @Post(':id/comments')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a comment for a task' })
  @ApiResponse({ status: 201, description: 'Comment created successfully' })
  async createComment(
    @Param('id') id: string,
    @Body() dto: CreateCommentDto,
  ): Promise<{ id: string }> {
    const data: ICreateComment = { taskId: id, ...dto };
    try {
      return await lastValueFrom(
        this.tasksClient
          .send(TASK_PATTERNS.CREATE_COMMENT, data)
          .pipe(
            catchError((error) =>
              throwError(() => this.handleMicroserviceError(error)),
            ),
          ),
      );
    } catch (error) {
      throw error;
    }
  }

  @Get(':id/comments')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List all comments from a task' })
  @ApiResponse({
    status: 200,
    description: 'List of comments returned successfully',
    type: PaginationResponseDto<CommentDto>,
  })
  async getAllComments(
    @Param('id') id: string,
    @Query() queryParams: CommentsQueryDto,
  ): Promise<PaginationResponseDto<CommentDto>> {
    const query: ICommentsQuery = {
      taskId: id,
      ...queryParams,
    };

    try {
      const result: IPagination<IComment> = await lastValueFrom(
        this.tasksClient
          .send(TASK_PATTERNS.GET_COMMENTS, query)
          .pipe(
            catchError((error) =>
              throwError(() => this.handleMicroserviceError(error)),
            ),
          ),
      );

      return plainToInstance(PaginationResponseDto<CommentDto>, result);
    } catch (error) {
      throw error;
    }
  }
}
