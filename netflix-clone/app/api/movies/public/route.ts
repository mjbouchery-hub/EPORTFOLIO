import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    req: NextRequest,
    { params }: { params: { publicId: string } },
) {

    try {
        const { publicId } = await params;

        const movie = await prisma.movie.findUnique({
            where: { publicId },
        });

        if (!movie) {
            return NextResponse.json(
                { error: "Movie not found" },
                { status: 404 },
            );
        }
        
    }catch (error) {
        console.error("Error fetching movie details:", error);
        return NextResponse.json(
            { error: "Failed to fetch movie details" },
            { status: 500 },
        );
    }
}