//import { useState } from "react"
import { format, parseISO } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
//import { Input } from "@/components/ui/input"

import { getTasks } from "@/actions/tasks"

export default async function HistoryPage() {
  const tasks = await getTasks()
  
  const history = tasks.flatMap((task) => task.history.map((date) => ({ id: task.id, name: task.name, date })))
  const taskHistory = history.sort((a, b) => (a.date > b.date ? -1 : 1))

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-primary">Task History</h1>

      {/* <Input
        type="text"
        placeholder="Search tasks..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-md"
      /> */}

      <Card>
        <CardHeader className="border-b border-primary/20">
          <CardTitle className="text-primary">Completed Tasks</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task Name</TableHead>
                <TableHead>Completion Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {taskHistory.map((task) => (
                <TableRow key={`${task.id}}-${task.date}`}>
                  <TableCell className="font-medium">{task.name}</TableCell>
                  <TableCell className="flex items-center">
                    <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                    {format(parseISO(task.date), "PPP")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

