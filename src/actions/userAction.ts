"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db/drizzle";
import { usersTable } from "@/db/schema";

export const getUsers = async () => {
  return db.select().from(usersTable);
};

export const addUser = async (
  name: string,
  email: string,
  avatarUrl: string,
) => {
  await db.insert(usersTable).values({
    name,
    email,
    avatar_url: avatarUrl,
  });
  revalidatePath("/");
};

export const deleteUser = async (id: number) => {
  await db.delete(usersTable).where(eq(usersTable.id, id));
  revalidatePath("/");
};

export type UserUpdateFields = {
  name?: string;
  email?: string;
  avatar_url?: string;
};

export const updateUser = async (id: number, fields: UserUpdateFields) => {
  const payload = Object.fromEntries(
    Object.entries(fields).filter(([, v]) => v !== undefined),
  ) as UserUpdateFields;

  if (Object.keys(payload).length === 0) return;

  await db
    .update(usersTable)
    .set({
      ...payload,
      updated_at: new Date(),
    })
    .where(eq(usersTable.id, id));

  revalidatePath("/");
};

export const editUser = async (
  id: number,
  name: string,
  email: string,
  avatarUrl: string,
) => {
  await db
    .update(usersTable)
    .set({
      name,
      email,
      avatar_url: avatarUrl,
      updated_at: new Date(),
    })
    .where(eq(usersTable.id, id));

  revalidatePath("/");
};
