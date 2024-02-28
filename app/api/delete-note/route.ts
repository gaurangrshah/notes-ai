import { db } from "@/lib/db";
import { notes as $notes } from "@/lib/db/schema/notes";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { noteId } = await req.json();
  await db.delete($notes).where(eq($notes.id, noteId));
  return NextResponse.json({ message: "ok", status: 200 });
}
