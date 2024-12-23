import { atom } from "jotai";
import { Todo } from "./types";

const powerModeAtom = atom<boolean>(false);
const getTodos = localStorage.getItem("todos");
const allTodosAtom = atom<Todo[]>(
  getTodos ? (JSON.parse(getTodos) as Todo[]) : []
);

export { powerModeAtom, allTodosAtom };
