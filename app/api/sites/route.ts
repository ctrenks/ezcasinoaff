import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { generateSiteApiKey } from "@/lib/api-key";

// GET /api/sites - List all sites for the authenticated user
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sites = await prisma.site.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        subscription: {
          select: {
            id: true,
            plan: true,
            status: true,
            startDate: true,
            endDate: true,
            amount: true,
            monthlyRate: true,
          },
        },
        _count: {
          select: {
            apiUsage: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(sites);
  } catch (error) {
    console.error("Error fetching sites:", error);
    return NextResponse.json(
      { error: "Failed to fetch sites" },
      { status: 500 }
    );
  }
}

// POST /api/sites - Create a new site
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { domain, name, description } = body;

    // Validate required fields
    if (!domain) {
      return NextResponse.json(
        { error: "Domain is required" },
        { status: 400 }
      );
    }

    // Validate domain format (basic check)
    const domainRegex =
      /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/i;
    if (!domainRegex.test(domain)) {
      return NextResponse.json(
        { error: "Invalid domain format" },
        { status: 400 }
      );
    }

    // Check if domain already exists for this user
    const existingSite = await prisma.site.findFirst({
      where: {
        userId: session.user.id,
        domain: domain.toLowerCase(),
      },
    });

    if (existingSite) {
      return NextResponse.json(
        { error: "This domain already exists in your sites" },
        { status: 409 }
      );
    }

    // Generate unique API key
    const apiKey = generateSiteApiKey();

    // Create the site
    const site = await prisma.site.create({
      data: {
        userId: session.user.id,
        domain: domain.toLowerCase(),
        apiKey,
        name: name || domain,
        description,
        status: "INACTIVE",
        isActive: false,
      },
      include: {
        subscription: true,
      },
    });

    return NextResponse.json(site, { status: 201 });
  } catch (error) {
    console.error("Error creating site:", error);
    return NextResponse.json(
      { error: "Failed to create site" },
      { status: 500 }
    );
  }
}
