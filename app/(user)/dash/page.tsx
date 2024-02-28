import { CreateNoteDialog } from "@/components/create-note-dialog";
import { Separator } from "@/components/ui/separator";
import { db } from "@/lib/db";
import { notes as $notes } from "@/lib/db/schema/notes";
import { auth } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import Image from "next/image";
import { Header } from "./_components/header";


type Props = {};

export default async function DashboardPage(props: Props) {
  const { userId } = auth();
  const notes = await db
    .select()
    .from($notes)
    .where(eq($notes.userId, userId!));

  return (
    <>
      <div className="grainy min-h-screen">
        <div className="max-w-7xl mx-auto p-10">
          <div className="h-14" />

          <Header />
          <div className="h-8" />
          <Separator />
          <div className="h-8" />
          {/* if no notes, display this */}
          {notes.length === 0 && (
            <div className="text-center">
              <h2 className="text-xl text-gray-500">You have no notes yet.</h2>
            </div>
          )}

          {/* display all the notes */}
          <div className="grid sm:grid-cols-3 md:grid-cols-5 grid-cols-1 gap-3">
            <CreateNoteDialog />
            {notes.map((note) => {
              return (
                <a href={`/notebook/${note.id}`} key={note.id}>
                  <div className="border border-stone-300 rounded-lg overflow-hidden flex flex-col hover:shadow-xl transition hover:-translate-y-1">
                    <Image
                      width={400}
                      height={200}
                      alt={note.name}
                      src={note.imageUrl || ""}
                      priority
                      loading="eager"
                    />
                    <div className="p-4">
                      <h3 className="text-xl font-semibold">
                        {note.name}
                      </h3>
                      <div className="h-1"></div>
                      <p className="text-sm text-gray-500">
                        {new Date(note.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};
