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
    <div>
      <h1>Todo List</h1>
      <form
        onSubmit={(event) => {
          console.log('submitting');
          event.preventDefault();
          addTodo.mutate({ description: newTodo });
          setNewTodo('');
        }}
      >
        <label htmlFor="todo">Add a new todo item: </label>
        <TextInput
          id="todo"
          value={newTodo}
          onChanges={(v) => {
            setNewTodo(v);
          }}
        />
        <button disabled={!newTodo || isLoading()} type="submit">
          Create
        </button>
      </form>
      <ul>
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
    <>
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
      <label htmlFor={`${todo.id}`}>{todo.name}</label>
    </>
  );
}
