import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';
import { TodoTrpcRouter } from '@nx-trpc-demo/todo-trpc-server';
import TodoList from './todo-list';

export const trpc = createTRPCReact<TodoTrpcRouter>();
export const trpcClient = trpc.createClient({
  links: [httpBatchLink({ url: 'http://localhost:3000/api' })],
});
export const queryClient = new QueryClient();

export function App() {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <TodoList />
      </QueryClientProvider>
    </trpc.Provider>
  );
}

export default App;
