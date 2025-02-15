"use client"

import * as React from "react"
import {
  addDays,
  addMonths,
  addWeeks,
  addYears,
  format,
  isThisMonth,
  isThisWeek,
  isThisYear,
  isToday,
  parseISO,
} from "date-fns"
import { CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Frequency = "daily" | "weekly" | "monthly" | "yearly"

interface Task {
  id: string
  name: string
  date: string
  frequency: Frequency
  completed: boolean
}

export default function TasksPage() {
  const [tasks, setTasks] = React.useState<Task[]>([
    { id: "1", name: "Review weekly goals", date: new Date().toISOString(), frequency: "weekly", completed: false },
    {
      id: "2",
      name: "Monthly team meeting",
      date: addDays(new Date(), 5).toISOString(),
      frequency: "monthly",
      completed: false,
    },
    { id: "3", name: "Daily standup", date: new Date().toISOString(), frequency: "daily", completed: false },
    {
      id: "4",
      name: "Yearly planning",
      date: addMonths(new Date(), 2).toISOString(),
      frequency: "yearly",
      completed: false,
    },
    {
      id: "5",
      name: "Weekly report",
      date: addDays(new Date(), 2).toISOString(),
      frequency: "weekly",
      completed: false,
    },
    {
      id: "6",
      name: "Quarterly review",
      date: addMonths(new Date(), 1).toISOString(),
      frequency: "monthly",
      completed: false,
    },
  ])

  const completeTask = (taskId: string) => {
    setTasks((currentTasks) => {
      const taskIndex = currentTasks.findIndex((t) => t.id === taskId)
      if (taskIndex === -1) return currentTasks

      const task = currentTasks[taskIndex]
      const newTasks = [...currentTasks]

      // Mark current task as completed
      newTasks[taskIndex] = { ...task, completed: true }

      // Create next task based on frequency
      const currentDate = parseISO(task.date)
      let nextDate: Date

      switch (task.frequency) {
        case "daily":
          nextDate = addDays(currentDate, 1)
          break
        case "weekly":
          nextDate = addWeeks(currentDate, 1)
          break
        case "monthly":
          nextDate = addMonths(currentDate, 1)
          break
        case "yearly":
          nextDate = addYears(currentDate, 1)
          break
      }

      // Add new task
      newTasks.push({
        id: Date.now().toString(),
        name: task.name,
        date: nextDate.toISOString(),
        frequency: task.frequency,
        completed: false,
      })

      return newTasks
    })
  }

  const updateTaskDate = (taskId: string, newDate: Date) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) => (task.id === taskId ? { ...task, date: newDate.toISOString() } : task)),
    )
  }

  const filterTasks = (filterFn: (date: Date) => boolean) => {
    return tasks
      .filter((task) => !task.completed && filterFn(parseISO(task.date)))
      .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime())
  }

  const TaskTable = ({ tasks }: { tasks: Task[] }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">Done</TableHead>
          <TableHead>Task</TableHead>
          <TableHead className="w-[120px]">Frequency</TableHead>
          <TableHead className="w-[180px]">Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tasks.map((task) => (
          <TableRow key={task.id}>
            <TableCell>
              <Checkbox checked={task.completed} onCheckedChange={() => completeTask(task.id)} />
            </TableCell>
            <TableCell>{task.name}</TableCell>
            <TableCell>
              <Badge variant="secondary" className="capitalize">
                {task.frequency}
              </Badge>
            </TableCell>
            <TableCell>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(parseISO(task.date), "PPP")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={parseISO(task.date)}
                    onSelect={(date) => date && updateTaskDate(task.id, date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )

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
                  <TaskTable tasks={tasks} />
                </CardContent>
              </Card>
            ),
        )}
      </div>
    </div>
  )
}

