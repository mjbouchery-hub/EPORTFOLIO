import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { deleteCloudinaryAsset } from "@/lib/cloudinary";

const nullableHttpUrl = z
  .url({ protocol: /^https?$/ })
  .max(2048)
  .nullable()
  .optional();

const movieUpdateSchema = z
  .strictObject({
    title: z
      .string()
      .refine((value) => value.trim().length > 0, "Title cannot be empty")
      .optional(),
    description: z
      .string()
      .refine((value) => value.trim().length > 0, "Description cannot be empty")
      .optional(),
    thumbnailUrl: nullableHttpUrl,
    thumbnailCloudinaryId: z.string().trim().min(1).nullable().optional(),
    trailerUrl: nullableHttpUrl,
    videoUrl: nullableHttpUrl,
    cloudinaryId: z.string().trim().min(1).nullable().optional(),
    duration: z
      .number()
      .nonnegative()
      .transform((value) => Math.round(value))
      .nullable()
      .optional(),
    releaseYear: z
      .number()
      .int()
      .min(1900)
      .max(new Date().getFullYear() + 5)
      .nullable()
      .optional(),
    maturityRating: z
      .enum([
        "NR",
        "G",
        "PG",
        "PG-13",
        "R",
        "NC-17",
        "TV-Y",
        "TV-Y7",
        "TV-G",
        "TV-PG",
        "TV-14",
        "TV-MA",
      ])
      .nullable()
      .optional(),
    isFeatured: z.boolean().optional(),
    isTrending: z.boolean().optional(),
  })
  .refine((fields) => Object.keys(fields).length > 0, {
    message: "No fields provided for update",
  })
  .refine(
    (fields) => "thumbnailUrl" in fields === "thumbnailCloudinaryId" in fields,
    {
      message:
        "thumbnailUrl and thumbnailCloudinaryId must be updated together",
      path: ["thumbnailCloudinaryId"],
    },
  )
  .refine((fields) => "videoUrl" in fields === "cloudinaryId" in fields, {
    message: "videoUrl and cloudinaryId must be updated together",
    path: ["cloudinaryId"],
  });

const getAdminUser = async () => {
  const supabase = await createClient();

  const {
    data: { user: authUser },
    error,
  } = await supabase.auth.getUser();

  if (error || !authUser) {
    console.error("Error fetching authenticated user:", error);
    return null;
  }
  const user = await prisma.user.findUnique({
    where: { email: authUser.email || undefined },
  });

  return user?.role === "ADMIN" ? user : null;
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ movieId: string }> },
) {
  try {
    const { movieId } = await params;

    const movie = await prisma.movie.findUnique({
      where: { id: movieId },
    });

    if (!movie) {
      return NextResponse.json({ error: "Movie not found" }, { status: 404 });
    }

    return NextResponse.json(movie);
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return NextResponse.json(
      { error: "Failed to fetch movie details" },
      { status: 500 },
    );
  }
}

// Update movie details (Admin only)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ movieId: string }> },
) {
  try {
    const { movieId } = await params;

    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let requestBody: unknown;
    try {
      requestBody = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const validation = movieUpdateSchema.safeParse(requestBody);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Invalid update data",
          issues: validation.error.issues,
        },
        { status: 400 },
      );
    }

    const movie = await prisma.movie.findUnique({
      where: { id: movieId },
    });

    if (!movie) {
      return NextResponse.json({ error: "Movie not found" }, { status: 404 });
    }

    const updatedMovie = await prisma.movie.update({
      where: { id: movieId },
      data: validation.data,
    });

    if (
      validation.data.thumbnailCloudinaryId !== undefined &&
      movie.thumbnailCloudinaryId &&
      validation.data.thumbnailCloudinaryId !== movie.thumbnailCloudinaryId
    ) {
      try {
        await deleteCloudinaryAsset(
          movie.thumbnailCloudinaryId,
          "image",
          "upload",
        );
      } catch (error) {
        console.error("Failed to delete old thumbnail from Cloudinary:", error);
      }
    }
    if (
      validation.data.cloudinaryId !== undefined &&
      movie.cloudinaryId &&
      validation.data.cloudinaryId !== movie.cloudinaryId
    ) {
      try {
        await deleteCloudinaryAsset(
          movie.cloudinaryId,
          "video",
          "authenticated",
        );
      } catch (error) {
        console.error("Failed to delete old video from Cloudinary:", error);
      }
    }
    return NextResponse.json(updatedMovie);
  } catch (error) {
    console.error("Error updating movie details:", error);
    return NextResponse.json(
      { error: "Failed to update movie details" },
      { status: 500 },
    );
  }
}

// delete movie
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ movieId: string }> },
) {
  try {
    const { movieId } = await params;
    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const movie = await prisma.movie.findUnique({
      where: { id: movieId },
    });

    if (!movie) {
      return NextResponse.json({ error: "Movie not found" }, { status: 404 });
    }

    await prisma.$transaction(async (tx) => {
      await tx.myList.deleteMany({ where: { movieId } });
      await tx.movie.delete({ where: { id: movieId } });
    });

    return NextResponse.json({ message: "Movie deleted successfully" });
  } catch (error) {
    console.error("Error deleting movie:", error);
    return NextResponse.json(
      { error: "Failed to delete movie" },
      { status: 500 },
    );
  }
}
