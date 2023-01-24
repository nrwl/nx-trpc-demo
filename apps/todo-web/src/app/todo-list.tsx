import { TodoItem } from '@nx-trpc-demo/todo-trpc-server';
import { useEffect, useState } from 'react';
import { queryClient, trpc } from './app';

export default function TodoList() {
  const todoList = trpc.todoList.useQuery();
  const addTodo = trpc.createTodoItem.useMutation({
    onSuccess: (data) => {
      //   queryClient.setQueryData(['todoList'], (old: TodoItem[] | undefined) => {
      //     console.log(old);
      //     console.log(data);
      //     return [...(old || []), data];
      //   });
      todoList.refetch();
    },
  });
  const completeTodo = trpc.completeTodoItem.useMutation({
    onSuccess: () => todoList.refetch(),
  });
  const markTodoIncomplete = trpc.markTodoItemIncomplete.useMutation({
    onSuccess: () => todoList.refetch(),
  });
  const [newTodo, setNewTodo] = useState('');
  const isLoading = () => {
    return (
      completeTodo.isLoading ||
      markTodoIncomplete.isLoading ||
      addTodo.isLoading ||
      todoList.isLoading
    );
  };

  return (
    <div className="m-2 flex items-center rounded-sm">
      <div className="w-full px-4 mx-auto shadow lg:w-1/3">
        <div className="flex items-center mb-6">
          <h1 className="mr-6 text-4xl font-bold text-slate-400 text-center w-full">
            Todo List
          </h1>
        </div>
        <form
          className="flex justify-center"
          onSubmit={(event) => {
            event.preventDefault();
            addTodo.mutate({ description: newTodo });
            setNewTodo('');
          }}
        >
          <label htmlFor="todo" className="pt-1 mr-2">
            Add a new todo item:{' '}
          </label>
          <TextInput
            id="todo"
            value={newTodo}
            onChanges={(v) => {
              setNewTodo(v);
            }}
          />
          <button
            disabled={!newTodo || isLoading()}
            type="submit"
            className={[
              'mx-4',
              'p-1',
              'rounded-sm',
              !newTodo || isLoading() ? 'bg-slate-200' : 'bg-green-600',
              'text-white',
            ].join(' ')}
          >
            Create
          </button>
        </form>
        <ul className="list-reset">
          {todoList.data?.map((todo) => (
            <li key={todo.id}>
              <Item
                disabled={isLoading()}
                todo={todo}
                handleClick={() => {
                  if (todo.complete) {
                    markTodoIncomplete.mutate(todo.id);
                  } else {
                    completeTodo.mutate(todo.id);
                  }
                }}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export interface TextInputProps {
  value: string;
  id: string;
  onChanges?: (newValue: string) => void;
}

function TextInput({ id, value, onChanges }: TextInputProps) {
  const [innerValue, setInnerValue] = useState(value);
  useEffect(() => {
    setInnerValue(value);
  }, [value]);
  return (
    <input
      type="text"
      value={innerValue}
      id={id}
      className="p-1 border rounded outline-none border-grey-600"
      onChange={(event) => {
        const newValue = event.target.value;
        setInnerValue(newValue);
        onChanges?.(newValue);
      }}
    />
  );
}

function Item({
  todo,
  handleClick,
  disabled,
}: {
  todo: TodoItem;
  handleClick: () => void;
  disabled: boolean;
}) {
  return (
    <div
      className="p-2 border-2 m-2 rounded-md bg-slate-200 cursor-pointer shadow"
      onClick={() => {
        handleClick();
      }}
    >
      <input
        id={`${todo.id}`}
        type="checkbox"
        checked={todo.complete}
        disabled={disabled}
        onChange={(event) => {
          event.preventDefault();
          handleClick();
        }}
      />
      <label
        htmlFor={`${todo.id}`}
        className={['pl-4', todo.complete ? 'line-through' : undefined].join(
          ' '
        )}
      >
        {todo.name}
      </label>
    </div>
  );
}
