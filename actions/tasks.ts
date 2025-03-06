"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { PrismaClient, Prisma } from "@prisma/client";
import { createClient } from "@/utils/supabase/server";
import { addDays } from "date-fns";

const prisma = new PrismaClient();

async function ensureAuthenticated() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }
}

export async function getTasks() {
  return prisma.task.findMany({
    orderBy: { date: "asc" },
  });
}

export async function getTask(id: string) {
  return prisma.task.findUnique({
    where: { id },
  });
}

export async function createTask(formData: FormData) {
  await ensureAuthenticated();

  const name = formData.get("name") as string;
  const date = formData.get("date") as string;
  const frequency = Number.parseInt(formData.get("frequency") as string, 10);

  if (!name || !date || isNaN(frequency)) {
    return { success: false, error: "Missing required fields" };
  }

  try {
    const newTask = await prisma.task.create({
      data: {
        name,
        date,
        frequency,
        history: [],
      },
    });

    return { success: true, task: newTask };
  } catch (error) {
    console.error("Error creating task:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return {
          success: false,
          error: "A task with this name already exists.",
        };
      }
    }
    return { success: false, error: "Failed to create task." };
  }
}

export async function completeTask(id: string) {
  await ensureAuthenticated();

  const task = await prisma.task.findUnique({ where: { id } });
  if (!task) throw new Error("Task not found");

  const completionDate = new Date();
  const history = [...(task.history as string[]), completionDate.toISOString()];

  await prisma.task.update({
    where: { id },
    data: {
      history: history as Prisma.JsonArray,
      date: addDays(completionDate, task.frequency).toISOString(),
    },
  });

  revalidatePath("/");
}

export async function updateTaskDate(id: string, newDate: string) {
  await ensureAuthenticated();

  await prisma.task.update({
    where: { id },
    data: { date: newDate },
  });
  revalidatePath("/");
}

export async function deleteTask(id: string) {
  await ensureAuthenticated();

  await prisma.task.delete({ where: { id } });
  revalidatePath("/");
}
