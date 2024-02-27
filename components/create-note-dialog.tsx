"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Loader2, Plus } from "lucide-react";
import { Input } from "./ui/input";
// import axios from "axios";
import { Button } from "./ui/button";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Props = {};

export function CreateNoteDialog(props: Props) {
  const router = useRouter();
  const [input, setInput] = React.useState("");
  const uploadToFreeimage = useMutation({
    mutationFn: async (noteId: string) => {
      const response = await fetch("/api/upload-to-freeimage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ noteId }),
      });
      return response.json() as Promise<{ url: string }>;
    },
  });
  const createNotebook = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/create-notebook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: input,
        }),
      });
      return await response.json() as Promise<{ note_id: string }>;
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input === "") {
      toast("Please enter a name for your notebook");
      return;
    }
    createNotebook.mutate(undefined, {
      onSuccess: ({ note_id }) => {
        console.log("created new note:", { note_id });
        // hit another endpoint to upload the temp dalle-3 url to permanent url
        uploadToFreeimage.mutate(note_id, {
          onSuccess: ({ url }) => {
            toast("Successfully created new notebook w/ thumbnail");
            console.log("uploaded to freeimage:", { url });
          },
          onError: (error) => {
            console.error(error);
            toast("Failed to upload to freeimage");
          },

        });
        router.push(`/notebook/${note_id}`);
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
            <Button type="reset" variant={"secondary"}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-green-600"
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
