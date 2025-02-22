import { Suspense } from "react"
import { isThisMonth, isThisWeek, isThisYear, isToday } from "date-fns"
import { getTasks } from "@/actions/tasks"
import TaskTable from "@/components/TaskTable"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import CreateTaskForm from "@/components/CreateTaskForm"

export const dynamic = "force-dynamic"

export default async function TasksPage() {
  const tasks = await getTasks()

  const filterTasks = (filterFn: (date: Date) => boolean) => {
    return tasks
      .filter((task) => filterFn(new Date(task.date)))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }

  const todayTasks = filterTasks(isToday)
  const thisWeekTasks = filterTasks((date) => isThisWeek(date) && !isToday(date))
  const thisMonthTasks = filterTasks((date) => isThisMonth(date) && !isThisWeek(date))
  const thisYearTasks = filterTasks((date) => isThisYear(date) && !isThisMonth(date))

  return (
    <div className="w-full p-8 space-y-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Tasks</h1>
        <p className="text-muted-foreground">Manage your recurring tasks</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create New Task</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateTaskForm />
        </CardContent>
      </Card>

      <div className="space-y-8">
        {[
          { title: "Today", tasks: todayTasks },
          { title: "This Week", tasks: thisWeekTasks },
          { title: "This Month", tasks: thisMonthTasks },
          { title: "This Year", tasks: thisYearTasks },
        ].map(
          ({ title, tasks }) =>
            tasks.length > 0 && (
              <Card key={title}>
                <CardHeader>
                  <CardTitle>{title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Suspense fallback={<div>Loading tasks...</div>}>
                    <TaskTable tasks={tasks} />
                  </Suspense>
                </CardContent>
              </Card>
            ),
        )}
      </div>
    </div>
  )
}

