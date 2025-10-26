import {
  TASK_EVENTS,
  type IBasicTask,
  type IComment,
  type INotification,
  type ITask,
} from "@repo/core";
import { useEffect, useCallback } from "react";
import type { Socket } from "socket.io-client";
import { toast } from "sonner";
import { EventMessage } from "../components/event-message";
import { useTasksActions } from "../stores/tasks";

export function useGlobalEvents(socket: Socket | null) {
  const { setApiUpdated } = useTasksActions();

  const onTaskCreated = useCallback(
    (data: INotification<IBasicTask>) => {
      setApiUpdated();
      toast.success(
        <EventMessage
          title="New Task Created"
          message={`${data.payload.title} created by ${data.author.name}`}
          type="success"
        />
      );
    },
    [setApiUpdated]
  );

  const onTaskUpdated = useCallback(
    (data: INotification<ITask>) => {
      setApiUpdated();
      toast(
        <EventMessage
          title="Task Updated"
          message={`${data.payload.title} updated by ${data.author.name}`}
          type="info"
        />
      );
    },
    [setApiUpdated]
  );

  const onTaskCommented = useCallback(
    (data: INotification<IComment>) => {
      setApiUpdated();
      toast(
        <EventMessage
          title="New Comment"
          message={`${data.payload.author} commented: "${data.payload.message}"`}
          type="comment"
        />
      );
    },
    [setApiUpdated]
  );

  useEffect(() => {
    if (!socket || !socket.connected) {
      console.warn(
        "⚠️ Socket não está conectado, eventos não serão registrados"
      );
      return;
    }

    console.log("📡 Registrando event listeners...");

    socket.on(TASK_EVENTS.TASK_CREATED, onTaskCreated);
    socket.on(TASK_EVENTS.TASK_UPDATED, onTaskUpdated);
    socket.on(TASK_EVENTS.COMMENTED, onTaskCommented);

    return () => {
      console.log("🧹 Removendo event listeners...");
      socket.off(TASK_EVENTS.TASK_CREATED, onTaskCreated);
      socket.off(TASK_EVENTS.TASK_UPDATED, onTaskUpdated);
      socket.off(TASK_EVENTS.COMMENTED, onTaskCommented);
    };
  }, [socket, onTaskCreated, onTaskUpdated, onTaskCommented]);
}
