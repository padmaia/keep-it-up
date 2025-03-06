"use client"

import * as React from "react"
import { addDays, isToday, parseISO, format, isSameDay, isAfter } from "date-fns"
import { CalendarIcon, PlusIcon, CheckIcon } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { AddTaskForm } from "@/components/AddTaskForm"
import { useMediaQuery } from "@/hooks/use-media-query"
import { cn } from "@/lib/utils"

import { completeTask, updateTaskDate } from "@/actions/tasks"

interface Task {
  id: string
  name: string
  date: string
  frequency: number
  completed: boolean
  history: string[]
}

export default function TaskList({tasks}: {tasks: Task[]}) {
  const isMobile = useMediaQuery("(max-width: 640px)")

  const filterTasks = () => {
    const today = new Date()
    const nextSevenDays = Array.from({ length: 7 }, (_, i) => addDays(today, i + 1))

    const filteredTasks = {
      today: tasks.filter((task) => !task.completed && isToday(parseISO(task.date))),
      nextSevenDays: nextSevenDays.map((date) => ({
        date,
        tasks: tasks.filter((task) => !task.completed && isSameDay(parseISO(task.date), date)),
      })),
      later: tasks.filter((task) => !task.completed && isAfter(parseISO(task.date), nextSevenDays[6])),
    }

    return filteredTasks
  }

  const TaskList = ({ tasks }: { tasks: Task[] }) => {
    return (
      <div className="space-y-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-secondary/50 transition-colors duration-200"
          >
            <Button
              size="sm"
              variant="outline"
              className="rounded-full p-0 w-6 h-6 flex items-center justify-center hover:bg-primary hover:text-primary-foreground"
              onClick={() => completeTask(task.id)}
            >
              <CheckIcon className="h-4 w-4" />
            </Button>
            <div className="flex-1">
              <Link href={`/tasks/${task.id}`}>
                <span className="text-sm font-medium text-primary-foreground">{task.name}</span>
                <span className="ml-2 text-xs text-muted-foreground">{format(parseISO(task.date), "MMM d")}</span>
              </Link>
            </div>
            <Badge variant="outline" className="bg-secondary/50 text-xs text-primary-foreground">
              {task.frequency}d
            </Badge>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <CalendarIcon className="h-4 w-4 text-primary" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={parseISO(task.date)}
                  onSelect={(date) => date && updateTaskDate(task.id, date.toISOString())}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        ))}
      </div>
    )
  }

  const filteredTasks = filterTasks()

  return (
      <div className="max-w-3xl mx-auto">
        <div className="space-y-8">
          {filteredTasks.today.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-primary">Today</h2>
              <TaskList tasks={filteredTasks.today} />
            </div>
          )}
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-primary">Coming Up</h2>
            {filteredTasks.nextSevenDays.map(
              ({ date, tasks }) =>
                tasks.length > 0 && (
                  <div key={date.toISOString()} className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">{format(date, "EEEE, MMM d")}</h3>
                    <TaskList tasks={tasks} />
                  </div>
                ),
            )}
            {filteredTasks.later.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Later</h3>
                <TaskList tasks={filteredTasks.later} />
              </div>
            )}
          </div>
        </div>
        <div
        className={cn(
          "fixed z-10 top-4 right-4",
          !isMobile && "top-6 right-6", // Slight adjustment for desktop view
        )}
      >
        <AddTaskForm>
          <Button size="icon" variant="outline" className="rounded-full">
            <PlusIcon className="h-4 w-4" />
          </Button>
        </AddTaskForm>
      </div>
      </div>

  )
}

