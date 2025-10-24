import { EventsType } from "../../constants/events-type.enum";

export interface INotification<T = any> {
  type: EventsType;
  eventName: string;
  payload: T;
  taskId: string;
  author: {
    id: string;
    name: string;
  }
  message?: string;
  metadata?: Record<string, any>
  createdAt: Date;
}
