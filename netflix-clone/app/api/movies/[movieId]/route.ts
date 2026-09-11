import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { UpdateMovie } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";

const getAdminUser = async () => {
    const supabase = await createClient();

    const {
        data: { user:authUser },
        error,
} = await supabase.auth.getUser();

if (error || !authUser) {
    console.error("Error fetching authenticated user:", error);
    return null;
  }
const user = await prisma.user.findUnique({
    where: { email: authUser.email|| undefined },
});

return user?.role === "ADMIN" ? user : null;
};

export async function GET(
    req:NextRequest,
    { params }: { params: { movieId: string } }
) {
    try {
         const { movieId } = await params;

         const movie = await prisma.movie.findUnique({
            where: { id: movieId },
        });

        if (!movie) {
            return NextResponse.json(
                { error: "Movie not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(movie);
    } catch (error) {
        console.error(error);
        return NextResponse.json(
        { error: "Failed to fetch movie" }, 
        { status: 500 }
        );
    }
}     

// update movie details (ADMIN only)
export async function PATCH(
    req: NextRequest,
    { params }: { params: { movieId: string } }
) {
    try {
    const { movieId } = await params;
    const fields: UpdateMovie = await req.json();

    if (Object.keys(fields).length === 0) {
        return NextResponse.json(
            { error: "No fields provided for update" },
            { status: 400 }
        );
    }

    const adminUser = await getAdminUser();
    if (!adminUser) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

    const movie = await prisma.movie.findUnique({
        where: { id: movieId },
    });

    if (!movie) {
        return NextResponse.json(
            { error: "Movie not found" },
            { status: 404 }
        );
    }

   return NextResponse.json(movie);

    } catch (error) {
        console.error("Error updating movie details:", error);
        return NextResponse.json(
            { error: "Failed to update movie details" },
            { status: 500 },
        );
    }
}


// delete movie (ADMIN only)
export async function DELETE(
    req: NextRequest, 
    { params }: { params: { movieId: string }  },
) {
    try {
        const { movieId } = await params;
        const adminUser = await getAdminUser();
        if (!adminUser) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const movie = await prisma.movie.findUnique({
            where: { id: movieId },
        });

        if (!movie) {
            return NextResponse.json(
                { error: "Movie not found" },
                { status: 404 }
            );
        }

        await prisma.movie.delete({
            where: { id: movieId },
        });

        return NextResponse.json({ message: "Movie deleted successfully" });
    } catch (error) {
        console.error("Error deleting movie:", error);
        return NextResponse.json(
            { error: "Failed to delete movie" },
            { status: 500 }
        );
    }
}