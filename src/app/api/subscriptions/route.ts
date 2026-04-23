import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { subscriptions, payments, coverages, subscriptionCoverages, plans } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const userSubscriptions = await db.query.subscriptions.findMany({
      where: eq(subscriptions.userId, session.user.id),
      with: {
        plan: true,
        subscriptionCoverages: {
          with: {
            coverage: true,
          },
        },
        payments: true,
      },
      orderBy: (subscriptions, { desc }) => [desc(subscriptions.createdAt)],
    });

    return NextResponse.json(userSubscriptions);
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    return NextResponse.json(
      { error: "Error al obtener suscripciones" },
      { status: 500 }
    );
  }
}
