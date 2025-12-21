"use server";

import { createNote } from "@/lib/api/notes/mutations";
import { getUserAuth } from "@/lib/auth/utils";
import { Note } from "@/lib/db/schema/notes";
import { generateImage, generateImagePrompt } from "@/lib/openai";
import { z } from "zod";

const nameSchema = z
  .string()
  .min(1, "Name is required")
  .max(100, "Name must be 100 characters or less")
  .regex(/^[\w\s\-'.]+$/, "Name contains invalid characters");

export async function createNotebookAction(name: string): Promise<Note> {
  const { session } = await getUserAuth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  const validatedName = nameSchema.parse(name);
  const image_description = await generateImagePrompt(validatedName);
  if (!image_description) {
    throw new Error("failed to generate image description");
  }
  const image_url = await generateImage(image_description, validatedName);
  if (!image_url) {
    throw new Error("failed to generate image");
  }

  const { note } = await createNote({
    name: validatedName,
    imageUrl: image_url,
    editorState: "",
  });

  return note;
}
