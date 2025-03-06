import * as React from "react"

import { getTasks } from "@/actions/tasks"
import TaskList from "@/components/TaskList"

// interface Task {
//   id: string
//   name: string
//   date: string
//   frequency: number
//   history: string[]
// }

export default async function TasksPage() {
  const tasks = await getTasks()

  return <TaskList tasks={tasks} />
}

