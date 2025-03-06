"use client"

import { format, parseISO } from "date-fns"
import { CalendarIcon } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import type { Task } from "@prisma/client"
import { completeTask, updateTaskDate } from '@/actions/tasks'

interface TaskTableProps {
  tasks: Task[]
}

export default function TaskTable({ tasks }: TaskTableProps) {

  const handleCompleteTask = async (taskId: string) => {
    await completeTask(taskId)
  }

  const handleUpdateTaskDate = async (taskId: string, newDate: Date) => {
    await updateTaskDate(taskId, newDate.toISOString())
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]"></TableHead>
          <TableHead>Task</TableHead>
          <TableHead className="w-[120px]">Frequency</TableHead>
          <TableHead className="w-[180px]">Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tasks.map((task) => (
          <TableRow key={task.id}>
            <TableCell>
              <Button
                size="sm"
                variant="outline"
                className="w-[80px] items-center"
                onClick={() => handleCompleteTask(task.id)}
              >
                Complete
              </Button>
            </TableCell>
            <TableCell>
              <Link href={`/tasks/${task.id}`} className="hover:underline">
                {task.name}
              </Link>
            </TableCell>
            <TableCell>
              <Badge variant="secondary">{task.frequency}</Badge>
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
                    onSelect={(date) => date && handleUpdateTaskDate(task.id, date)}
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
}

