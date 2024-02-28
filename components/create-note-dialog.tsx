"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "./ui/dialog";
import { Loader2, Plus } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { uploadFileFromUrlToPublicRepo } from "@/lib/git";
import { slugify } from "@/lib/utils";
import { getNoteById } from "@/lib/api/notes/queries";
import { DbNote, Note } from "@/lib/db/schema/notes";
import { updateNote } from "@/lib/api/notes/mutations";
import { updateNoteAction } from "@/lib/actions/notes";
import { createNotebookAction } from "@/lib/actions/dash/create-notebook";

type Props = {};

export function CreateNoteDialog(props: Props) {
  const router = useRouter();
  const [input, setInput] = React.useState("");

  const uploadToGithub = useMutation({
    mutationFn: async ({ image_url, name }: { image_url: string; name: string; }) => {
      const timestamp = new Date().toISOString().replace(/:/g, "-");
      const result = await uploadFileFromUrlToPublicRepo({
        repoOwner: "gaurangrshah",
        imageUrl: image_url,
        fileName: slugify(name) + "-" + timestamp + ".jpg",
      });
      return await result;
    }
  })

  const createNotebook = useMutation({
    mutationFn: async () => {
      const notebook = await createNotebookAction(input);
      return notebook as Note
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input === "") {
      toast("Please enter a name for your notebook");
      return;
    }
    createNotebook.mutate(undefined, {
      onSuccess: async (note) => {
        // hit another endpoint to upload the temp dalle-3 url to permanent url
        toast("Notebook created successfully");
        if (note.imageUrl) {
          uploadToGithub.mutate({
            image_url: note.imageUrl!,
            name: note.name,
          }, {
            onSuccess: async (cdnLink) => {
              if (!cdnLink) {
                toast("Failed to backup image to github");
                return;
              }
              console.log('updating note')
              const { note: n } = await updateNote(note.id, {
                name: note.name,
                imageUrl: cdnLink
              })

              if (n) {
                toast("Image backed up to github");
                router.push(`/notebook/${note.id}`);
              }
            },
            onError: (error) => {
              console.error(error);
              toast("Failed to create new notebook");
            },
          })

          toast("Notebook creation completed");
          router.push(`/notebook/${note.id}`);
        }
      },
      onError: (error) => {
        console.error(error);
        toast("Failed to create new notebook");
      },
    });
  };

  return (
    <Dialog>
      <DialogTrigger>
        <div className="border-dashed border-2 flex border-green-600 h-full rounded-lg items-center justify-center sm:flex-col hover:shadow-xl transition hover:-translate-y-1 flex-row p-4">
          <Plus className="w-6 h-6 text-green-600" strokeWidth={3} />
          <h2 className="font-semibold text-green-600 sm:mt-2">
            New Note Book
          </h2>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Note Book</DialogTitle>
          <DialogDescription>
            You can create a new note by clicking the button below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Name..."
          />
          <div className="flex items-center gap-2 mt-4">
            <DialogClose />
            <Button
              type="submit"
              className="bg-green-600 ml-auto"
              disabled={createNotebook.isPending}
            >
              {createNotebook.isPending && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
