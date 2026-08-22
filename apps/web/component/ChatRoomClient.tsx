"use client";

import { useEffect, useRef, useState } from "react";
import { useSocket } from "../hook/useSocket";

type Message = {
  id?: string;
  content?: string;
  message?: string;
  createdAt?: string;
  userId?: string;
  user?: {
    id: string;
    name: string;
  };
};

export function ChatRoomClient({
  messages,
  id,
}: {
  messages: Message[];
  id: string;
}) {
  const { socket, loading } = useSocket();

  const [chat, setChat] = useState<Message[]>(messages);
  const [currentMessage, setCurrentMessage] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setChat(messages);
  }, [messages]);

  useEffect(() => {
    if (!socket) {
      return;
    }

    if (socket.readyState !== WebSocket.OPEN) {
      return;
    }

    socket.send(
      JSON.stringify({
        type: "join_room",
        roomId: id,
      }),
    );

    const handleMessage = (event: MessageEvent) => {
      try {
        const parsedData = JSON.parse(event.data);

        if (parsedData.type === "connected") {
          setCurrentUserId(parsedData.userId);
          return;
        }

        if (parsedData.type === "chat") {
          setChat((current) => [
            ...current,
            {
              id: parsedData.messageId,
              content: parsedData.message,
              createdAt: parsedData.createdAt,
              userId: parsedData.userId,
              user: parsedData.user,
            },
          ]);

          return;
        }
      } catch (error) {
        console.error(
          "❌ Failed to parse WebSocket message:",
          error,
        );
      }
    };

    socket.addEventListener("message", handleMessage);

    return () => {
      socket.removeEventListener("message", handleMessage);

      if (socket.readyState === WebSocket.OPEN) {
        socket.send(
          JSON.stringify({
            type: "leave_room",
            roomId: id,
          }),
        );
      }
    };
  }, [socket, id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [chat]);

  function handleKeyDown(
    e: React.KeyboardEvent<HTMLInputElement>,
  ) {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  }

  function formatTime(dateString?: string) {
    if (!dateString) {
      return "";
    }

    const date = new Date(dateString);

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${hours}:${minutes}`;
  }

  function sendMessage() {
    const message = currentMessage.trim();

    if (!message) {
      return;
    }

    if (!socket) {
      return;
    }

    if (socket.readyState !== WebSocket.OPEN) {
      return;
    }

    const payload = {
      type: "chat",
      roomId: id,
      message,
    };

    socket.send(JSON.stringify(payload));

    setCurrentMessage("");
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex h-screen max-w-5xl flex-col">
        <header className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-6 py-4">
          <div>
            <h1 className="text-xl font-semibold">
              Chat Room
            </h1>

            <p className="mt-1 text-xs text-slate-400">
              Room ID: {id}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`h-2.5 w-2.5 rounded-full ${socket && socket.readyState === WebSocket.OPEN
                  ? "bg-green-500"
                  : "bg-red-500"
                }`}
            />

            <span className="text-sm text-slate-400">
              {loading
                ? "Connecting..."
                : socket &&
                  socket.readyState === WebSocket.OPEN
                  ? "Connected"
                  : "Disconnected"}
            </span>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
          <div className="space-y-4">
            {chat.length === 0 ? (
              <div className="flex min-h-[60vh] items-center justify-center">
                <div className="text-center">
                  <div className="mb-3 text-4xl">💬</div>

                  <h2 className="text-lg font-medium text-slate-300">
                    No messages yet
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Start the conversation.
                  </p>
                </div>
              </div>
            ) : (
              chat.map((msg, index) => {
                const text =
                  msg.content ?? msg.message ?? "";

                const isMine =
                  msg.userId === currentUserId;

                return (
                  <div
                    key={msg.id ?? `${msg.userId}-${index}`}
                    className={`flex w-full items-end gap-3 ${isMine
                        ? "justify-end"
                        : "justify-start"
                      }`}
                  >
                    {!isMine && (
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold">
                        {(msg.user?.name ?? "U")
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                    )}

                    <div
                      className={`max-w-[75%] ${isMine
                          ? "items-end"
                          : "items-start"
                        }`}
                    >
                      <div
                        className={`mb-1 flex items-center gap-2 ${isMine
                            ? "justify-end"
                            : "justify-start"
                          }`}
                      >
                        <span className="text-xs font-medium text-slate-400">
                          {isMine
                            ? "You"
                            : (msg.user?.name ?? "User")}
                        </span>

                        {msg.createdAt && (
                          <span className="text-xs text-slate-600">
                            {formatTime(msg.createdAt)}
                          </span>
                        )}
                      </div>

                      <div
                        className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow ${isMine
                            ? "rounded-br-sm bg-blue-600 text-white"
                            : "rounded-bl-sm bg-slate-800 text-slate-200"
                          }`}
                      >
                        {text}
                      </div>
                    </div>

                    {isMine && (
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold">
                        {(msg.user?.name ?? "U")
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                    )}
                  </div>
                );
              })
            )}

            <div ref={messagesEndRef} />
          </div>
        </section>

        <footer className="border-t border-slate-800 bg-slate-900 p-4">
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={currentMessage}
              onChange={(e) =>
                setCurrentMessage(e.target.value)
              }
              onKeyDown={handleKeyDown}
              placeholder={
                socket &&
                  socket.readyState === WebSocket.OPEN
                  ? "Type a message..."
                  : "Connecting to chat..."
              }
              disabled={
                !socket ||
                socket.readyState !== WebSocket.OPEN
              }
              className="flex-1 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50"
            />

            <button
              onClick={sendMessage}
              disabled={
                !currentMessage.trim() ||
                !socket ||
                socket.readyState !== WebSocket.OPEN
              }
              className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-500"
            >
              Send
            </button>
          </div>

          <p className="mt-2 px-1 text-xs text-slate-600">
            Press Enter to send
          </p>
        </footer>
      </div>
    </main>
  );
}