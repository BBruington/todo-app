import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { Todo } from "../types";
import { sortBy } from "../helper-functions/sortTodosBy";
import { powerModeAtom, allTodosAtom } from "../jotaiAtoms";
import LoadingBar from "./loading-bar";

type PowerTodoProps = {
  filteredTodos: Todo[];
  setFilteredTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
};

export default function PowerTodo({
  filteredTodos,
  setFilteredTodos,
}: PowerTodoProps) {
  const [allTodos, setAllTodos] = useAtom(allTodosAtom);
  const [power, setPower] = useAtom(powerModeAtom);

  const findCompletedAmount = (todos: Todo[]) =>
    todos.filter((todo) => todo.isChecked === true).length;

  const findPercentageCompleted = (todos: Todo[], amountCompleted: number) =>
    Math.floor((amountCompleted / todos.length) * 100);

  const [percentage, setPercentage] = useState(
    findPercentageCompleted(allTodos, findCompletedAmount(allTodos))
  );

  useEffect(() => {
    const todosByPriority = [...allTodos]
      .filter((todo) => todo.isChecked === false)
      .sort((a, b) => b.complexity + b.priority - a.complexity - a.priority);
    setFilteredTodos(todosByPriority);
  }, []);

  function finishTodo() {
    const updatedTodos = checkmarkTodo(allTodos, filteredTodos[0].id);
    setAllTodos(updatedTodos);
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
    setFilteredTodos(updatedTodos.filter((todo) => todo.isChecked === false));
    updatePercentageCompleted(updatedTodos);
  }

  function checkmarkTodo(todos: Todo[], todoId: number) {
    return todos.map((todo) => {
      if (todo.id === todoId)
        return {
          ...todo,
          isChecked: true,
          checklist: todo.checklist.map((item) => {
            return { ...item, isChecked: true };
          }),
        };
      return todo;
    });
  }

  function updatePercentageCompleted(todos: Todo[]) {
    const amountFinished = findCompletedAmount(todos);
    const amount = findPercentageCompleted(todos, amountFinished);
    setPercentage(amount);
    return amount;
  }

  function endPowerMode() {
    setFilteredTodos(allTodos);
    setPower(false);
  }

  function orderPowerTodos(
    order: "ASCENDING" | "DESCENDING",
    key: "dueDate" | "complexity"
  ) {
    const sorted = sortBy(filteredTodos, order, key);
    setFilteredTodos(sorted);
  }

  if (filteredTodos.length < 1)
    return (
      <div className="flex flex-col items-center justify-center gap-[15px] bg-black width-[95vw] min-h-[100vh]">
        Get some todos{" "}
        <button
          className="p-1 rounded-[15px] hover:bg-blue-800"
          onClick={endPowerMode}
        >
          End Power Mode
        </button>
      </div>
    );

  return (
    <div className="flex flex-col items-center justify-center bg-black width-[95vw] min-h-[100vh]">
      <div className="flex flex-col gap-5 items-center w-[90vw] py-[20px] bg-[hsl(224,85%,8%)] rounded-[10px] border border-[hsl(217.2,32.6%,17.5%)]">
        <div className="flex gap-3">
          <label htmlFor="power-title" className="text-[30px]">
            Task:
          </label>
          <div className="text-[30px]" id="power-title">
            {filteredTodos[0].title}
          </div>
        </div>
        <div className="flex flex-col gap-3">
          {filteredTodos[0].checklist.length > 0 && (
            <>
              <label htmlFor="" className="text-[20px]">
                Subtasks:{" "}
              </label>
              <div className="flex flex-col list-none gap-[5px]">
                {filteredTodos[0].checklist.map((item) => (
                  <div className="subtask-item">-{item.label}</div>
                ))}
              </div>
            </>
          )}
        </div>
        <div className="flex gap-2">
          <label htmlFor="">Complexity: </label>
          <div>{filteredTodos[0].complexity}</div>
          <label htmlFor="">Priority: </label>
          <div>{filteredTodos[0].priority}</div>
        </div>
        <div>Sort Tasks by:</div>
        <div className="flex-container">
          <button
            className="h-7 rounded-[15px] w-36 hover:bg-[hsl(225,85%,37%)]"
            onClick={() => orderPowerTodos("DESCENDING", "complexity")}
          >
            Complexity
          </button>
          <button
            className="h-7 rounded-[15px] w-36 hover:bg-[hsl(225,85%,37%)]"
            onClick={() => orderPowerTodos("ASCENDING", "dueDate")}
          >
            Deadline
          </button>
        </div>
        <LoadingBar percentage={percentage} />
        <div>
          {findCompletedAmount(allTodos)} out of {allTodos.length} completed
        </div>
        <div className="flex-container">
          <button
            className="h-7 rounded-[15px] w-36 bg-[#ff0000] text-white hover:bg-[rgb(177,14,14)]"
            onClick={endPowerMode}
          >
            End Power Mode
          </button>
          <button
            className="h-7 rounded-[15px] w-36 bg-[rgb(17,107,17)] text-white hover:bg-[rgb(16,67,16)]"
            onClick={finishTodo}
          >
            Finish Todo
          </button>
        </div>
      </div>
    </div>
  );
}
