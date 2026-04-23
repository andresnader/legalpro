import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/db/schema";

const SECRET_ADMIN_KEY = "admin-secure-2026";

export async function POST(req: NextRequest) {
  try {
    const { secretKey, email, name } = await req.json();

    if (secretKey !== SECRET_ADMIN_KEY) {
      return NextResponse.json({ error: "Clave inválida" }, { status: 401 });
    }

    if (!email || !name) {
      return NextResponse.json({ error: "Email y nombre requeridos" }, { status: 400 });
    }

    // Hash temporal para "admin123"
    const hashedPassword = "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYfQ3Z7aOdy";

    const [newUser] = await db
      .insert(users)
      .values({
        name,
        email,
        password: hashedPassword,
        role: "admin",
      })
      .returning();

    return NextResponse.json({ 
      message: "Admin creado", 
      user: { id: newUser.id, email: newUser.email, role: newUser.role } 
    });
  } catch (error) {
    console.error("Create admin error:", error);
    return NextResponse.json({ error: "Error al crear admin" }, { status: 500 });
  }
}