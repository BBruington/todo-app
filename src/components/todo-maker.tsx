import "react-datepicker/dist/react-datepicker.css";
import "../styles/todo-maker.css";
import { ChangeEvent, useState } from "react";
import type { Todo } from "../types";
import { DEFAULT_TODO, TODO_TAGS } from "../constants";
import DatePicker from "react-datepicker";
import Tag from "./todo-tag";

export default function TodoMaker({
  createTodo,
}: {
  createTodo(todo: Todo): void;
}) {
  const [todo, setTodo] = useState<Todo>(DEFAULT_TODO);
  const [subtaskInput, setSubtaskInput] = useState("");
  const [deadline, setDeadline] = useState<Date>();

  function handleCreateTodo() {
    if (todo.title === "") return;
    createTodo({ ...todo, id: Date.now() });
    setTodo(DEFAULT_TODO);
  }

  function addSubtask() {
    if (todo.checklist.find((item) => item.label === subtaskInput)) return;
    setTodo({
      ...todo,
      checklist: [...todo.checklist, { isChecked: false, label: subtaskInput }],
    });
    setSubtaskInput("");
  }

  function addTag(event: ChangeEvent<HTMLSelectElement>) {
    if (todo.tags.find((item) => item === event.target.value)) return;
    if (event.target.value === "") return;
    setTodo({ ...todo, tags: [...todo.tags, event.target.value] });
  }

  function removeItem(name: string, key: string) {
    if (key === "checklist") {
      const newTags = todo.checklist.filter((item) => item.label !== name);
      setTodo({ ...todo, [key]: newTags });
    }
    if (key === "tags") {
      const newTags = todo.tags.filter((tag) => tag !== name);
      setTodo({ ...todo, [key]: newTags });
    }
  }

  function updateTimeDue(date: Date) {
    setDeadline(date);
    setTodo({ ...todo, dueDate: date });
  }

  return (
    <div className="border bg-[hsl(224,85%,8%)] border-[hsl(217.2,32.6%,17.5%)] text-white flex flex-col p-[10px_5px] w-[85vw] rounded-[15px] gap-[10px] mt-[10px] overflow-x-hidden max-w-[800px]">
      <div className="flex items-center justify-center gap-[10px]">
        <label className="w-[65px] text-[14px]" htmlFor="title">
          Title
        </label>
        <input
          className="h-6 rounded-[5px] flex-grow mr-[5px] text-white"
          id="title"
          value={todo.title}
          onChange={(e) => setTodo({ ...todo, title: e.target.value })}
          type="text"
          placeholder="Title"
        />
      </div>
      <div className="flex items-center justify-center gap-[10px]">
        <label className="w-[65px] text-[14px]" htmlFor="subtask">
          Subtasks
        </label>
        <input
          className="h-6 rounded-[5px] flex-grow mr-[5px] text-white"
          id="subtask"
          type="text"
          placeholder="Subtasks"
          value={subtaskInput}
          onKeyDown={(e) => {
            if (e.key === "Enter") addSubtask();
          }}
          onChange={(e) => setSubtaskInput(e.target.value)}
        />
      </div>
      {todo.checklist.length > 0 && (
        <div className="flex flex-col gap-[5px] overflow-y-auto max-h-[120px]">
          {todo.checklist.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center border-b border-[hsl(217.2,32.6%,17.5%)] p-[5px] rounded-[20px] bg-[rgba(12, 40, 85, 0.5)]"
            >
              <div className="pl-2">{item.label}</div>
              <button
                className="flex items-center justify-center h-[20px] w-[20px] border-none rounded-[50%] border-[rgb(11, 25, 95)] text-black hover:text-white hover:bg-[rgb(26,4,79)]"
                onClick={() => removeItem(item.label, "checklist")}
              >
                x
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="flex flex-col items-baseline justify-between gap-[10px] sm:flex-row">
        <div className="flex gap-[10px] items-center">
          <label className="w-[65px] text-[14px]" htmlFor="due-date-picker">
            Deadline
          </label>
          <DatePicker
            className="w-full"
            placeholderText="12/21/2021"
            id="due-date-picker"
            selected={deadline}
            onChange={(date) => {
              if (date) updateTimeDue(date);
            }}
          />
        </div>
        <div className="flex gap-[5px] items-center">
          <label className="w-[65px] text-[14px]" htmlFor="priority">
            Priority
          </label>
          <input
            id="priority"
            className="h-6 rounded-[5px] flex-grow mr-[5px] text-white w-[32px] ml-[5px]"
            placeholder="Priority"
            value={todo.priority}
            onChange={(e) => {
              if (Number(e.target.value) < 1 || Number(e.target.value) > 10)
                return;
              setTodo({ ...todo, priority: Number(e.target.value) });
            }}
            type="number"
          />
          <label className="w-[75px] text-[14px]" htmlFor="complexity">
            Complexity
          </label>
          <input
            id="complexity"
            className="h-6 rounded-[5px] flex-grow mr-[5px] text-white w-[32px]"
            placeholder="complexity"
            value={todo.complexity}
            onChange={(e) => {
              if (Number(e.target.value) < 1 || Number(e.target.value) > 10)
                return;
              setTodo({ ...todo, complexity: Number(e.target.value) });
            }}
            type="number"
          />
        </div>
      </div>

      <div className="flex justify-center items-center gap-[10px] mr-[5px]">
        <label className="w-[65px] text-[14px]" htmlFor="tag-select">
          Tags
        </label>
        <select
          className="rounded-[5px] h-[30px] flex-grow"
          onChange={addTag}
          name="tags"
          id="tag-select"
        >
          <option value="">-Choose an option-</option>
          {TODO_TAGS.map((name) => (
            <option key={name} value={name.toLocaleLowerCase()}>
              {name}
            </option>
          ))}
        </select>
      </div>
      {todo.tags.length > 0 && (
        <div className="flex justify-center gap-[5px]">
          {todo.tags.map((tag) => (
            <Tag label={tag} removeItem={removeItem} key={tag}></Tag>
          ))}
        </div>
      )}
      <button
        className="create-todo h-[2rem] my-[5px] mx-[10px] text-white rounded-[20px] border-black bg-[rgba(90,24,244,0.5)]"
        onClick={handleCreateTodo}
      >
        Create Todo
      </button>
    </div>
  );
}
