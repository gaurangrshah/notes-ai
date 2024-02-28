"use server";

import { revalidatePath } from "next/cache";
import { createNote, deleteNote, updateNote } from "@/lib/api/notes/mutations";
import {
  NoteId,
  NewNoteParams,
  UpdateNoteParams,
  noteIdSchema,
  insertNoteParams,
  updateNoteParams,
} from "@/lib/db/schema/notes";
import { getUserAuth } from "../auth/utils";

const handleErrors = (e: unknown) => {
  const errMsg = "Error, please try again.";
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === "object" && "error" in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateNotes = () => revalidatePath("/notes");

export const createNoteAction = async (input: NewNoteParams) => {
  try {
    const payload = insertNoteParams.parse(input);
    await createNote(payload);
    revalidateNotes();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateNoteAction = async (input: Partial<UpdateNoteParams>) => {
  try {
    const { session } = await getUserAuth();
    const payload = updateNoteParams.parse({
      ...input,
      userId: session?.user.id!,
    });
    const { note } = await updateNote(payload.id, payload);
    revalidateNotes();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteNoteAction = async (input: NoteId) => {
  try {
    const payload = noteIdSchema.parse({ id: input });
    await deleteNote(payload.id);
    revalidateNotes();
  } catch (e) {
    return handleErrors(e);
  }
};
