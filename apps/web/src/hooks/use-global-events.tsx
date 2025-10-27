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
import { useQueryClient } from "@tanstack/react-query";

export function useGlobalEvents(socket: Socket | null) {
  const { setApiUpdated } = useTasksActions();
  const queryClient = useQueryClient();
  
  const onTaskCreated = useCallback(
    (data: INotification<IBasicTask>) => {
      setApiUpdated();
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success(
        <EventMessage
          title="New Task Created"
          message={`${data.payload.title} created by ${data.author.name}`}
          type="success"
        />
      );
    },
    [setApiUpdated, queryClient]
  );

  const onTaskUpdated = useCallback(
    (data: INotification<ITask>) => {
      setApiUpdated();
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task', data.payload.id] });
      toast(
        <EventMessage
          title="Task Updated"
          message={`${data.payload.title} updated by ${data.author.name}`}
          type="info"
        />
      );
    },
    [setApiUpdated, queryClient]
  );

  const onTaskCommented = useCallback(
    (data: INotification<IComment>) => {
      setApiUpdated();
      queryClient.invalidateQueries({ 
        queryKey: ['comments', data.payload.taskId] 
      });
      toast(
        <EventMessage
          title="New Comment"
          message={`${data.payload.author} commented: "${data.payload.message}"`}
          type="comment"
        />
      );
    },
    [setApiUpdated, queryClient]
  );

  useEffect(() => {
    if (!socket) {
      console.warn("⚠️ Socket é null");
      return;
    }

    console.log('🔌 Socket recebido, estado:', socket.connected ? 'conectado' : 'conectando...');

    const registerListeners = () => {
      console.log("📡 Registrando event listeners...");
      socket.on(TASK_EVENTS.TASK_CREATED, onTaskCreated);
      socket.on(TASK_EVENTS.TASK_UPDATED, onTaskUpdated);
      socket.on(TASK_EVENTS.COMMENTED, onTaskCommented);
    };

    if (socket.connected) {
      registerListeners();
    }

    const onConnect = () => {
      registerListeners();
    };

    socket.on('connect', onConnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off(TASK_EVENTS.TASK_CREATED, onTaskCreated);
      socket.off(TASK_EVENTS.TASK_UPDATED, onTaskUpdated);
      socket.off(TASK_EVENTS.COMMENTED, onTaskCommented);
    };
  }, [socket, onTaskCreated, onTaskUpdated, onTaskCommented]);
}