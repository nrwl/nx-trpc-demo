import { todoTrpcServer } from './todo-trpc-server';

describe('todoTrpcServer', () => {
  it('should work', () => {
    expect(todoTrpcServer()).toEqual('todo-trpc-server');
  });
});
