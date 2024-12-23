export type ListItem = {
  isChecked: boolean;
  label: string;
};

export type Todo = {
  id: number;
  title: string;
  priority: number;
  complexity: number;
  checklist: ListItem[];
  dueDate: Date | undefined;
  tags: string[];
  isChecked: boolean;
};
