import { createTodoTrpcClient } from '@nx-trpc-demo/todo-trpc-client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';
import { TodoTrpcRouter } from '@nx-trpc-demo/todo-trpc-server';

export const trpc = createTRPCReact<TodoTrpcRouter>();
export const trpcClient = trpc.createClient({
  links: [httpBatchLink({ url: 'http://localhost:3000/api' })],
});
const queryClient = new QueryClient();

export function App() {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}></QueryClientProvider>
    </trpc.Provider>
  );
}

export default App;
