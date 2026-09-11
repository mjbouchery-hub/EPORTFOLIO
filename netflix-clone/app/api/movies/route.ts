import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";

export async function GET(request: NextRequest) {
  try {
    const featured = request.nextUrl.searchParams.get("featured");
    const trending = request.nextUrl.searchParams.get("trending");

    const movies = await prisma.movie.findMany({
      where:
        featured === "true"
          ? { isFeatured: true }
          : trending === "true"
            ? { isTrending: true }
            : undefined,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(movies);
  } catch (error) {
    console.log("There was an error fetching movies:");
    return NextResponse.json(
      { error: "Failed to fetch movies" },
      { status: 500 },
    );
  }
}

export const POST = async (req: NextRequest) => {
  try {
    const { title, description } = await req.json();

    if (typeof title !== "string" || typeof description !== "string") {
      return NextResponse.json(
        { error: "Title or description is invalid" },
        { status: 400 },
      );
    }

    if (
      !title ||
      !description ||
      title.trim() === "" ||
      description.trim() === ""
    ) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    const {
      data: { user: authUser },
      error,
    } = await supabase.auth.getUser();

    if (error || !authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: authUser.email || undefined },
    });

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const movie = await prisma.movie.create({
      data: {
        title,
        description,
        publicId: nanoid(),
      },
    });
    return NextResponse.json(movie)
  } catch (error) {
    console.error("There was an error creating a movie:", error);
    return NextResponse.json(
      { error: "Failed to create movie" },
      { status: 500 },
    );
  }
};
