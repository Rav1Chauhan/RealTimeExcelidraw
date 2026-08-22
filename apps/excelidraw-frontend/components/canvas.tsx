"use client";

import { useEffect, useRef, useState } from "react";
import {
  Circle,
  PencilIcon,
  RectangleHorizontalIcon,
} from "lucide-react";

import { IconButton } from "./IconButton";
import { Game } from "@/app/draw/games";

export type Tool = "circle" | "rect" | "pencil";

export function Canvas({
  roomName,
  Socket,
}: {
  roomName: string;
  Socket: WebSocket;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [game, setGame] = useState<Game>();
  const [selectedTool, setSelectedTool] =
    useState<Tool>("circle");

  useEffect(() => {
    game?.setTool(selectedTool);
  }, [selectedTool, game]);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas || !roomName || !Socket) {
      return;
    }

    const g = new Game(
      canvas,
      roomName,
      Socket
    );

    setGame(g);

    return () => {
      g.destroy();
    };
  }, [roomName, Socket]);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();

    window.addEventListener(
      "resize",
      resizeCanvas
    );

    return () => {
      window.removeEventListener(
        "resize",
        resizeCanvas
      );
    };
  }, []);

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
        }}
      />

      <Topbar
        selectedTool={selectedTool}
        setSelectedTool={setSelectedTool}
      />
    </div>
  );
}

function Topbar({
  selectedTool,
  setSelectedTool,
}: {
  selectedTool: Tool;
  setSelectedTool: React.Dispatch<
    React.SetStateAction<Tool>
  >;
}) {
  return (
    <div
      style={{
        position: "fixed",
        top: 10,
        left: 10,
      }}
    >
      <div className="m-1 flex gap-2">
        <IconButton
          onClick={() => setSelectedTool("pencil")}
          activated={selectedTool === "pencil"}
          icon={<PencilIcon />}
        />

        <IconButton
          onClick={() => setSelectedTool("rect")}
          activated={selectedTool === "rect"}
          icon={<RectangleHorizontalIcon />}
        />

        <IconButton
          onClick={() => setSelectedTool("circle")}
          activated={selectedTool === "circle"}
          icon={<Circle />}
        />
      </div>
    </div>
  );
}