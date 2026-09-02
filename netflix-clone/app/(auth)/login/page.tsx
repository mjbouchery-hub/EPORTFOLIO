"use client";

import { createClient } from "@/lib/supabase/client";
import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import axios from "axios";
import Link from "next/link";
import Header from "@/components/auth/header";
import Background from "@/components/auth/Background";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const schema = z.object({
  email: z.email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

type FieldErrors = Partial<Record<keyof z.infer<typeof schema>, string>>;

function Page() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const result = schema.safeParse({ email, password });

    if (!result.success) {
      const flat = z.flattenError(result.error);

      setFieldErrors({
        email: flat.fieldErrors.email?.[0],
        password: flat.fieldErrors.password?.[0],
      });

      return;
    }

    setFieldErrors({});
    setIsLoading(true);

    try {
      const { error: signInError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      await axios.post("/api/auth/login").catch((err) => {
        setError(
          err.response?.data?.message || "Failed to verify login"
        );
      });

      router.push("/");
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative h-screen flex flex-col">
      <Header />
      <Background />

      <div className="flex-1 flex items-center justify-center">
        
        <form 
          onSubmit={handleSubmit}
          className="p-8 bg-black/65 rounded-lg flex flex-col gap-4 w-full max-w-md"
        >
          <h1 className="mb-4 text-2xl front-bold text-white">Sign In -laptop test</h1>
        
          <div>
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {fieldErrors.email && (
              <p className="text-red-500 text-xs">
                {fieldErrors.email}
              </p>
            )}
          </div>

          <div>
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {fieldErrors.password && (
              <p className="text-red-500 text-xs">
                {fieldErrors.password}
              </p>
            )}

            <Link
              href="/forgot-password"
              className="text-white/50 text-xs hover:text-white self-end mt-2"
            >
              Forgot password?
            </Link>
          </div>

          {error && (
            <p className="text-red-500 text-xs">
              {error}
            </p>
          )}

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Page;