"use client";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#faebd7] dark:bg-[#2c2320] text-neutral-900 dark:text-neutral-100 font-sans px-4 py-10">
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="w-32 h-32 flex items-center justify-center text-[6rem] select-none">
          🐞
        </div>
        <h1 className="text-4xl font-bold">404: Not Found</h1>
        <p className="text-lg max-w-md text-neutral-600 dark:text-neutral-300">
          Oops! This page is lost.
        </p>
        <Link
          href="/"
          className="mt-4 inline-block px-6 py-2 rounded-full bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-100 font-semibold shadow transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
