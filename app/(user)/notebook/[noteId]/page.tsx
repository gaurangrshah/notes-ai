
import { DeleteButton } from "@/components/delete-button";
import TipTapEditor from "@/components/tip-tap-editor";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { notes as $notes } from "@/lib/db/schema/notes";
import { auth } from "@clerk/nextjs";
import { clerkClient } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import Link from "next/link";
import { redirect } from "next/navigation";


type Props = {
  params: { noteId: string; };
};

export default async function NotebookPage({ params: { noteId } }: Props) {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/dash");
  }
  const user = await clerkClient.users.getUser(userId);
  const notes = await db
    .select()
    .from($notes)
    .where(and(eq($notes.id, noteId), eq($notes.userId, userId)));

  if (notes.length != 1) {
    return redirect("/dash");
  }
  const note = notes[0];

  return (
    <div className="min-h-screen grainy p-8">
      <div className="max-w-4xl mx-auto">
        <div className="border shadow-xl border-stone-200 rounded-lg p-4 flex items-center">
          <Link href="/dash">
            <Button className="bg-green-600" size="sm">
              Back
            </Button>
          </Link>
          <div className="w-3"></div>
          <span className="font-semibold">
            {user.firstName} {user.lastName}
          </span>
          <span className="inline-block mx-1">/</span>
          <span className="text-stone-500 font-semibold">{note.name}</span>
          <div className="ml-auto">
            <DeleteButton noteId={note.id} />
          </div>
        </div>

        <div className="h-4"></div>
        <div className="border-stone-200 shadow-xl border rounded-lg px-16 py-8 w-full">
          <TipTapEditor note={note} />
        </div>
      </div>
    </div>
  );
};
