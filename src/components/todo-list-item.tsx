import { Todo } from "../types";
import { ChangeEvent } from "react";
import { useAtom } from "jotai";
import { allTodosAtom } from "../jotaiAtoms";
import Tag from "./todo-tag";

export default function TodoListItem({
  todo,
  setFilteredTodos,
  filteredTodos,
}: {
  todo: Todo;
  filteredTodos: Todo[];
  setFilteredTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
}) {
  const [allTodos, setAllTodos] = useAtom(allTodosAtom);
  const daysLeft = daysUntil(todo.dueDate);

  function daysUntil(date: Date | undefined) {
    if (date === undefined) return;
    const today = new Date();
    const futureDate = new Date(date);
    const diffInMs = futureDate.getTime() - today.getTime();
    const days = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

    return days;
  }

  function updateTodosData(updatedTodo: Todo) {
    const updatedTodos = allTodos.map((unfilteredTodo) => {
      if (todo.id === unfilteredTodo.id) return updatedTodo;
      return unfilteredTodo;
    });
    setAllTodos(updatedTodos);
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
  }

  function checkBoxAll() {
    const allCheckListItems = todo.checklist.map((item) => {
      return { ...item, isChecked: !todo.isChecked };
    });

    const updatedTodo = {
      ...todo,
      isChecked: !todo.isChecked,
      checklist: allCheckListItems,
    };

    updateTodosData(updatedTodo);
    setFilteredTodos(
      filteredTodos.map((item) => {
        if (item.id === todo.id) return updatedTodo;
        return item;
      })
    );
  }

  function checkBoxListItem(label: string) {
    const allCheckListItems = todo.checklist.map((item) => {
      if (item.label === label) return { ...item, isChecked: !item.isChecked };
      return item;
    });
    const updatedTodo = {
      ...todo,
      checklist: allCheckListItems,
    };
    updateTodosData(updatedTodo);
    setFilteredTodos(
      filteredTodos.map((item) => {
        if (item.id === todo.id) return updatedTodo;
        return item;
      })
    );
  }

  function updateTitle(value: string) {
    const updatedTodo = { ...todo, title: value };
    updateTodosData(updatedTodo);
    setFilteredTodos(() =>
      filteredTodos.map((item) => {
        if (item.id === todo.id) return updatedTodo;
        return item;
      })
    );
  }

  function removeTodo() {
    setFilteredTodos(() => filteredTodos.filter((item) => item.id !== todo.id));
    const updatedTodos = allTodos.filter(
      (unfilteredTodo) => todo.id !== unfilteredTodo.id
    );
    setAllTodos(updatedTodos);
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
  }

  function getDeadlineLabel(daysLeft: number) {
    if (daysLeft < 0) return "missed deadline";
    if (daysLeft === 0) return "due today";
    if (daysLeft === 1) return "due tomorrow";
    return `${daysLeft} days left`;
  }

  return (
    <div className="py-1 border-b border-[hsl(217.2,32.6%,17.5%)]">
      <div className="flex items-center justify-between gap-2">
        <input
          type="checkbox"
          checked={todo.isChecked}
          onChange={checkBoxAll}
        />
        <textarea
          className={`text-[15px] flex-grow ${
            todo.isChecked && "bg-gray-400 text-black line-through"
          }`}
          value={todo.title}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            updateTitle(e.target.value)
          }
        />
        <div>
          <div>Priority: {todo.priority}</div>
          <div>Complexity: {todo.complexity}</div>
        </div>
        <button
          className="flex rounded-[50%] w-5 h-5 items-center justify-center hover:text-white hover:bg-[rgb(30,30,159)]"
          onClick={removeTodo}
        >
          x
        </button>
      </div>
      <div className="flex gap-1">
        {todo.tags.map((tag) => (
          <Tag key={tag} label={tag} />
        ))}
        {daysLeft !== undefined && (
          <Tag dueDate={daysLeft} label={getDeadlineLabel(daysLeft) || ""} />
        )}
      </div>
      {todo.checklist.length > 0 && (
        <>
          <div>Subtasks: </div>
          {todo.checklist.map((item) => (
            <div
              key={item.label}
              className={`flex ml-[25px] gap-2 ${
                item.isChecked && "bg-gray-400 text-black line-through"
              }`}
            >
              <input
                type="checkbox"
                checked={item.isChecked}
                onChange={() => checkBoxListItem(item.label)}
              />
              <div
                className={`pl-1 w-full text-left ${
                  item.isChecked && "bg-gray-400 text-black line-through"
                }`}
              >
                {item.label}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
