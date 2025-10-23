import { IsEnum, IsObject, IsOptional, IsString, IsUUID } from "class-validator";
import { EventsType } from "../../constants/events-type.enum";

export class CreateNotificationDto<T = any> {
  @IsEnum(EventsType)
  type!: EventsType;

  @IsString()
  eventName!: string;

  @IsObject()
  payload!: T;

  @IsUUID()
  taskId?: string;

  @IsUUID()
  actorId?: string;

  @IsString()
  @IsOptional()
  message?: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;

  createdAt!: Date;

  constructor(partial: Partial<CreateNotificationDto<T>>) {
    Object.assign(this, partial)
    this.createdAt = new Date()
  }
}
