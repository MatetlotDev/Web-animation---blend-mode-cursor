"use client";

import BlurryCursor from "@/components/Cursor";
import { useState } from "react";

export default function Home() {
  const [isOver, setIsOver] = useState(false);

  return (
    <main className="h-[100vh] flex items-center justify-center">
      <h1
        onMouseOver={() => {
          setIsOver(true);
        }}
        onMouseLeave={() => {
          setIsOver(false);
        }}
        className="text-[4.5vw] max-w-[90vw] text-center text-white p-20"
      >
        The quick brown fox jumps over the lazy dog
      </h1>
      <BlurryCursor isOver={isOver} />
    </main>
  );
}
