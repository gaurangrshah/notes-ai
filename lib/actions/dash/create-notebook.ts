"use server";

import { createNote } from "@/lib/api/notes/mutations";
import { getUserAuth } from "@/lib/auth/utils";
import { Note } from "@/lib/db/schema/notes";
import { generateImage, generateImagePrompt } from "@/lib/openai";

export async function createNotebookAction(name: string): Promise<Note> {
  const { session } = await getUserAuth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  const image_description = await generateImagePrompt(name);
  if (!image_description) {
    throw new Error("failed to generate image description");
  }
  const image_url = await generateImage(image_description, name);
  if (!image_url) {
    throw new Error("failed to generate image");
  }

  const { note } = await createNote({
    name,
    imageUrl: image_url,
    editorState: "",
  });

  return note;
}
