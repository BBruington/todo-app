import "../styles/todo-list.css";
import { Todo } from "../types";
import { ChangeEvent, useRef, useState } from "react";
import { TODO_TAGS } from "../constants";
import { useAtom } from "jotai";
import { powerModeAtom, allTodosAtom } from "../jotaiAtoms";
import { sortBy } from "../helper-functions/sortTodosBy";
import TodoListItem from "./todo-list-item";
import Tag from "./todo-tag";

type TodoListProps = {
  filteredTodos: Todo[];
  setFilteredTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
};

type FilterTag = {
  isActive: boolean;
  label: string;
};

export default function TodoList({
  filteredTodos,
  setFilteredTodos,
}: TodoListProps) {
  const [filterInput, setFilterInput] = useState("");
  const filterTags = useRef<FilterTag[]>(
    TODO_TAGS.map((tag) => {
      return { isActive: false, label: tag };
    })
  );
  const [selectOrder, setSelectOrder] = useState<
    "ASCENDING" | "DESCENDING" | undefined
  >();
  const [selectKey, setSelectKey] = useState<
    "complexity" | "priority" | undefined
  >();
  const [powerMode, setPowerMode] = useAtom(powerModeAtom);
  const [allTodos, setAllTodos] = useAtom(allTodosAtom);

  type filterTodoProps = {
    selectOrder: "ASCENDING" | "DESCENDING" | undefined;
    filterInput: string;
    selectKey: "complexity" | "priority" | "dueDate" | undefined;
  };

  function filterTodos({
    selectOrder,
    filterInput,
    selectKey,
  }: filterTodoProps) {
    let filteredTodos = allTodos;
    if (selectOrder && selectKey)
      filteredTodos = sortBy(allTodos, selectOrder, selectKey);
    if (filterInput !== "") {
      filteredTodos = filteredTodos.filter((item) =>
        item.title.toLowerCase().includes(filterInput.toLowerCase())
      );
    }
    const todosByTags = findTodosByTags(filteredTodos, filterTags.current);
    setFilteredTodos(todosByTags);
    return todosByTags;
  }

  function enablePowerMode() {
    setPowerMode(true);
  }

  function updateSortTags(label: string, isActive: boolean) {
    const updatedTags = filterTags.current.map((tag) => {
      if (tag.label === label) return { ...tag, isActive: !isActive };
      return tag;
    });
    filterTags.current = updatedTags;
    filterTodos({
      selectOrder,
      filterInput,
      selectKey,
    });
  }

  function findTodosByTags(todos: Todo[], tags: FilterTag[]) {
    return todos.filter((todo) =>
      tags.every((tag) => {
        if (tag.isActive)
          return todo.tags.includes(tag.label.toLocaleLowerCase());
        return true;
      })
    );
  }

  return (
    <div className="flex flex-col py-[10px] px-[5px] gap-[10px] max-w-[800px] w-[85vw] border border-[hsl(217.2,32.6%,17.5%)] bg-[hsl(224,85%,8%)] rounded-[15px]">
      <h3 className="m-2">My Todos</h3>
      <div>Sort by: </div>
      <div className="flex items-center justify-center gap-2 mx-3 flex-col sm:flex-row">
        <div className="flex-container">
          <select
            className="h-[2rem] w-24 rounded-[5px] text-[13px] p-[3px] border border-black"
            name="complexities"
            id="sort-select"
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              const selectOrder = e.target.value as
                | "ASCENDING"
                | "DESCENDING"
                | undefined;
              setSelectOrder(selectOrder);
              setSelectKey("complexity");
              filterTodos({
                selectOrder,
                filterInput,
                selectKey: "complexity",
              });
            }}
          >
            <option value={undefined}>Complexity</option>
            <option value={undefined}>Default</option>
            <option value="ASCENDING">Lowest</option>
            <option value="DESCENDING">Highest</option>
          </select>
          <select
            className="h-[2rem] w-24 rounded-[5px] text-[13px] p-[3px] border border-black"
            name="priorities"
            id="sort-select"
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              const selectOrder = e.target.value as
                | "ASCENDING"
                | "DESCENDING"
                | undefined;
              setSelectOrder(selectOrder);
              setSelectKey("priority");
              filterTodos({
                selectOrder,
                filterInput,
                selectKey: "priority",
              });
            }}
          >
            <option value={undefined}>Priority</option>
            <option value={undefined}>Default</option>
            <option value="ASCENDING">Lowest</option>
            <option value="DESCENDING">Highest</option>
          </select>
          <button
            className="h-[2rem] w-20 rounded-[20px] text-[13px] p-[3px] border border-black hover:bg-[hsl(217,75%,36%)]"
            onClick={() =>
              filterTodos({
                selectKey: "dueDate",
                filterInput,
                selectOrder: "ASCENDING",
              })
            }
          >
            DeadLine
          </button>
        </div>
        <div className="flex-container">
          <input
            className="h-7"
            type="text"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setFilterInput(e.target.value);
              filterTodos({
                selectOrder,
                filterInput: e.target.value,
                selectKey,
              });
            }}
            placeholder="Search By"
          />
          <button
            className="power-button h-7 text-white rounded-[20px] border border-[rgb(23,42,136)] bg-[rgb(107,33,211)] text-[13px] p-1 relative overflow-hidden"
            onClick={enablePowerMode}
          >
            Power Mode
          </button>
        </div>
      </div>
      <div className="flex justify-center gap-1">
        {filterTags.current.map((tag) => (
          <button
            key={tag.label}
            className="bg-inherit rounded-[20px] p-0"
            onClick={() => updateSortTags(tag.label, tag.isActive)}
          >
            <Tag label={tag.label} isActive={tag.isActive} />
          </button>
        ))}
      </div>

      {filteredTodos.length > 0 &&
        filteredTodos.map((todo) => (
          <TodoListItem
            key={todo.id}
            todo={todo}
            filteredTodos={filteredTodos}
            setFilteredTodos={setFilteredTodos}
          />
        ))}
    </div>
  );
}
