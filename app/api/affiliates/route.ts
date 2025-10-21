import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch affiliates that have at least one active casino
    const affiliates = await prisma.affiliate.findMany({
      where: {
        block: 0, // Not blocked
        casinos: {
          some: {
            approved: 1,
            rogue: 0,
          },
        },
      },
      select: {
        id: true,
        aff_name: true,
        aff_url: true,
        referralLink: true,
        casinos: {
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
          },
          orderBy: {
            casino: "asc",
          },
        },
      },
      orderBy: {
        aff_name: "asc",
      },
    });

    return NextResponse.json(affiliates);
  } catch (error) {
    console.error("Error fetching affiliates:", error);
    return NextResponse.json(
      { error: "Failed to fetch affiliates" },
      { status: 500 }
    );
  }
}

