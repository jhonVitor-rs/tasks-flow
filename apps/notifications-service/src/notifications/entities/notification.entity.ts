import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EventsType } from '@repo/core';

@Entity()
@Index(['actorId', 'createdAt'])
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: EventsType })
  type: EventsType;

  @Column({ type: 'varchar', length: 100 })
  eventName: string;

  @Column({ type: 'json' })
  payload: any;

  @Column({ type: 'uuid', nullable: true })
  @Index()
  taskId: string;

  @Column({ type: 'uuid' })
  @Index()
  actorId: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  message: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'json', nullable: true })
  metadata: Record<string, any>;
}
