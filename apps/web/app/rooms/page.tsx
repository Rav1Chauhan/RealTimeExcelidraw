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
    if (!roomName.trim()) {
      setError("Room name is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await api.post("/createroom", {
        name: roomName.trim(),
      });

      if (!response.data.room) {
        setError("Room was not returned by server");
        return;
      }

      const createdRoomName = response.data.room.name;

      router.push(
        `/room/${encodeURIComponent(createdRoomName)}`
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

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md rounded-lg border p-6">
        <h1 className="mb-6 text-2xl font-bold">
          Create Room
        </h1>

        <input
          type="text"
          placeholder="Room name"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              createRoom();
            }
          }}
          className="mb-4 w-full rounded border p-3"
        />

        {error && (
          <p className="mb-4 text-red-500">
            {error}
          </p>
        )}

        <button
          onClick={createRoom}
          disabled={loading}
          className="w-full rounded bg-black p-3 text-white disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Room"}
        </button>

        <button
          onClick={() => router.push("/")}
          className="mt-3 w-full rounded border p-3"
        >
          Back
        </button>
      </div>
    </main>
  );
}