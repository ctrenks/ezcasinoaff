import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminDashboard() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  // Check if user is super admin (role 5)
  if (session.user.role !== 5) {
    redirect("/");
  }

  // Fetch statistics
  const [
    totalUsers,
    newUsersThisMonth,
    activeSubscriptions,
    totalRevenue,
    pendingCommissions,
    totalCommissions,
    totalCreditsBalance,
  ] = await Promise.all([
    // Total users (only ezcasino users)
    prisma.user.count({
      where: { ezcasino: true },
    }),

    // New users this month (only ezcasino users)
    prisma.user.count({
      where: {
        ezcasino: true,
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    }),

    // Active subscriptions
    prisma.subscription.count({
      where: {
        status: "ACTIVE",
      },
    }),

    // Total revenue from successful payments
    prisma.payment.aggregate({
      where: {
        status: "SUCCEEDED",
      },
      _sum: {
        amount: true,
      },
    }),

    // Pending commissions
    prisma.affiliateCommission.aggregate({
      where: {
        status: "PENDING",
      },
      _sum: {
        amount: true,
      },
    }),

    // Total commissions paid
    prisma.affiliateCommission.aggregate({
      where: {
        status: "PAID",
      },
      _sum: {
        amount: true,
      },
    }),

    // Total Radium credits across all users
    prisma.radiumCredit.aggregate({
      _sum: {
        balance: true,
        lifetime: true,
      },
    }),
  ]);

  const stats = [
    {
      title: "Total Users",
      value: totalUsers.toLocaleString(),
      subtitle: `${newUsersThisMonth} new this month`,
      icon: "👥",
      color: "bg-blue-500",
    },
    {
      title: "Active Subscriptions",
      value: activeSubscriptions.toLocaleString(),
      subtitle: "Currently active",
      icon: "💳",
      color: "bg-green-500",
    },
    {
      title: "Total Revenue",
      value: `$${(Number(totalRevenue._sum.amount) || 0).toLocaleString(
        undefined,
        { minimumFractionDigits: 2, maximumFractionDigits: 2 }
      )}`,
      subtitle: "All-time",
      icon: "💰",
      color: "bg-purple-500",
    },
    {
      title: "Pending Commissions",
      value: `$${(Number(pendingCommissions._sum.amount) || 0).toLocaleString(
        undefined,
        { minimumFractionDigits: 2, maximumFractionDigits: 2 }
      )}`,
      subtitle: "Awaiting payout",
      icon: "⏳",
      color: "bg-yellow-500",
    },
    {
      title: "Paid Commissions",
      value: `$${(Number(totalCommissions._sum.amount) || 0).toLocaleString(
        undefined,
        { minimumFractionDigits: 2, maximumFractionDigits: 2 }
      )}`,
      subtitle: "All-time",
      icon: "✅",
      color: "bg-emerald-500",
    },
    {
      title: "Radium Credits",
      value: (totalCreditsBalance._sum.balance || 0).toLocaleString(),
      subtitle: `${(
        totalCreditsBalance._sum.lifetime || 0
      ).toLocaleString()} lifetime`,
      icon: "💎",
      color: "bg-indigo-500",
    },
  ];

  const adminSections = [
    {
      title: "User Management",
      description: "View all EZ users, sites, API keys, and account details",
      href: "/admin/users",
      icon: "👥",
      color: "bg-blue-100 text-blue-700 border-blue-300",
    },
    {
      title: "Manage Affiliates",
      description: "View and manage user commission rates",
      href: "/admin/affiliates",
      icon: "⚙️",
      color: "bg-orange-100 text-orange-700 border-orange-300",
    },
    {
      title: "Manage EZ Credits",
      description: "Manually adjust user EZ Credits (payment currency)",
      href: "/admin/credits",
      icon: "💎",
      color: "bg-purple-100 text-purple-700 border-purple-300",
    },
    {
      title: "Manage Radium Credits",
      description: "Manually adjust user Radium Credits (AI reviews)",
      href: "/admin/radium-credits",
      icon: "🤖",
      color: "bg-indigo-100 text-indigo-700 border-indigo-300",
    },
    {
      title: "Send Notifications",
      description: "Broadcast notifications to users",
      href: "/admin/notifications",
      icon: "📢",
      color: "bg-purple-100 text-purple-700 border-purple-300",
    },
    {
      title: "Forum Management",
      description: "Manage forum categories and settings",
      href: "/forum/admin",
      icon: "💬",
      color: "bg-green-100 text-green-700 border-green-300",
    },
    {
      title: "Plugin Upload",
      description: "Upload new Radium WordPress plugin versions",
      href: "/admin/plugin-upload",
      icon: "🔌",
      color: "bg-cyan-100 text-cyan-700 border-cyan-300",
    },
    {
      title: "Theme Upload",
      description: "Upload new WordPress theme versions",
      href: "/admin/theme-upload",
      icon: "🎨",
      color: "bg-pink-100 text-pink-700 border-pink-300",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back, {session.user.name || session.user.email}
        </p>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center text-2xl`}
              >
                {stat.icon}
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              {stat.title}
            </h3>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {stat.value}
            </p>
            <p className="text-sm text-gray-500">{stat.subtitle}</p>
          </div>
        ))}
      </div>

      {/* Admin Sections */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Administration
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {adminSections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className={`${section.color} p-6 rounded-lg border-2 hover:shadow-lg transition group`}
            >
              <div className="flex items-start">
                <span className="text-3xl mr-4">{section.icon}</span>
                <div>
                  <h3 className="text-lg font-bold mb-1 group-hover:underline">
                    {section.title}
                  </h3>
                  <p className="text-sm opacity-80">{section.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-6 border border-purple-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Links</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/profile"
            className="text-center p-4 bg-white rounded-lg hover:shadow-md transition"
          >
            <div className="text-2xl mb-2">👤</div>
            <div className="text-sm font-medium text-gray-700">My Profile</div>
          </Link>
          <Link
            href="/profile/sites"
            className="text-center p-4 bg-white rounded-lg hover:shadow-md transition"
          >
            <div className="text-2xl mb-2">🏢</div>
            <div className="text-sm font-medium text-gray-700">All Sites</div>
          </Link>
          <Link
            href="/forum"
            className="text-center p-4 bg-white rounded-lg hover:shadow-md transition"
          >
            <div className="text-2xl mb-2">💬</div>
            <div className="text-sm font-medium text-gray-700">Forum</div>
          </Link>
          <Link
            href="/casinos"
            className="text-center p-4 bg-white rounded-lg hover:shadow-md transition"
          >
            <div className="text-2xl mb-2">🎰</div>
            <div className="text-sm font-medium text-gray-700">Casinos</div>
          </Link>
        </div>
      </div>
    </div>
  );
}
