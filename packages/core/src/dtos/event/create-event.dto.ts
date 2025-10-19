import { IsEnum } from "class-validator";
import { EventsType } from "../../constants/events-type.enum";

export class CreateEventDto<T> {
  @IsEnum(EventsType)
  type!: EventsType;

  event!: T;

  createdAt!: Date;

  constructor(event: T, type: EventsType) {
    this.event = event;
    this.type = type;
    this.createdAt = new Date()
  }
}
