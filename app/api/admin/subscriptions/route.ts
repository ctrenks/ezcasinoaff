import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { SUBSCRIPTION_PLANS } from "@/lib/pricing";

// GET /api/admin/subscriptions - Get all subscriptions with site/user details
export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (!currentUser || currentUser.role !== 5) {
      return NextResponse.json(
        { error: "Forbidden - Super admin access required" },
        { status: 403 }
      );
    }

    const url = new URL(req.url);
    const searchQuery = url.searchParams.get("search") || "";
    const statusFilter = url.searchParams.get("status") || "";
    const planFilter = url.searchParams.get("plan") || "";
    const page = parseInt(url.searchParams.get("page") || "1");
    const pageSize = parseInt(url.searchParams.get("pageSize") || "25");

    // Build where clause
    const whereConditions: any[] = [];

    if (searchQuery) {
      whereConditions.push({
        OR: [
          { site: { domain: { contains: searchQuery, mode: "insensitive" } } },
          { site: { name: { contains: searchQuery, mode: "insensitive" } } },
          { user: { email: { contains: searchQuery, mode: "insensitive" } } },
          { user: { name: { contains: searchQuery, mode: "insensitive" } } },
          { id: { contains: searchQuery, mode: "insensitive" } },
        ],
      });
    }

    if (statusFilter) {
      whereConditions.push({ status: statusFilter });
    }

    if (planFilter) {
      whereConditions.push({ plan: planFilter });
    }

    // Only show subscriptions for ezcasino users
    whereConditions.push({ user: { ezcasino: true } });

    const where = whereConditions.length > 0 ? { AND: whereConditions } : {};

    const [subscriptions, totalCount] = await Promise.all([
      prisma.subscription.findMany({
        where,
        include: {
          site: {
            select: {
              id: true,
              domain: true,
              name: true,
              apiKey: true,
              isActive: true,
              status: true,
              hasGameScreenshots: true,
              hasBonusCodeFeed: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          _count: {
            select: {
              payments: true,
            },
          },
        },
        orderBy: { updatedAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.subscription.count({ where }),
    ]);

    // Get summary stats
    const stats = await prisma.subscription.groupBy({
      by: ["status"],
      _count: true,
      where: { user: { ezcasino: true } },
    });

    const planStats = await prisma.subscription.groupBy({
      by: ["plan"],
      _count: true,
      where: { status: "ACTIVE", user: { ezcasino: true } },
    });

    return NextResponse.json({
      subscriptions,
      pagination: {
        page,
        pageSize,
        totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
      },
      stats: {
        byStatus: stats,
        byPlan: planStats,
      },
    });
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/subscriptions - Update a subscription (plan, status, dates)
export async function PUT(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (!currentUser || currentUser.role !== 5) {
      return NextResponse.json(
        { error: "Forbidden - Super admin access required" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      subscriptionId,
      plan,
      status,
      endDate,
      autoRenew,
      awardCredits,
      reason,
    } = body;

    if (!subscriptionId) {
      return NextResponse.json(
        { error: "Subscription ID required" },
        { status: 400 }
      );
    }

    // Get current subscription
    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
      include: {
        site: true,
        user: true,
      },
    });

    if (!subscription) {
      return NextResponse.json(
        { error: "Subscription not found" },
        { status: 404 }
      );
    }

    // Build update data
    const updateData: any = {};
    const siteUpdateData: any = {};
    let creditsToAward = 0;

    // Handle plan change
    if (plan && plan !== subscription.plan) {
      updateData.plan = plan;
      const planConfig = SUBSCRIPTION_PLANS[plan as keyof typeof SUBSCRIPTION_PLANS];
      if (planConfig) {
        updateData.amount = planConfig.annualPrice;
        updateData.monthlyRate = planConfig.monthlyRate;

        // Update site features based on new plan
        siteUpdateData.hasGameScreenshots = planConfig.features.gameScreenshots;
        siteUpdateData.hasBonusCodeFeed = planConfig.features.bonusCodeFeed;

        // Calculate credits difference if upgrading and awardCredits is true
        if (awardCredits) {
          const oldPlan = SUBSCRIPTION_PLANS[subscription.plan as keyof typeof SUBSCRIPTION_PLANS];
          const oldCredits = oldPlan?.features.includedCredits || 0;
          const newCredits = planConfig.features.includedCredits;
          creditsToAward = (newCredits - oldCredits) * 12; // Annual difference
        }
      }
    }

    // Handle status change
    if (status && status !== subscription.status) {
      updateData.status = status;

      if (status === "ACTIVE") {
        siteUpdateData.isActive = true;
        siteUpdateData.status = "ACTIVE";

        // If activating without a start date, set it now
        if (!subscription.startDate) {
          updateData.startDate = new Date();
          const endDateObj = new Date();
          endDateObj.setFullYear(endDateObj.getFullYear() + 1);
          updateData.endDate = endDateObj;
          updateData.nextBillingDate = endDateObj;
        }
      } else if (status === "CANCELLED" || status === "EXPIRED") {
        updateData.cancelledAt = new Date();
        siteUpdateData.isActive = false;
        siteUpdateData.status = "INACTIVE";
      }
    }

    // Handle end date change
    if (endDate) {
      updateData.endDate = new Date(endDate);
      updateData.nextBillingDate = new Date(endDate);
    }

    // Handle auto-renew change
    if (typeof autoRenew === "boolean") {
      updateData.autoRenew = autoRenew;
    }

    // Perform updates in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Update subscription
      const updatedSubscription = await tx.subscription.update({
        where: { id: subscriptionId },
        data: updateData,
        include: {
          site: true,
          user: true,
        },
      });

      // Update site if needed
      if (Object.keys(siteUpdateData).length > 0 && subscription.site) {
        await tx.site.update({
          where: { id: subscription.site.id },
          data: siteUpdateData,
        });
      }

      // Award credits if upgrading
      if (creditsToAward > 0) {
        const radiumCredit = await tx.radiumCredit.upsert({
          where: { userId: subscription.userId },
          create: {
            userId: subscription.userId,
            balance: creditsToAward,
            lifetime: creditsToAward,
          },
          update: {
            balance: { increment: creditsToAward },
            lifetime: { increment: creditsToAward },
          },
        });

        await tx.radiumTransaction.create({
          data: {
            userId: subscription.userId,
            creditId: radiumCredit.id,
            type: "SUBSCRIPTION",
            amount: creditsToAward,
            balance: radiumCredit.balance,
            description: `Plan upgrade credits: ${subscription.plan} → ${plan} (Admin adjustment${reason ? `: ${reason}` : ""})`,
          },
        });
      }

      // Create notification for user
      await tx.notification.create({
        data: {
          userId: subscription.userId,
          type: "SYSTEM",
          title: "Subscription Updated",
          message: `Your subscription has been updated by an administrator.${reason ? ` Reason: ${reason}` : ""}`,
          link: `/profile/sites/${subscription.siteId}`,
          icon: "📋",
        },
      });

      return {
        subscription: updatedSubscription,
        creditsAwarded: creditsToAward,
      };
    });

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Error updating subscription:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/admin/subscriptions - Create a new subscription for a site (admin override)
export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (!currentUser || currentUser.role !== 5) {
      return NextResponse.json(
        { error: "Forbidden - Super admin access required" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { siteId, plan, durationMonths, awardCredits, reason } = body;

    if (!siteId || !plan) {
      return NextResponse.json(
        { error: "Site ID and plan are required" },
        { status: 400 }
      );
    }

    // Get site
    const site = await prisma.site.findUnique({
      where: { id: siteId },
      include: {
        subscription: true,
        user: true,
      },
    });

    if (!site) {
      return NextResponse.json({ error: "Site not found" }, { status: 404 });
    }

    // Check if site already has active subscription
    if (site.subscription && site.subscription.status === "ACTIVE") {
      return NextResponse.json(
        { error: "Site already has an active subscription. Use PUT to modify it." },
        { status: 400 }
      );
    }

    const planConfig = SUBSCRIPTION_PLANS[plan as keyof typeof SUBSCRIPTION_PLANS];
    if (!planConfig) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const duration = durationMonths || 12;
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + duration);

    const annualCredits = planConfig.features.includedCredits * duration;

    const result = await prisma.$transaction(async (tx) => {
      // Delete old subscription if exists (cancelled/expired)
      if (site.subscription) {
        await tx.subscription.delete({
          where: { id: site.subscription.id },
        });
      }

      // Create new subscription
      const subscription = await tx.subscription.create({
        data: {
          userId: site.userId,
          siteId: site.id,
          plan: plan,
          status: "ACTIVE",
          amount: planConfig.annualPrice * (duration / 12),
          monthlyRate: planConfig.monthlyRate,
          currency: "USD",
          billingPeriod: duration === 12 ? "YEARLY" : "CUSTOM",
          startDate,
          endDate,
          nextBillingDate: endDate,
          autoRenew: false,
        },
      });

      // Update site
      await tx.site.update({
        where: { id: site.id },
        data: {
          subscriptionId: subscription.id,
          isActive: true,
          status: "ACTIVE",
          hasGameScreenshots: planConfig.features.gameScreenshots,
          hasBonusCodeFeed: planConfig.features.bonusCodeFeed,
        },
      });

      // Award credits if requested
      let creditsAwarded = 0;
      if (awardCredits) {
        creditsAwarded = annualCredits;
        const radiumCredit = await tx.radiumCredit.upsert({
          where: { userId: site.userId },
          create: {
            userId: site.userId,
            balance: annualCredits,
            lifetime: annualCredits,
          },
          update: {
            balance: { increment: annualCredits },
            lifetime: { increment: annualCredits },
          },
        });

        await tx.radiumTransaction.create({
          data: {
            userId: site.userId,
            creditId: radiumCredit.id,
            type: "SUBSCRIPTION",
            amount: annualCredits,
            balance: radiumCredit.balance,
            description: `Admin-created ${plan} subscription (${duration} months)${reason ? `: ${reason}` : ""}`,
          },
        });
      }

      // Notify user
      await tx.notification.create({
        data: {
          userId: site.userId,
          type: "SUBSCRIPTION",
          title: "Subscription Activated",
          message: `Your ${plan} subscription for ${site.name || site.domain} has been activated by an administrator.${awardCredits ? ` You received ${annualCredits} Radium Credits!` : ""}`,
          link: `/profile/sites/${site.id}`,
          icon: "🎉",
        },
      });

      return {
        subscription,
        creditsAwarded,
      };
    });

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Error creating subscription:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
