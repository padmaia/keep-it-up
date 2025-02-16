"use client"
import { useParams, useRouter } from "next/navigation"
import { format, parseISO } from "date-fns"
import { ArrowLeftIcon, CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// This should be replaced with your actual data fetching logic
const fetchTask = (id: string) => {
  // Simulating task data
  return {
    id,
    name: "Sample Task",
    date: new Date().toISOString(),
    frequency: "weekly" as const,
    completed: false,
    history: [
      new Date(2023, 0, 1).toISOString(),
      new Date(2023, 0, 8).toISOString(),
      new Date(2023, 0, 15).toISOString(),
    ],
  }
}

export default function TaskDetailPage() {
  const params = useParams()
  const router = useRouter()
  const taskId = params.id as string
  const task = fetchTask(taskId)

  return (
    <div className="w-full p-8 space-y-8">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ArrowLeftIcon className="mr-2 h-4 w-4" /> Back to Tasks
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{task.name}</CardTitle>
          <CardDescription>Task Details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="flex items-center">
              <CalendarIcon className="mr-2 h-4 w-4" />
              <span>Next due: {format(parseISO(task.date), "PPP")}</span>
            </div>
            <div>
              <Badge variant="secondary" className="capitalize">
                {task.frequency}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Completion History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date Completed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {task.history.map((date, index) => (
                <TableRow key={index}>
                  <TableCell>{format(parseISO(date), "PPP")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

