"use client";

import { useMemo, useState } from "react";
import { initialTodos } from "@/data/todos";
import { scanTodos } from "@/lib/taskScanner";
import { TodoCategory, TodoStatus } from "@/types/todo";
import styles from "@/app/page.module.css";

const categories: Array<"All" | TodoCategory> = [
  "All",
  "Research",
  "Development",
  "Testing",
  "Documentation",
  "Deployment",
  "Meetings",
  "Admin",
];
// TODO: Do new things
const statuses: Array<"All" | TodoStatus> = ["All", "Pending", "In Progress", "Done"];
// HACK: Fix this!
export default function TodoScanner() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const [status, setStatus] = useState<(typeof statuses)[number]>("All");
  const [highRiskOnly, setHighRiskOnly] = useState(false);
  const [sortBy, setSortBy] = useState<"risk" | "due" | "priority">("risk");

  const scannedTodos = useMemo(
    () =>
      scanTodos(initialTodos, {
        query,
        category,
        status,
        highRiskOnly,
        sortBy,
      }),
    [query, category, status, highRiskOnly, sortBy],
  );

  const criticalCount = scannedTodos.filter((todo) => todo.riskLabel === "Critical").length;
  const overdueCount = scannedTodos.filter((todo) => todo.isOverdue).length;
  const ignoredLikelyCount = scannedTodos.filter((todo) => todo.riskScore >= 60).length;

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <section className={styles.header}>
          <h1>FYP Task Scanner</h1>
          <p>
            Mid-level Next.js dashboard for scanning realistic project todos and highlighting the ones
            most likely to be forgotten.
          </p>
        </section>

        <section className={styles.stats}>
          <article className={styles.statCard}>
            <span>Total Tasks</span>
            <strong>{scannedTodos.length}</strong>
          </article>
          <article className={styles.statCard}>
            <span>Critical Risk</span>
            <strong>{criticalCount}</strong>
          </article>
          <article className={styles.statCard}>
            <span>Overdue</span>
            <strong>{overdueCount}</strong>
          </article>
          <article className={styles.statCard}>
            <span>Likely Ignored</span>
            <strong>{ignoredLikelyCount}</strong>
          </article>
        </section>

        <section className={styles.controls}>
          <input
            className={styles.search}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tasks, tags, categories..."
          />

          <select value={category} onChange={(e) => setCategory(e.target.value as (typeof categories)[number])}>
            {categories.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <select value={status} onChange={(e) => setStatus(e.target.value as (typeof statuses)[number])}>
            {statuses.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value as "risk" | "due" | "priority")}>
            <option value="risk">Sort: Risk</option>
            <option value="due">Sort: Due Date</option>
            <option value="priority">Sort: Priority</option>
          </select>

          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={highRiskOnly}
              onChange={(e) => setHighRiskOnly(e.target.checked)}
            />
            High risk only
          </label>
        </section>

        <section className={styles.todoList}>
          {scannedTodos.map((todo) => (
            <article key={todo.id} className={styles.todoCard}>
              <div className={styles.todoTop}>
                <h2>{todo.title}</h2>
                <span className={`${styles.riskBadge} ${styles[`risk${todo.riskLabel}`]}`}>
                  {todo.riskLabel} ({todo.riskScore})
                </span>
              </div>

              <p>{todo.description}</p>

              <div className={styles.todoMeta}>
                <span>{todo.category}</span>
                <span>{todo.priority} priority</span>
                <span>{todo.status}</span>
                <span>
                  {todo.isOverdue
                    ? `${Math.abs(todo.dueInDays)} day(s) overdue`
                    : `Due in ${todo.dueInDays} day(s)`}
                </span>
                <span>{todo.lastTouchedDays} day(s) since update</span>
              </div>

              <div className={styles.tags}>
                {todo.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>
                    #{tag}
                  </span>
                ))}
              </div>
            </article>
          ))}

          {scannedTodos.length === 0 ? (
            <div className={styles.emptyState}>No tasks match the current scan filters.</div>
          ) : null}
        </section>
      </main>
    </div>
  );
}
