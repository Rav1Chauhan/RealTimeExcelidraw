"use client";

import { useEffect, useState } from "react";
import { Canvas } from "./canvas";
import { WS_URL } from "@/config";

export default function RoomCanvas({
  roomName,
}: {
  roomName: string;
}) {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    let cancelled = false;

    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    const ws = new WebSocket(
      `${WS_URL}?token=${encodeURIComponent(token)}`
    );

    ws.onopen = () => {
      // React cleanup already happened
      if (cancelled) {
        ws.close();
        return;
      }

      ws.send(
        JSON.stringify({
          type: "join_room",
          roomName,
        })
      );
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);

        if (message.type === "room_joined") {
          if (!cancelled) {
            setSocket(ws);
          }
        }
      } catch {
        // Ignore invalid WebSocket messages
      }
    };

    ws.onerror = () => {
      if (!cancelled) {
        console.error("WebSocket connection failed");
      }
    };

    ws.onclose = () => {
      if (!cancelled) {
        setSocket((current) => {
          if (current === ws) {
            return null;
          }

          return current;
        });
      }
    };

    return () => {
      cancelled = true;

      // Only close an already established connection.
      // Don't close CONNECTING socket here.
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [roomName]);

  if (!socket) {
    return (
      <div className="flex h-screen items-center justify-center">
        Connecting to server....
      </div>
    );
  }

  return (
    <div>
      <Canvas
        roomName={roomName}
        Socket={socket}
      />
    </div>
  );
}