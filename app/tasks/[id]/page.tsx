import TaskDetails from "@/components/TaskDetails"

import { getTask } from "@/actions/tasks"

export default async function TaskDetailPage({params}: {params: {id: string}}) {
  const { id: taskId } = await params
  const task = await getTask(taskId)


   return <TaskDetails task={task} />

}

