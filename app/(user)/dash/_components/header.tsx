import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { ArrowLeft } from "lucide-react";
import Link from 'next/link';


export function Header() {
  return (
    <div className="flex justify-between items-center md:flex-row flex-col">
      <div className="flex items-center justify-between w-full">
        <Button className="bg-green-600" size="sm" asChild>
          <Link href="/">
            <ArrowLeft className="mr-1 w-4 h-4" />
            Back
          </Link>
        </Button>
        <div className="w-4"></div>
        <h1 className="text-3xl font-bold">Your Notes</h1>
        <div className="w-4"></div>
        <UserButton />
      </div>
    </div>
  )
}
