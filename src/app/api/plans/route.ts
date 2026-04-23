import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { plans, coverages, planCoverages } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const allPlans = await db.query.plans.findMany({
      where: eq(plans.isActive, true),
      with: {
        planCoverages: {
          with: {
            coverage: true,
          },
        },
      },
    });

    return NextResponse.json(allPlans);
  } catch (error) {
    console.error("Error fetching plans:", error);
    return NextResponse.json(
      { error: "Error al obtener los planes" },
      { status: 500 }
    );
  }
}
