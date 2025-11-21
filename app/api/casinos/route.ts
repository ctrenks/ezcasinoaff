import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Fetch active casinos ordered alphabetically
    // Only show casinos with approved=1 and rogue=0
    const casinos = await prisma.casino_p_casinos.findMany({
      where: {
        approved: {
          equals: 1,
        },
        rogue: {
          equals: 0,
        },
      },
      select: {
        id: true,
        casino: true,
        clean_name: true,
        url: true,
        vercel_image_url: true,
        homepageimage: true,
        aff_id: true,
        affiliate: {
          select: {
            aff_name: true,
          },
        },
      },
      orderBy: {
        casino: "asc",
      },
    });

    return NextResponse.json(casinos, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Error fetching casinos:", error);
    return NextResponse.json(
      { error: "Failed to fetch casinos" },
      { status: 500 }
    );
  }
}
