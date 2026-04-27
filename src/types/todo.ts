export type TodoCategory =
  | "Research"
  | "Development"
  | "Testing"
  | "Documentation"
  | "Deployment"
  | "Meetings"
  | "Admin";

export type TodoPriority = "Low" | "Medium" | "High";

export type TodoStatus = "Pending" | "In Progress" | "Done";

export interface TodoItem {
  id: number;
  title: string;
  description: string;
  category: TodoCategory;
  priority: TodoPriority;
  status: TodoStatus;
  dueDate: string;
  lastTouchedDays: number;
  tags: string[];
}

export interface ScannedTodo extends TodoItem {
  dueInDays: number;
  riskScore: number;
  riskLabel: "Low" | "Medium" | "High" | "Critical";
  isOverdue: boolean;
}
