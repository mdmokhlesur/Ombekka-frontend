import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";

export default function NoSearch() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">No Search Query</h1>
      <p className="text-gray-500 mb-8">Please enter a search term.</p>
      <Link href="/">
        <Button variant="outline">
          <ArrowLeft className="mr-2 w-4 h-4" /> Back to Search
        </Button>
      </Link>
    </div>
  );
}
