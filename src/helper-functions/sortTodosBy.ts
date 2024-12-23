import type { Todo } from "../types";

const convertDate = (date: Date | string) => {
  if (typeof date === "string") return new Date(date).getTime();
  return date.getTime();
};

export function sortBy(
  todos: Todo[],
  sortBy: "ASCENDING" | "DESCENDING",
  key: "priority" | "complexity" | "dueDate"
) {
  return [...todos].sort((a, b) => {
    let valueA =
      a[key] !== undefined
        ? a[key]
        : sortBy === "ASCENDING"
        ? Infinity
        : -Infinity;
    let valueB =
      b[key] !== undefined
        ? b[key]
        : sortBy === "ASCENDING"
        ? Infinity
        : -Infinity;
    if (key === "dueDate") {
      if (a[key]) valueA = convertDate(a[key] as Date);
      if (b[key]) valueB = convertDate(b[key] as Date);
    }
    return sortBy === "ASCENDING"
      ? (valueA as number) - (valueB as number)
      : (valueB as number) - (valueA as number);
  });
}
