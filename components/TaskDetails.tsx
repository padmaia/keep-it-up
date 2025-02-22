"use client"
import {  useRouter } from "next/navigation"
import { format, parseISO } from "date-fns"
import { ArrowLeftIcon, CalendarIcon, Trash2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { deleteTask } from "@/actions/tasks"
import { Task } from "@prisma/client"



export default function TaskDetails({task}: {task: Task}) {
  const router = useRouter()
  console.log(task);

  async function handleDelete() {
    await deleteTask(task.id)
    router.push("/") // Redirect to the main tasks page after deletion
  }

  return (
    <div className="w-full p-8 space-y-8">
      <div className="flex justify-between items-center">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeftIcon className="mr-2 h-4 w-4" /> Back to Tasks
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">
              <Trash2Icon className="mr-2 h-4 w-4" /> Delete Task
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                {`This will permanently delete the task "${task.name}" and all of its history.`}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

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
              <Badge variant="secondary">Frequency: {task.frequency} days</Badge>
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

