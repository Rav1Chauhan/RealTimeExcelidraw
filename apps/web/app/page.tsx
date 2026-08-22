"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [roomName, setRoomName] = useState("");
  const router = useRouter();

  return (
    <main className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/70 p-8 shadow-2xl backdrop-blur">
        <div className="mb-6 flex justify-end gap-2">
          <button
            onClick={() => router.push("/signin")}
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800"
          >
            Sign In
          </button>

          <button
            onClick={() => router.push("/signup")}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            Sign Up
          </button>
        </div>

        <h1 className="text-center text-3xl font-bold text-white">
          Join a Room
        </h1>

        <p className="mt-2 text-center text-sm text-slate-400">
          Enter a room name to start collaborating.
        </p>

        <div className="mt-8 space-y-4">
          <input
            type="text"
            placeholder="Enter room name..."
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && roomName.trim()) {
                router.push(
                  `/room/${roomName.trim()}`
                );
              }
            }}
            className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
          />

          <button
            disabled={!roomName.trim()}
            onClick={() =>
              router.push(
                `/room/${roomName.trim()}`
              )
            }
            className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
          >
            Join Room
          </button>

          <button
            onClick={() => router.push("/rooms")}
            className="w-full rounded-xl border border-slate-700 px-4 py-3 font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >
            Create a Room
          </button>
        </div>
      </div>
    </main>
  );
}