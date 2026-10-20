import { createClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const authError = request.nextUrl.searchParams.get("error");

  if (code && !authError) {
    try {
      const supabase = await createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (!error) {
        return NextResponse.redirect(
          new URL("/reset-password", request.url),
        );
      }
    } catch {
      console.error("Unable to complete password recovery.");
    }
  }

  return NextResponse.redirect(
    new URL("/reset-password?error=invalid-link", request.url),
  );
}