import dotenv from "dotenv";

dotenv.config({
  path: "../../packages/db/.env",
});

import { WebSocketServer, WebSocket } from "ws";
import jwt from "jsonwebtoken";

import { JWT_SECRET } from "@repo/backend-common/config";
import { prismaClient } from "@repo/db/client";

async function testDatabase() {
  try {
    await prismaClient.$connect();
  } catch (error) {
    console.error("❌ WebSocket server DB connection failed:", error);
  }
}

testDatabase();

const wss = new WebSocketServer({
  port: 8080,
});

interface User {
  ws: WebSocket;
  rooms: Set<string>;
  userId: string;
}

const users: User[] = [];

function checkUser(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (
      typeof decoded === "object" &&
      decoded !== null &&
      "userId" in decoded &&
      typeof decoded.userId === "string"
    ) {
      return decoded.userId;
    }

    return null;
  } catch (error) {
    console.error("❌ JWT verification failed:", error);
    return null;
  }
}

wss.on("listening", () => {
  console.log("✅ WebSocket server running on ws://localhost:8080");
});

wss.on("error", (error) => {
  console.error("❌ WebSocket server error:", error);
});

wss.on("connection", (ws, request) => {
  const url = request.url;

  if (!url) {
    console.error("❌ Request URL missing");
    ws.close();
    return;
  }

  const queryString = url.split("?")[1] ?? "";
  const queryParams = new URLSearchParams(queryString);
  const token = queryParams.get("token");

  if (!token) {
    console.error("❌ Token missing");
    ws.close();
    return;
  }

  const userId = checkUser(token);

  if (!userId) {
    console.error("❌ Invalid token");
    ws.close();
    return;
  }

  const user: User = {
    ws,
    userId,
    rooms: new Set(),
  };

  users.push(user);

  ws.send(
    JSON.stringify({
      type: "connected",
      userId,
    }),
  );

  ws.on("message", async (data) => {
    try {
      let parsedData;

      if (typeof data !== "string") {
        parsedData = JSON.parse(data.toString());
      } else {
        parsedData = JSON.parse(data);
      }

      // JOIN ROOM USING ROOM ID
      if (parsedData.type === "join_room" && parsedData.roomId) {
        const roomId = parsedData.roomId;

        if (!roomId) {
          console.error("❌ Room ID missing");
          return;
        }

        user.rooms.add(roomId);

        const members = users.filter((u) => u.rooms.has(roomId));

        console.log(
          "👥 ROOM MEMBERS:",
          members.map((u) => u.userId),
        );

        return;
      }

      // JOIN ROOM USING ROOM NAME
      if (parsedData.type === "join_room") {
        const roomName = parsedData.roomName;

        if (!roomName) {
          console.error("❌ Room name missing");
          return;
        }

        const room = await prismaClient.room.findFirst({
          where: {
            name: roomName,
          },
        });

        if (!room) {
          console.error("❌ Room not found:", roomName);
          return;
        }

        user.rooms.add(room.id);

        const members = users.filter((u) => u.rooms.has(room.id));

        console.log(
          "👥 Room members:",
          members.map((u) => u.userId),
        );

        ws.send(
          JSON.stringify({
            type: "room_joined",
            roomName: room.name,
            roomId: room.id,
          }),
        );

        return;
      }

      // SHAPE
      if (parsedData.type === "shape") {
        const roomName = parsedData.roomName;
        const shape = parsedData.shape;

        if (!roomName || !shape) {
          console.error("❌ Invalid shape payload");
          return;
        }

        const room = await prismaClient.room.findFirst({
          where: {
            name: roomName,
          },
        });

        if (!room) {
          console.error("❌ Room not found:", roomName);
          return;
        }

        const roomMembers = users.filter((u) => u.rooms.has(room.id));

        roomMembers.forEach((member) => {
          // Sender ko shape dobara nahi bhejna
          if (member.ws !== ws && member.ws.readyState === WebSocket.OPEN) {
            member.ws.send(
              JSON.stringify({
                type: "shape",
                roomName,
                shape,
              }),
            );
          }
        });

        return;
      }

      // CHAT
      if (parsedData.type === "chat") {
        const roomId = parsedData.roomId;
        const message = parsedData.message;

        if (!roomId || !message) {
          console.error("❌ Invalid chat payload");
          return;
        }

        // Check room
        const room = await prismaClient.room.findUnique({
          where: {
            id: roomId,
          },
        });

        if (!room) {
          console.error("❌ Room not found:", roomId);
          return;
        }

        // Save message
        const savedMessage = await prismaClient.message.create({
          data: {
            roomId,
            content: message,
            userId,
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        });

        // Find room members
        const roomMembers = users.filter((u) => u.rooms.has(roomId));

        // Broadcast
        roomMembers.forEach((member) => {
          if (member.ws.readyState === WebSocket.OPEN) {
            member.ws.send(
              JSON.stringify({
                type: "chat",
                roomId,
                message: savedMessage.content,
                userId: savedMessage.user.id,
                user: {
                  id: savedMessage.user.id,
                  name: savedMessage.user.name,
                },
                messageId: savedMessage.id,
                createdAt: savedMessage.createdAt,
              }),
            );
          }
        });

        return;
      }

      // UNKNOWN MESSAGE
      console.log("⚠️ Unknown message type:", parsedData.type);
    } catch (error) {
      console.error("🔥 WebSocket message error:", error);
    }
  });

  // CLOSE
  ws.on("close", (code, reason) => {
    const index = users.indexOf(user);

    if (index !== -1) {
      users.splice(index, 1);
    }

    console.log(`🔌 Client disconnected: ${userId} (${code})`);
  });

  // ERROR
  ws.on("error", (error) => {
    console.error("🔥 Socket error for:", userId, error);
  });
});
