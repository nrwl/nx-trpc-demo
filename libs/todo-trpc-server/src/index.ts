import { initTRPC } from '@trpc/server';

const t = initTRPC.create();
export interface TodoItem {
  id: number;
  name: string;
  complete: boolean;
}

const todoItems: Record<number, TodoItem> = {
  1: { id: 1, name: 'Buy milk', complete: false },
};

export const trpcRouter = t.router({
  todoList: t.procedure.query(() => Object.values(todoItems)),
});

export type TodoTrpcRouter = typeof trpcRouter;
