export const TASK_PATTERNS = {
  CREATE_TASK: { cmd: 'create_task' },
  UPDATE_TASK: { cmd: 'update_task' },
  DELETE_TASK: { cmd: 'delete_task' },
  GET_TASK: { cmd: 'get_task' },
  GET_ALL_TASKS: { cmd: 'get_all_tasks' },
  CREATE_COMMENT: { cmd: 'create_comment' },
  GET_COMMENTS: { cmd: 'get_task_comments' }
}

export const TASK_EVENTS = {
  TASK_CREATED: 'task.created',
  TASK_UPDATED: 'task.updated',
  COMMENTED: 'task.commented.created'
}
