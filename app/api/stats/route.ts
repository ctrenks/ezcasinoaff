import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Get all stats in parallel for better performance
    const [
      activeCasinos,
      totalGames,
      gamesWithDemos,
      activeBanks,
      activeSoftware,
      activeJurisdictions,
    ] = await Promise.all([
      // Active casinos (approved=1, rogue=0)
      prisma.casino_p_casinos.count({
        where: {
          approved: 1,
          rogue: 0,
        },
      }),

      // Total games
      prisma.casino_p_games.count(),

      // Games with SlotsLaunch demos (have afc_id linked to slots_launch)
      prisma.slots_launch.count({
        where: {
          afc_id: {
            not: null,
          },
        },
      }),

      // Active banks
      prisma.casino_p_banks.count({
        where: {
          status: 1,
        },
      }),

      // Active software providers
      prisma.casino_p_software.count({
        where: {
          status: 1,
        },
      }),

      // Active jurisdictions
      prisma.casino_p_lcb_juristrictions.count({
        where: {
          status: 1,
        },
      }),
    ]);

    return NextResponse.json({
      casinos: activeCasinos,
      games: totalGames,
      gamesWithDemos,
      banks: activeBanks,
      software: activeSoftware,
      jurisdictions: activeJurisdictions,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
