import { ScannedTodo, TodoItem } from "@/types/todo";

export interface ScanFilters {
  query: string;
  category: string;
  status: string;
  highRiskOnly: boolean;
  sortBy: "risk" | "due" | "priority";
}

const priorityWeight: Record<TodoItem["priority"], number> = {
  Low: 6,
  Medium: 14,
  High: 25,
};

const statusWeight: Record<TodoItem["status"], number> = {
  Done: -35,
  "In Progress": -10,
  Pending: 12,
};

const prioritySortWeight: Record<TodoItem["priority"], number> = {
  High: 3,
  Medium: 2,
  Low: 1,
};

export function toScannedTodo(todo: TodoItem): ScannedTodo {
  const dueInDays = calculateDueInDays(todo.dueDate);
  const isOverdue = dueInDays < 0;

  let score = 0;

  score += priorityWeight[todo.priority];
  score += statusWeight[todo.status];
  score += Math.min(todo.lastTouchedDays, 45);

  if (todo.lastTouchedDays >= 14) {
    score += 10;
  }

  if (isOverdue) {
    score += Math.min(Math.abs(dueInDays) * 5, 35);
  } else if (dueInDays <= 2) {
    score += 15;
  } else if (dueInDays <= 5) {
    score += 8;
  }

  if (todo.tags.includes("submission") || todo.tags.includes("supervisor")) {
    score += 6;
  }

  const riskScore = clamp(score, 0, 100);

  return {
    ...todo,
    dueInDays,
    isOverdue,
    riskScore,
    riskLabel: toRiskLabel(riskScore),
  };
}

export function scanTodos(todos: TodoItem[], filters: ScanFilters): ScannedTodo[] {
  const normalizedQuery = filters.query.trim().toLowerCase();

  return todos
    .map(toScannedTodo)
    .filter((todo) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        [todo.title, todo.description, todo.category, ...todo.tags]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);

      const matchesCategory = filters.category === "All" || todo.category === filters.category;
      const matchesStatus = filters.status === "All" || todo.status === filters.status;
      const matchesRisk = !filters.highRiskOnly || todo.riskScore >= 60;

      return matchesQuery && matchesCategory && matchesStatus && matchesRisk;
    })
    .sort((a, b) => {
      if (filters.sortBy === "risk") {
        return b.riskScore - a.riskScore;
      }

      if (filters.sortBy === "due") {
        return a.dueInDays - b.dueInDays;
      }

      return prioritySortWeight[b.priority] - prioritySortWeight[a.priority];
    });
}

function calculateDueInDays(dueDate: string): number {
  const today = new Date();
  const due = new Date(dueDate);

  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);

  return Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function toRiskLabel(score: number): ScannedTodo["riskLabel"] {
  if (score >= 80) return "Critical";
  if (score >= 60) return "High";
  if (score >= 35) return "Medium";
  return "Low";
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
