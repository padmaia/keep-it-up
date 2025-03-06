"use client"

import type React from "react"

import { useState } from "react"
import { PlusIcon } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"

import { createTask } from "@/actions/tasks" 

interface AddTaskFormProps {
  children?: React.ReactNode
}

export function AddTaskForm({ children }: AddTaskFormProps) {
  const [name, setName] = useState("")
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [frequency, setFrequency] = useState(1)
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

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
          setFrequency(1)
        } catch (e) {
          console.log('Failed to create task', e)
        }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        {children || (
          <Button variant="outline" className="w-full justify-start text-left font-normal">
            <PlusIcon className="mr-2 h-4 w-4" />
            <span>Add task</span>
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Task name</Label>
            <Input
              id="name"
              placeholder="Enter task name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Due date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={`w-full justify-start text-left font-normal ${!date && "text-muted-foreground"}`}
                >
                  {date ? date.toDateString() : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <Label htmlFor="frequency">Repeat every (days)</Label>
            <Input
              id="frequency"
              type="number"
              min="1"
              value={frequency}
              onChange={(e) => setFrequency(Number.parseInt(e.target.value))}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Add Task
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  )
}

