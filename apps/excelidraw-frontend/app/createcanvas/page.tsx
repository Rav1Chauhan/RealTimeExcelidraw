"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { api } from "@/lib/api";

export default function RoomsPage() {
  const router = useRouter();

  const [roomName, setRoomName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function createRoom() {
    const name = roomName.trim();

    if (!name) {
      setError("Room name is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await api.post("/createroom", {
        name,
      });

      if (!response.data?.room) {
        setError("Room was not returned by server");
        return;
      }

      const createdRoomName = response.data.room.name;

      router.push(
        `/canvas/${encodeURIComponent(createdRoomName)}`
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          router.push("/signin");
          return;
        }

        const message = error.response?.data?.message;

        setError(
          typeof message === "string"
            ? message
            : "Failed to create room"
        );
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  }

  function joinRoom() {
    const name = roomName.trim();

    if (!name) {
      setError("Room name is required");
      return;
    }

    setError("");

    router.push(
      `/canvas/${encodeURIComponent(name)}`
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
        <h1 className="mb-6 text-2xl font-bold text-white">
          Canvas Room
        </h1>

        <input
          type="text"
          placeholder="Enter room name..."
          value={roomName}
          onChange={(e) => {
            setRoomName(e.target.value);
            setError("");
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              createRoom();
            }
          }}
          className="mb-4 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
        />

        {error && (
          <p className="mb-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </p>
        )}

        <button
          onClick={createRoom}
          disabled={loading || !roomName.trim()}
          className="w-full rounded-xl bg-black p-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Room"}
        </button>

        <button
          onClick={joinRoom}
          disabled={!roomName.trim()}
          className="mt-3 w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
        >
          Join Room
        </button>

        <button
          onClick={() => router.push("/")}
          className="mt-3 w-full rounded-xl border border-slate-700 p-3 text-white transition hover:bg-slate-800"
        >
          Back
        </button>
      </div>
    </main>
  );
}