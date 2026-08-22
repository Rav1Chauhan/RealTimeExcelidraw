import { useEffect, useState } from "react";

import { WS_URL } from "../app/config";

export function useSocket() {
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    let isActive = true;

    const token = localStorage.getItem("token");

    if (!token) {
      if (isActive) {
        setLoading(false);
      }

      return;
    }

    const ws = new WebSocket(
      `${WS_URL}?token=${encodeURIComponent(token)}`
    );

    ws.onopen = () => {
      if (!isActive) {
        ws.close();
        return;
      }

      setSocket(ws);
      setLoading(false);
    };

    ws.onmessage = (event) => {
      if (!isActive) {
        return;
      }

      console.log("📩 Message from server:", event.data);
    };

    ws.onerror = () => {
      if (!isActive) {
        return;
      }

      console.error("❌ WebSocket connection error");
    };

    ws.onclose = () => {
      if (!isActive) {
        return;
      }

      setSocket(null);
      setLoading(false);
    };

    return () => {
      isActive = false;

      if (
        ws.readyState === WebSocket.OPEN ||
        ws.readyState === WebSocket.CONNECTING
      ) {
        ws.close();
      }
    };
  }, []);

  return {
    socket,
    loading,
  };
}