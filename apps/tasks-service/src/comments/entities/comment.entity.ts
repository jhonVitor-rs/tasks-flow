import { AggregateRoot } from '@nestjs/cqrs';
import { Task } from '../../tasks/entities/task.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { uuid } from 'uuidv4';
import { CreateCommentEvent } from '../events/create-comment/create-comment.event';

@Entity()
@Index(['taskId', 'createdAt'])
export class Comment extends AggregateRoot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  taskId: string;

  @ManyToOne(() => Task, (task) => task.comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'taskId' })
  task: Task;

  @Column('text')
  message: string;

  @Column('uuid')
  authorId: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  static create(message: string, taskId: string, authorId: string): Comment {
    const comment = new Comment();

    comment.id = uuid();
    comment.message = message;
    comment.taskId = taskId;
    comment.authorId = authorId;
    comment.createdAt = new Date();

    comment.apply(
      new CreateCommentEvent(
        comment.id,
        taskId,
        message,
        authorId,
        comment.createdAt,
      ),
    );

    return comment;
  }
}
