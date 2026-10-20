"use client";

import Header from "@/components/auth/Header";
import Background from "@/components/auth/Background";
import Link from "next/link";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isPending) return;

    setIsPending(true);
    setMessage("");
    setErrorMessage("");

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      );

      if (error) throw error;

      setMessage(
        "If an account exists for that email, you’ll receive a password reset link.",
      );
    } catch (error) {
      console.error("Error requesting password reset:", error);
      setErrorMessage("Unable to send the reset link. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      <Header />
      <Background />

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="p-8 bg-black/65 rounded-lg flex flex-col gap-4 w-full max-w-md">
          <h1 className="text-2xl font-bold text-white">Forgot password?</h1>

          <p className="text-sm text-white/70">
            Enter your account email to request a password reset link.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your account email"
                disabled={isPending}
                required
              />
            </div>

            {message && (
              <p role="status" className="text-sm text-green-400">
                {message}
              </p>
            )}

            {errorMessage && (
              <p role="alert" className="text-sm text-red-400">
                {errorMessage}
              </p>
            )}

            <Button
              type="submit"
              variant="brand-primary"
              className="h-12"
              disabled={isPending || !email.trim()}
            >
              {isPending ? "Sending…" : "Send reset link"}
            </Button>
          </form>

          <Link
            href="/login"
            className="text-sm text-white/60 hover:text-white underline"
          >
            Back to sign in
          </Link>
        </div>
      </main>
    </div>
  );
}
