import { prisma } from "@/lib/supabase/prisma";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user?.email) {
      return NextResponse.json(
        { error: error?.message || "User not authenticated" },
        { status: 401 },
      );
    }

    await prisma.user.upsert({
      where: { supabaseUserId: user.id },
      update: { email: user.email },
      create: {
        supabaseUserId: user.id,
        email: user.email,
        profiles: {
          create: {
            name: "Profile 1",
            avatar: "/images/netflix--avatar.png"
          }
        }
      },
    });
    return NextResponse.json(
      { message: "User logged in successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error occurred while logging in the user:", error);
    return NextResponse.json(
      { error: "Failed to log in user" },
      { status: 500 },
    );
  }
}
