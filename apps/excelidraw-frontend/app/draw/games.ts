import { Tool } from "@/components/canvas";
import { getExistingShapes } from "./http";
import { api } from "@/lib/api";

type RectData = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type CircleData = {
  centerX: number;
  centerY: number;
  radius: number;
};

type Shape =
  | {
      type: "rect";
      data: RectData;
    }
  | {
      type: "circle";
      data: CircleData;
    };

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private existingShapes: Shape[] = [];
  private roomName: string;

  private clicked = false;
  private startX = 0;
  private startY = 0;

  private selectedTool: Tool = "circle";

  socket: WebSocket;

  constructor(
    canvas: HTMLCanvasElement,
    roomName: string,
    socket: WebSocket
  ) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.roomName = roomName;
    this.socket = socket;

    this.initHandlers();
    this.initMouseHandlers();
    this.init();
  }

  setTool(tool: Tool) {
    this.selectedTool = tool;
  }

  destroy() {
    this.canvas.removeEventListener(
      "mousedown",
      this.handleMouseDown
    );

    this.canvas.removeEventListener(
      "mousemove",
      this.handleMouseMove
    );

    this.canvas.removeEventListener(
      "mouseup",
      this.handleMouseUp
    );

    this.socket.removeEventListener(
      "message",
      this.handleSocketMessage
    );
  }

  private initHandlers() {
    this.socket.addEventListener(
      "message",
      this.handleSocketMessage
    );
  }

  private handleSocketMessage = (event: MessageEvent) => {
    try {
      const message = JSON.parse(event.data);

      if (message.type !== "shape") {
        return;
      }

      const shape: Shape = message.shape;

      this.existingShapes.push(shape);

      this.clearCanvas(
        this.existingShapes,
        this.canvas,
        this.ctx
      );
    } catch {
      // Ignore invalid WebSocket messages
    }
  };

  private initMouseHandlers() {
    this.canvas.addEventListener(
      "mousedown",
      this.handleMouseDown
    );

    this.canvas.addEventListener(
      "mousemove",
      this.handleMouseMove
    );

    this.canvas.addEventListener(
      "mouseup",
      this.handleMouseUp
    );
  }

  private handleMouseDown = (e: MouseEvent) => {
    this.clicked = true;

    const rect = this.canvas.getBoundingClientRect();

    this.startX = e.clientX - rect.left;
    this.startY = e.clientY - rect.top;
  };

  private handleMouseMove = (e: MouseEvent) => {
    if (!this.clicked) return;

    const rect = this.canvas.getBoundingClientRect();

    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    this.clearCanvas(
      this.existingShapes,
      this.canvas,
      this.ctx
    );

    if (this.selectedTool === "rect") {
      const width = currentX - this.startX;
      const height = currentY - this.startY;

      this.ctx.strokeStyle = "white";

      this.ctx.strokeRect(
        this.startX,
        this.startY,
        width,
        height
      );
    }

    if (this.selectedTool === "circle") {
      const radius = Math.sqrt(
        Math.pow(currentX - this.startX, 2) +
          Math.pow(currentY - this.startY, 2)
      );

      this.ctx.strokeStyle = "white";

      this.ctx.beginPath();

      this.ctx.arc(
        this.startX,
        this.startY,
        radius,
        0,
        Math.PI * 2
      );

      this.ctx.stroke();
    }
  };

  private handleMouseUp = async (e: MouseEvent) => {
    if (!this.clicked) return;

    this.clicked = false;

    const rect = this.canvas.getBoundingClientRect();

    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    let shape: Shape;

    if (this.selectedTool === "rect") {
      const width = currentX - this.startX;
      const height = currentY - this.startY;

      // Prevent accidental zero-size rectangles
      if (
        Math.abs(width) < 2 &&
        Math.abs(height) < 2
      ) {
        this.clearCanvas(
          this.existingShapes,
          this.canvas,
          this.ctx
        );

        return;
      }

      shape = {
        type: "rect",
        data: {
          x: this.startX,
          y: this.startY,
          width,
          height,
        },
      };
    } else if (this.selectedTool === "circle") {
      const radius = Math.sqrt(
        Math.pow(currentX - this.startX, 2) +
          Math.pow(currentY - this.startY, 2)
      );

      // Prevent accidental zero-size circles
      if (radius < 2) {
        this.clearCanvas(
          this.existingShapes,
          this.canvas,
          this.ctx
        );

        return;
      }

      shape = {
        type: "circle",
        data: {
          centerX: this.startX,
          centerY: this.startY,
          radius,
        },
      };
    } else {
      return;
    }

    this.existingShapes.push(shape);

    this.clearCanvas(
      this.existingShapes,
      this.canvas,
      this.ctx
    );

    try {
      await api.post(
        `/rooms/${encodeURIComponent(
          this.roomName
        )}/shapes`,
        {
          shape,
        }
      );

      if (this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(
          JSON.stringify({
            type: "shape",
            roomName: this.roomName,
            shape,
          })
        );
      }
    } catch (error) {
      console.error(
        "Failed to save shape:",
        error
      );
    }
  };

  private async init() {
    try {
      const shapes = await getExistingShapes(
        this.roomName
      );

      this.existingShapes = shapes;

      this.clearCanvas(
        this.existingShapes,
        this.canvas,
        this.ctx
      );
    } catch (error) {
      console.error(
        "Failed to load existing shapes:",
        error
      );
    }
  }

  private clearCanvas(
    shapes: Shape[],
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D
  ) {
    ctx.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    shapes.forEach((shape) => {
      ctx.strokeStyle = "white";

      if (shape.type === "rect") {
        ctx.strokeRect(
          shape.data.x,
          shape.data.y,
          shape.data.width,
          shape.data.height
        );
      }

      if (shape.type === "circle") {
        ctx.beginPath();

        ctx.arc(
          shape.data.centerX,
          shape.data.centerY,
          shape.data.radius,
          0,
          Math.PI * 2
        );

        ctx.stroke();
      }
    });
  }
}