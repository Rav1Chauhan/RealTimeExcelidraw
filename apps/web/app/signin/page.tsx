"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import { BACKEND_URL } from "@/lib/api";

export default function SigninPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSignin(
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        `${BACKEND_URL}/signin`,
        {
          email,
          password,
        }
      );

      const token = response.data.token;

      localStorage.setItem("token", token);

      router.push("/rooms");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message ||
          "Signin failed"
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
      <form
        onSubmit={handleSignin}
        className="flex w-full max-w-md flex-col gap-4 rounded-lg border p-6"
      >
        <h1 className="text-2xl font-bold">
          Sign In
        </h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded border p-3"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          className="rounded border p-3"
          required
        />

        {error && (
          <p className="text-sm text-red-500">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="rounded bg-black p-3 text-white disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <button
          type="button"
          onClick={() => router.push("/signup")}
          className="text-sm underline"
        >
          Don't have an account? Sign up
        </button>
      </form>
    </main>
  );
}