"use client";
import Background from "@/components/auth/Background";
import Header from "@/components/auth/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import z from "zod";

const schema = z
  .object({
    email: z.email("Enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FieldErrors = Partial<Record<keyof z.infer<typeof schema>, string>>;

function Page() {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setConfirmationMessage("");

    const result = schema.safeParse({ email, password, confirmPassword });
    if (!result.success) {
      const flat = z.flattenError(result.error);
      setFieldErrors({
        email: flat.fieldErrors.email?.[0],
        password: flat.fieldErrors.password?.[0],
        confirmPassword: flat.fieldErrors.confirmPassword?.[0],
      });
      return;
    }

    setFieldErrors({});
    setLoading(true);

    if (password !== confirmPassword) {
      setFieldErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match",
      }));
      setLoading(false);
      return;
    }

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      if (data.session) {
        try {
          await axios.post("/api/auth/register");
        } catch (provisioningError) {
          console.log(
            "Error registering user in database",
            provisioningError,
          );
          await supabase.auth.signOut({ scope: "local" });
          setError(
            "Your account was created, but setup could not be completed. Please sign in to try again.",
          );
          return;
        }

        router.push("/");
        return;
      }

      if (data.user) {
        setConfirmationMessage(
          "Check your email for a confirmation link before signing in. If you already have an account, sign in instead.",
        );
        return;
      }

      setError("Registration could not be completed. Please try again.");
    } catch (error) {
      console.log("There was an error creating user", error);
      setError("An error occurred during registration");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative h-screen flex flex-col">
      <Background />
      <Header />

      <div className="flex-1 flex items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="p-8 bg-black/65 rounded-lg flex flex-col gap-4 w-full max-w-md"
        >
          <h1 className="mb-4 text-2xl font-bold text-white">Register</h1>

          <div className="flex flex-col gap-1">
            <Label htmlFor="email" className="text-white/80 text-sm">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
            />
            {fieldErrors.email && (
              <p className="text-red-500 text-xs">{fieldErrors.email}</p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="password" className="text-white/80 text-sm">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
            />
            {fieldErrors.password && (
              <p className="text-red-500 text-xs">{fieldErrors.password}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="confirmPassword" className="text-white/80 text-sm">
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
            />
            {fieldErrors.confirmPassword && (
              <p className="text-red-500 text-xs">
                {fieldErrors.confirmPassword}
              </p>
            )}
          </div>

          {error && <p className="text-red-500 text-xs">{error}</p>}
          {confirmationMessage && (
            <p className="text-green-400 text-sm">{confirmationMessage}</p>
          )}

          <Button
            type="submit"
            variant={"brand-primary"}
            className="h-12"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Page;
