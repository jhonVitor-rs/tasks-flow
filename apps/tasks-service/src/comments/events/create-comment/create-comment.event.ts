export class CreateCommentEvent {
  constructor(
    public readonly commentId: string,
    public readonly taskId: string,
    public readonly message: string,
    public readonly authorId: string,
    public readonly createdAt: Date,
  ) {}
}
