"use client";
import React from "react";
import { Button } from "./ui/button";
import { Trash } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

type Props = {
  noteId: string;
};

export function DeleteButton({ noteId }: Props) {
  const router = useRouter();
  const deleteNote = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/delete-note", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          noteId,
        }),
      });
      const data = await response.json();
      return data;
    },
  });
  return (
    <Button
      variant={"destructive"}
      size="sm"
      disabled={deleteNote.isPending}
      onClick={() => {
        const confirm = window.confirm(
          "Are you sure you want to delete this note?"
        );
        if (!confirm) return;
        deleteNote.mutate(undefined, {
          onSuccess: () => {
            router.push("/dash");
          },
          onError: (err) => {
            console.error(err);
          },
        });
      }}
    >
      <Trash />
    </Button>
  );
};
