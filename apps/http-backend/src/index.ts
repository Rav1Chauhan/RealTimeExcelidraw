import express from "express";
import bcrypt from "bcrypt";
import "dotenv/config";
import jwt from "jsonwebtoken";
import cors from "cors";

import { authMiddleware } from "./middleware.js";

import {
  CreateRoomSchema,
  CreateUserSchema,
  SigninSchema,
} from "@repo/common/types";

import { JWT_SECRET } from "@repo/backend-common/config";
import { prismaClient } from "@repo/db/client";

const app = express();

app.use(express.json());
app.use(cors());

app.post("/signup", async (req, res) => {
  const parsedData = CreateUserSchema.safeParse(req.body);

  if (!parsedData.success) {
    return res.status(400).json({
      message: parsedData.error.issues.map((issue) => issue.message).join(", "),
    });
  }

  const { username, email, password } = parsedData.data;

  try {
    const existingUser = await prismaClient.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prismaClient.user.create({
      data: {
        name: username,
        email,
        password: hashedPassword,
      },
    });

    return res.status(201).json({
      message: "User created successfully",
      userId: user.id,
    });
  } catch (error) {
    console.error("Signup failed:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

app.post("/signin", async (req, res) => {
  const parsedData = SigninSchema.safeParse(req.body);

  if (!parsedData.success) {
    return res.status(400).json({
      message: "Invalid input",
    });
  }

  const { email, password } = parsedData.data;

  try {
    const user = await prismaClient.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Incorrect password",
      });
    }

    const token = jwt.sign(
      {
        userId: user.id,
      },
      JWT_SECRET,
    );

    return res.json({
      token,
    });
  } catch (error) {
    console.error("Signin failed:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

app.post("/createroom", authMiddleware, async (req, res) => {
  const parsedData = CreateRoomSchema.safeParse(req.body);

  if (!parsedData.success) {
    return res.status(400).json({
      message: "Invalid input",
    });
  }

  const name = parsedData.data.name?.trim();

  if (!name) {
    return res.status(400).json({
      message: "Room name is required",
    });
  }

  try {
    const room = await prismaClient.room.create({
      data: {
        name,
        adminId: req.userId,
      },
    });

    return res.status(201).json({
      message: "Room created successfully",
      room,
    });
  } catch (error) {
    console.error("Create room failed:", error);

    return res.status(500).json({
      message: "Failed to create room",
    });
  }
});

app.get("/chats/:roomId", async (req, res) => {
  const roomId = req.params.roomId;

  try {
    const room = await prismaClient.room.findUnique({
      where: {
        id: roomId,
      },
    });

    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    const messages = await prismaClient.message.findMany({
      where: {
        roomId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50,
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return res.json({
      messages,
    });
  } catch (error) {
    console.error("Failed to fetch chats:", error);

    return res.status(500).json({
      message: "Failed to fetch chats",
      messages: [],
    });
  }
});

app.get("/room/:roomname", async (req, res) => {
  const roomname = req.params.roomname;

  try {
    const room = await prismaClient.room.findFirst({
      where: {
        name: roomname,
      },
    });

    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    return res.json({
      room,
    });
  } catch (error) {
    console.error("Failed to fetch room:", error);

    return res.status(500).json({
      message: "Failed to fetch room",
    });
  }
});

app.post("/rooms/:roomName/shapes", authMiddleware, async (req, res) => {
  const roomName = String(req.params.roomName);
  const { shape } = req.body;
  const userId = req.userId;

  if (!roomName) {
    return res.status(400).json({
      message: "Invalid room name",
    });
  }

  if (!userId) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  if (
    !shape ||
    typeof shape.type !== "string" ||
    !shape.data ||
    typeof shape.data !== "object"
  ) {
    return res.status(400).json({
      message: "Invalid shape",
    });
  }

  try {
    const room = await prismaClient.room.findFirst({
      where: {
        name: roomName,
      },
    });

    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    const newShape = await prismaClient.shape.create({
      data: {
        roomId: room.id,
        userId,
        type: shape.type,
        data: shape.data,
      },
    });

    return res.status(201).json({
      shape: newShape,
    });
  } catch (error) {
    console.error("Shape creation failed:", error);

    return res.status(500).json({
      message: "Failed to create shape",
    });
  }
});

app.get("/rooms/:roomName/shapes", async (req, res) => {
  const roomName = String(req.params.roomName);

  if (!roomName) {
    return res.status(400).json({
      message: "Invalid room name",
    });
  }

  try {
    const room = await prismaClient.room.findFirst({
      where: {
        name: roomName,
      },
    });

    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    const shapes = await prismaClient.shape.findMany({
      where: {
        roomId: room.id,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return res.json({
      shapes,
    });
  } catch (error) {
    console.error("Failed to fetch shapes:", error);

    return res.status(500).json({
      message: "Failed to fetch shapes",
    });
  }
});

const PORT = Number(process.env.PORT) || 3003;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`HTTP server running on port ${PORT}`);
});
