import { NextRequest, NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { db } from "@/lib/db";

const SECRET_KEY = "migrate-secure-2026";

export async function POST(req: NextRequest) {
  try {
    const { secretKey } = await req.json();

    if (secretKey !== SECRET_KEY) {
      return NextResponse.json({ error: "Clave inválida" }, { status: 401 });
    }

    const results = [];

    // Users table
    try {
      await db.execute(sql`CREATE TABLE IF NOT EXISTS "users" ("id" text PRIMARY KEY NOT NULL, "name" text NOT NULL, "email" text NOT NULL, "email_verified" timestamp, "image" text, "password" text, "phone" text, "cedula" text, "role" text DEFAULT 'user' NOT NULL, "created_at" timestamp DEFAULT now() NOT NULL, "updated_at" timestamp DEFAULT now() NOT NULL)`);
      results.push("users table created");
    } catch (e: any) {
      results.push(`users: ${e.message}`);
    }

    // Plans table
    try {
      await db.execute(sql`CREATE TABLE IF NOT EXISTS "plans" ("id" text PRIMARY KEY NOT NULL, "name" text NOT NULL, "description" text, "price" numeric(10, 2) NOT NULL, "is_active" boolean DEFAULT true NOT NULL, "created_at" timestamp DEFAULT now() NOT NULL)`);
      results.push("plans table created");
    } catch (e: any) {
      results.push(`plans: ${e.message}`);
    }

    // Coverages table
    try {
      await db.execute(sql`CREATE TABLE IF NOT EXISTS "coverages" ("id" text PRIMARY KEY NOT NULL, "name" text NOT NULL, "description" text, "slug" text NOT NULL, "icon" text, "created_at" timestamp DEFAULT now() NOT NULL)`);
      results.push("coverages table created");
    } catch (e: any) {
      results.push(`coverages: ${e.message}`);
    }

    // Subscriptions table
    try {
      await db.execute(sql`CREATE TABLE IF NOT EXISTS "subscriptions" ("id" text PRIMARY KEY NOT NULL, "user_id" text NOT NULL, "plan_id" text NOT NULL, "status" text DEFAULT 'pending' NOT NULL, "start_date" timestamp NOT NULL, "end_date" timestamp NOT NULL, "payphone_transaction_id" text, "created_at" timestamp DEFAULT now() NOT NULL, "updated_at" timestamp DEFAULT now() NOT NULL)`);
      results.push("subscriptions table created");
    } catch (e: any) {
      results.push(`subscriptions: ${e.message}`);
    }

    // Payments table
    try {
      await db.execute(sql`CREATE TABLE IF NOT EXISTS "payments" ("id" text PRIMARY KEY NOT NULL, "subscription_id" text NOT NULL, "amount" numeric(10, 2) NOT NULL, "currency" text DEFAULT 'USD', "date" timestamp NOT NULL, "status" text DEFAULT 'pending' NOT NULL, "payment_method" text, "payphone_reference" text, "created_at" timestamp DEFAULT now() NOT NULL)`);
      results.push("payments table created");
    } catch (e: any) {
      results.push(`payments: ${e.message}`);
    }

    // Sessions table
    try {
      await db.execute(sql`CREATE TABLE IF NOT EXISTS "sessions" ("session_token" text PRIMARY KEY NOT NULL, "user_id" text NOT NULL, "expires" timestamp NOT NULL)`);
      results.push("sessions table created");
    } catch (e: any) {
      results.push(`sessions: ${e.message}`);
    }

    // Accounts table
    try {
      await db.execute(sql`CREATE TABLE IF NOT EXISTS "accounts" ("user_id" text NOT NULL, "type" text NOT NULL, "provider" text NOT NULL, "provider_account_id" text NOT NULL, "refresh_token" text, "access_token" text, "expires_at" integer, "token_type" text, "scope" text, "id_token" text, "session_state" text)`);
      results.push("accounts table created");
    } catch (e: any) {
      results.push(`accounts: ${e.message}`);
    }

    // Verification tokens table
    try {
      await db.execute(sql`CREATE TABLE IF NOT EXISTS "verification_tokens" ("identifier" text NOT NULL, "token" text NOT NULL, "expires" timestamp NOT NULL)`);
      results.push("verification_tokens table created");
    } catch (e: any) {
      results.push(`verification_tokens: ${e.message}`);
    }

    // Plan coverages table
    try {
      await db.execute(sql`CREATE TABLE IF NOT EXISTS "plan_coverages" ("id" text PRIMARY KEY NOT NULL, "plan_id" text NOT NULL, "coverage_id" text NOT NULL)`);
      results.push("plan_coverages table created");
    } catch (e: any) {
      results.push(`plan_coverages: ${e.message}`);
    }

    // Subscription coverages table
    try {
      await db.execute(sql`CREATE TABLE IF NOT EXISTS "subscription_coverages" ("id" text PRIMARY KEY NOT NULL, "subscription_id" text NOT NULL, "coverage_id" text NOT NULL, "is_active" boolean DEFAULT true NOT NULL)`);
      results.push("subscription_coverages table created");
    } catch (e: any) {
      results.push(`subscription_coverages: ${e.message}`);
    }

    return NextResponse.json({ message: "Migration completed", results });
  } catch (error) {
    console.error("Migration error:", error);
    return NextResponse.json({ error: "Migration failed" }, { status: 500 });
  }
}