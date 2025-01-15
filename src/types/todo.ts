// src/types/todo.ts
export interface Todo {
  id?: string;
  title: string;
  completed: boolean;
  category: string;
  priority: "low" | "medium" | "high";
  createdAt: Date;
}
