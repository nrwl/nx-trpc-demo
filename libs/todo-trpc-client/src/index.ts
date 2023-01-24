import { TodoTrpcRouter } from '@nx-trpc-demo/todo-trpc-server';
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';

export const createTodoTrpcClient = () =>
  createTRPCProxyClient<TodoTrpcRouter>({
    links: [httpBatchLink({ url: '/api' })],
  } as any);
