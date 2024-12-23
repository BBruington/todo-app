import { useState } from "react";
import { useAtom } from "jotai";
import { Todo } from "./types";
import { powerModeAtom, allTodosAtom } from "./jotaiAtoms";
import TodoList from "./components/todo-list";
import TodoMaker from "./components/todo-maker";
import PowerTodo from "./components/power-mode-todo";

export default function App() {
  const [allTodos, setAllTodos] = useAtom(allTodosAtom);
  const [powerMode, setPower] = useAtom(powerModeAtom);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>(allTodos);

  function createTodo(todo: Todo) {
    const updated = [...allTodos, todo];
    setAllTodos(updated);
    setFilteredTodos(updated);
    localStorage.setItem("todos", JSON.stringify(updated));
  }

  if (powerMode)
    return (
      <PowerTodo
        filteredTodos={filteredTodos}
        setFilteredTodos={setFilteredTodos}
      />
    );

  return (
    <div className="flex flex-col items-center gap-4 font-sans text-center bg-black w-[95vw] min-h-screen">
      <TodoMaker createTodo={createTodo} />
      <TodoList
        filteredTodos={filteredTodos}
        setFilteredTodos={setFilteredTodos}
      />
    </div>
  );
}
