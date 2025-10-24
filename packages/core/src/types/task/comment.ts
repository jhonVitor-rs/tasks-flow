export interface IComment {
  id: string;
  message: string;
  taskId: string;
  author: {
    id: string;
    name: string;
  }
  createdAt: Date
}
