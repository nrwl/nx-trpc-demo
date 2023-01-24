import { initTRPC } from '@trpc/server';
import { z } from 'zod';

const t = initTRPC.create();
export interface TodoItem {
  id: number;
  name: string;
  complete: boolean;
}
let id = 1;
const todoItems: Record<number, TodoItem> = {
  1: { id: 1, name: 'Buy milk', complete: false },
};

export const trpcRouter = t.router({
  todoList: t.procedure.query(() => Object.values(todoItems)),
  createTodoItem: t.procedure
    .input(z.object({ description: z.string() }))
    .mutation(({ input }) => {
      console.log('createTodoItem procedure');
      ++id;
      todoItems[id] = { id, name: input.description, complete: false };
      return todoItems[id];
    }),
  completeTodoItem: t.procedure.input(z.number()).mutation(({ input }) => {
    if (!todoItems[input]) {
      throw new Error('not found');
    }
    todoItems[input].complete = true;
    return todoItems[input];
  }),
  markTodoItemIncomplete: t.procedure
    .input(z.number())
    .mutation(({ input }) => {
      if (!todoItems[input]) {
        throw new Error('not found');
      }
      todoItems[input].complete = false;
      return todoItems[input];
    }),
});

export type TodoTrpcRouter = typeof trpcRouter;
