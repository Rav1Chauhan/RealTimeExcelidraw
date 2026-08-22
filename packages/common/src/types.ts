import { z } from "zod";

export const CreateUserSchema = z.object({
  username: z
    .string()
    .min(1, { message: "Username must be at least 3 characters long" })
    .max(20, { message: "Username must be at most 20 characters long" }),
  password: z
    .string()
    .min(1, { message: "Password must be at least 6 characters long" })
    .max(50, { message: "Password cannot exceed 50 characters" }),
  email: z.email({ message: "Invalid email format" }),
});

export const SigninSchema = z.object({
  email: z.email({ message: "Invalid email format" }),
  password: z
    .string()
    .min(2, { message: "Password must be at least 6 characters long" }),
});

export const CreateRoomSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Room name must be at least 3 characters long" })
    .max(30, { message: "Room name must be at most 30 characters long" }),
});

// Optional: Export TypeScript types inferred from the schemas for strict type safety in your backend routes
export type CreateUserParams = z.infer<typeof CreateUserSchema>;
export type SigninParams = z.infer<typeof SigninSchema>;
export type CreateRoomParams = z.infer<typeof CreateRoomSchema>;
