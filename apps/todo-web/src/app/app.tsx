import { TodoTrpcRouter } from '@nx-trpc-demo/todo-trpc-server';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';
import { useEffect } from 'react';
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
        <PollTodoListQuery>
          <TodoList />
        </PollTodoListQuery>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

export function PollTodoListQuery({ children }: { children: React.ReactNode }) {
  const utils = trpc.useContext();
  useEffect(() => {
    const intervalId = setInterval(() => {
      utils.todoList.invalidate();
    }, 5000);
    return () => clearInterval(intervalId);
  }, []);
  return <>{children}</>;
}

export default App;
