"use server";

import { db } from "@/lib/db";
import { notes as $notes } from "@/lib/db/schema/notes";
import { generateImage, generateImagePrompt } from "@/lib/openai";
import { auth } from "@clerk/nextjs";

export const runtime = "edge";
export const preferredRegion = "cle1"; // cleveland

export async function createNotebook(
  name: string
): Promise<{ note_id: string }> {
  const { userId } = auth();
  if (!userId) {
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

  const note_ids = await db
    .insert($notes)
    .values({
      name,
      userId,
      imageUrl: image_url,
    })
    .returning({
      insertedId: $notes.id,
    });

  return {
    note_id: note_ids[0].insertedId,
  };
}
