"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { format, parseISO } from "date-fns"
import {
  ArrowLeftIcon,
  CalendarIcon,
  CheckCircleIcon,
  TrashIcon,
} from "lucide-react"

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
} from "@/components/ui/alert-dialog"


import { deleteTask } from "@/actions/tasks"
import { Task } from "@prisma/client"

export default function TaskDetails({task}: {task:Task}) {
  const router = useRouter()
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  async function handleDelete() {
    await deleteTask(task.id)
    router.push("/tasks") // Redirect to the main tasks page after deletion
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4 text-primary hover:text-primary/80">
          <ArrowLeftIcon className="mr-2 h-4 w-4" /> Back to Tasks
        </Button>
        <Button
          variant="ghost"
          onClick={() => setIsDeleteModalOpen(true)}
          className="mb-4 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 hover:text-amber-600"
        >
          <TrashIcon className="mr-2 h-4 w-4" /> Delete Task
        </Button>
      </div>

      <Card className="border-primary/20">
        <CardHeader className="border-b border-primary/20 bg-primary/5">
          <CardTitle className="text-2xl text-primary">{task.name}</CardTitle>
          <CardDescription>Task Details</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid gap-4">
            <div className="flex items-center text-primary">
              <CalendarIcon className="mr-2 h-5 w-5" />
              <span>Next due: {format(parseISO(task.date), "PPP")}</span>
            </div>
            <div>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                Frequency: {task.frequency} days
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b border-primary/20">
          <CardTitle className="text-primary">Completion History</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date Completed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {task.history.map((date, index) => (
                <TableRow key={index}>
                  <TableCell className="flex items-center">
                    <CheckCircleIcon className="mr-2 h-4 w-4 text-primary" />
                    {format(parseISO(date), "PPP")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the task and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 hover:text-amber-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

