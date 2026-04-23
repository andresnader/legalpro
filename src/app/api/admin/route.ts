import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, subscriptions, payments, plans } from "@/db/schema";
import { eq, count, sql } from "drizzle-orm";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    // Get metrics
    const totalUsers = await db.select({ count: count() }).from(users);
    const totalSubscriptions = await db.select({ count: count() }).from(subscriptions);
    const activeSubscriptions = await db.select({ count: count() }).from(subscriptions).where(eq(subscriptions.status, "active"));
    const totalPayments = await db.select({ count: count() }).from(payments).where(eq(payments.status, "completed"));
    
    // Get recent users
    const recentUsers = await db.query.users.findMany({
      orderBy: (users, { desc }) => [desc(users.createdAt)],
      limit: 10,
    });

    // Get recent subscriptions with user and plan info
    const recentSubscriptions = await db.query.subscriptions.findMany({
      orderBy: (subscriptions, { desc }) => [desc(subscriptions.createdAt)],
      limit: 10,
      with: {
        user: true,
        plan: true,
      },
    });

    // Get revenue by plan
    const revenueByPlan = await db
      .select({
        planName: plans.name,
        totalRevenue: sql<string>`COALESCE(SUM(${payments.amount}), 0)`,
        count: count(payments.id),
      })
      .from(plans)
      .leftJoin(subscriptions, eq(plans.id, subscriptions.planId))
      .leftJoin(payments, eq(subscriptions.id, payments.subscriptionId))
      .where(eq(payments.status, "completed"))
      .groupBy(plans.name);

    return NextResponse.json({
      metrics: {
        totalUsers: totalUsers[0].count,
        totalSubscriptions: totalSubscriptions[0].count,
        activeSubscriptions: activeSubscriptions[0].count,
        totalPayments: totalPayments[0].count,
      },
      recentUsers,
      recentSubscriptions,
      revenueByPlan,
    });
  } catch (error) {
    console.error("Admin API error:", error);
    return NextResponse.json(
      { error: "Error al obtener datos de administración" },
      { status: 500 }
    );
  }
}
