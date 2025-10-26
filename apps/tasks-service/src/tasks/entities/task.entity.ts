import { uuid } from 'uuidv4';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AggregateRoot } from '@nestjs/cqrs';
import { TaskPriority, TaskStatus } from '@repo/core';
import { CreateTaskEvent } from '../events/create-task/create-task.event';
import { UpdateTaskEvent } from '../events/update-task/update-task.event';
import { Comment } from '../../comments/entities/comment.entity';

@Entity()
export class Task extends AggregateRoot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text', { default: '' })
  description?: string;

  @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.TODO })
  status: string;

  @Column({ type: 'enum', enum: TaskPriority, default: TaskPriority.LOW })
  priority: string;

  @Column()
  term: Date;

  @Column('simple-array', { default: '' })
  assigneeIds: string[];

  @Column('simple-array', { default: '' })
  verifiedAssigneeIds: string[];

  @Column('uuid')
  createdBy: string;

  @OneToMany(() => Comment, (comment) => comment.task, {
    cascade: true,
    eager: true,
    onDelete: 'CASCADE',
  })
  comments: Comment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  beforeInsert() {
    this.assigneeIds = this.assigneeIds || [];
    this.verifiedAssigneeIds = this.verifiedAssigneeIds || [];
    this.comments = this.comments || [];
  }

  static create(
    title: string,
    term: string,
    createdBy: string,
    status?: TaskStatus,
    priority?: TaskPriority,
  ): Task {
    const task = new Task();

    task.id = uuid();

    task.title = title;
    task.description = '';
    task.term = new Date(term);
    task.createdBy = createdBy;
    task.status = status || TaskStatus.TODO;
    task.priority = priority || TaskPriority.LOW;
    task.assigneeIds = [];
    task.verifiedAssigneeIds = [];
    task.comments = [];

    task.apply(
      new CreateTaskEvent(
        {
          id: task.id,
          title: task.title,
          status: task.status as TaskStatus,
          priority: task.priority as TaskPriority,
          term: task.term,
          commentsCount: 0,
          createdAt: task.createdAt || new Date(Date.now()),
        },
        task.createdBy,
      ),
    );

    return task;
  }

  updateTaskEvent(
    taskId: string,
    title: string,
    description: string,
    status: TaskStatus,
    priority: TaskPriority,
    term: Date,
    assigneesIds: string[],
    authorId: string,
    createdAt: Date,
    updatedAt: Date,
    modifiedBy: string,
  ): this {
    this.apply(
      new UpdateTaskEvent(
        taskId,
        title,
        description,
        status,
        priority,
        term,
        assigneesIds,
        authorId,
        createdAt,
        updatedAt,
        modifiedBy,
      ),
    );

    return this;
  }
}
