"use server";

import { db } from "@/lib/db/index";
import { eq, and } from "drizzle-orm";
import { getUserAuth } from "@/lib/auth/utils";
import { type NoteId, noteIdSchema, notes, Note } from "@/lib/db/schema/notes";

export const getNotes = async () => {
  const { session } = await getUserAuth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  const rows = await db
    .select()
    .from(notes)
    .where(eq(notes.userId, session.user.id));
  return { notes: rows };
};

export const getNoteById = async (id: NoteId) => {
  const { session } = await getUserAuth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  const { id: noteId } = noteIdSchema.parse({ id });
  const [row] = await db
    .select()
    .from(notes)
    .where(and(eq(notes.id, noteId), eq(notes.userId, session.user.id)));

  return { note: row ?? null };
};
