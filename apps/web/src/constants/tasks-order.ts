import { TaskQueryOrder } from "@repo/core";

export const COLUMN_TO_ORDER_MAP: Record<string, TaskQueryOrder> = {
  title: TaskQueryOrder.TITLE,
  status: TaskQueryOrder.STATUS,
  priority: TaskQueryOrder.PRIORITY,
  term: TaskQueryOrder.TERM,
  createdAt: TaskQueryOrder.CREATED_AT,
};

export function mapColumnIdToOrderBy(columnId: string): TaskQueryOrder | undefined {
  return COLUMN_TO_ORDER_MAP[columnId];
}
