import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch active casinos ordered alphabetically
    const casinos = await prisma.casino_p_casinos.findMany({
      where: {
        approved: 1,
        rogue: 0,
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

    return NextResponse.json(casinos);
  } catch (error) {
    console.error("Error fetching casinos:", error);
    return NextResponse.json(
      { error: "Failed to fetch casinos" },
      { status: 500 }
    );
  }
}

