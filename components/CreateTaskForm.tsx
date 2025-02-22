"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { createTask } from "@/actions/tasks"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export default function CreateTaskForm() {
  const [name, setName] = useState("")
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [frequency, setFrequency] = useState("")
  const router = useRouter()

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!name || !date) {
      return
    }


    const formData = new FormData()
    formData.append("name", name)
    formData.append("date", date.toISOString())
    formData.append("frequency", frequency)

    try {
      await createTask(formData)
      router.refresh()
      setName("")
      setDate(undefined)
      setFrequency("")
    } catch (e) {
      console.log('Failed to create task', e)
    }
  
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Input name="name" placeholder="Task name" value={name} onChange={(e) => setName(e.target.value)} required />
      <div className="flex space-x-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn("w-[240px] justify-start text-left font-normal", !date && "text-muted-foreground")}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
          </PopoverContent>
        </Popover>
        <Input
          type="number"
          name="frequency"
          placeholder="Repeat every X days"
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
          min="1"
          required
        />
      </div>
      <Button type="submit">Create Task</Button>
    </form>
  )
}

