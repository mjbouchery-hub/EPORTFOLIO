"use client";

import Header from "@/components/auth/Header";
import Background from "@/components/auth/Background";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [sessionStatus, setSessionStatus] = useState<
    "checking" | "ready" | "invalid" | "error"
  >("checking");
  const [isPending, setIsPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const checkSession = async () => {
      try {
        const params = new URLSearchParams(window.location.search);

        if (params.has("error")) {
          if (!cancelled) setSessionStatus("invalid");
          return;
        }

        const supabase = createClient();
        const { data, error } = await supabase.auth.getUser();

        if (!cancelled) {
          setSessionStatus(error || !data.user ? "invalid" : "ready");
        }
      } catch {
        if (!cancelled) setSessionStatus("error");
      }
    };

    void checkSession();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isPending || isComplete || sessionStatus !== "ready") return;

    setErrorMessage("");

    if (password.length < 6) {
      setErrorMessage("Use at least 6 characters for your password.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Your passwords do not match.");
      return;
    }

    setIsPending(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      setPassword("");
      setConfirmPassword("");
      setIsComplete(true);
    } catch {
      setErrorMessage("Unable to update your password. Please try again.");
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
          <h1 className="text-2xl font-bold text-white">Reset your password</h1>

          <p className="text-sm text-white/70">
            Choose a new password for your account.
          </p>

          {sessionStatus === "checking" && (
            <p role="status" className="text-sm text-white/70">
              Checking your session…
            </p>
          )}

          {sessionStatus === "invalid" && (
            <p role="alert" className="text-sm text-red-400">
              Your reset link is invalid or expired. Please request another
              link.
            </p>
          )}

          {sessionStatus === "error" && (
            <p role="alert" className="text-sm text-red-400">
              Unable to check your session. Please refresh and try again.
            </p>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">New password</Label>
            <Input
              id="password"
              type="password"
              minLength={6}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your new password"
              disabled={sessionStatus !== "ready" || isPending || isComplete}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="confirm-password">Confirm new password</Label>
            <Input
              id="confirm-password"
              type="password"
              minLength={6}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Enter your new password again"
              disabled={sessionStatus !== "ready" || isPending || isComplete}
              required
            />
          </div>

            {errorMessage && (
              <p role="alert" className="text-sm text-red-400">
                {errorMessage}
              </p>
            )}

            {isComplete && (
              <p role="status" className="text-sm text-green-400">
                Your password has been updated.
              </p>
            )}

            <Button
              type="submit"
              variant="brand-primary"
              className="h-12"
              disabled={sessionStatus !== "ready" || isPending || isComplete}
            >
              {isPending ? "Updating…" : "Update password"}
            </Button>
          </form>

          <Link
            href="/forgot-password"
            className="text-sm text-white/60 hover:text-white underline"
          >
            Request another reset link
          </Link>
          {isComplete && (
            <Link
              href="/"
              className="text-sm text-white/60 hover:text-white underline"
            >
              Continue to MJBFLIX
            </Link>
          )}
        </div>
      </main>
    </div>
  );
}
