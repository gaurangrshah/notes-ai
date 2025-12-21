"use server";

import { db } from "@/lib/db/index";
import { and, eq } from "drizzle-orm";
import {
  NoteId,
  NewNoteParams,
  UpdateNoteParams,
  updateNoteSchema,
  insertNoteSchema,
  notes,
  noteIdSchema,
} from "@/lib/db/schema/notes";
import { getUserAuth } from "@/lib/auth/utils";

export const createNote = async (note: NewNoteParams) => {
  const { session } = await getUserAuth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  const newNote = insertNoteSchema.parse({
    ...note,
    userId: session.user.id,
  });
  try {
    const [n] = await db.insert(notes).values(newNote).returning();
    return { note: n };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateNote = async (
  id: NoteId,
  note: Partial<UpdateNoteParams>
) => {
  const { session } = await getUserAuth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  const { id: noteId } = noteIdSchema.parse({ id });
  const newNote = updateNoteSchema.parse({
    ...note,
    userId: session.user.id,
  });
  try {
    const [n] = await db
      .update(notes)
      .set({ ...newNote, updatedAt: new Date() })
      .where(and(eq(notes.id, noteId!), eq(notes.userId, session.user.id)))
      .returning();
    return { note: n };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteNote = async (id: NoteId) => {
  const { session } = await getUserAuth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  const { id: noteId } = noteIdSchema.parse({ id });
  try {
    const [n] = await db
      .delete(notes)
      .where(and(eq(notes.id, noteId!), eq(notes.userId, session.user.id)))
      .returning();
    return { note: n };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};
