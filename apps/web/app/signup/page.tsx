"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import { BACKEND_URL } from "@/app/config";

export default function SignupPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSignup(
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      await axios.post(`${BACKEND_URL}/signup`, {
        username,
        email,
        password,
      });

      router.push("/signin");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;

        setError(
          typeof message === "string"
            ? message
            : "Signup failed"
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
        onSubmit={handleSignup}
        className="flex w-full max-w-md flex-col gap-4 rounded-lg border p-6"
      >
        <h1 className="text-2xl font-bold">
          Create Account
        </h1>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="rounded border p-3"
          required
        />

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
          onChange={(e) => setPassword(e.target.value)}
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
          {loading ? "Creating..." : "Sign Up"}
        </button>

        <button
          type="button"
          onClick={() => router.push("/signin")}
          className="text-sm underline"
        >
          Already have an account? Sign in
        </button>
      </form>
    </main>
  );
}