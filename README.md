# FYP Task Scanner

A mid-level Next.js project that scans a realistic todo backlog and surfaces tasks that are likely being ignored.

## Features

- 35 realistic FYP-related tasks (real-world style, easy-to-forget items)
- Risk scanning logic based on:
  - due date urgency / overdue days
  - days since task was last touched
  - task priority and status
- Interactive controls:
  - keyword search
  - category filter
  - status filter
  - high-risk-only toggle
  - sorting by risk, due date, or priority
- Dashboard summary cards for quick tracking

## Run Locally

```bash
npm install
npm run dev
```

Open http://localhost:3000 in your browser.

## Project Structure

- `src/data/todos.ts` – realistic task dataset
- `src/lib/taskScanner.ts` – scanning + risk scoring rules
- `src/components/TodoScanner.tsx` – interactive dashboard UI
- `src/app/page.tsx` – page entry

## Notes

This starter is intentionally built as a medium-sized baseline for an FYP workflow product, so you can extend it with API persistence, auth, and analytics later.
