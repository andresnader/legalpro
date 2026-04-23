import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

const SECRET_KEY = "reset-admin-2026";

export async function POST(req: NextRequest) {
  try {
    const { secretKey, email, password } = await req.json();

    if (secretKey !== SECRET_KEY) {
      return NextResponse.json({ error: "Clave inválida" }, { status: 401 });
    }

    if (!email || !password) {
      return NextResponse.json({ error: "Email y contraseña requeridos" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const [updatedUser] = await db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.email, email))
      .returning();

    if (!updatedUser) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ 
      message: "Contraseña actualizada", 
      user: { id: updatedUser.id, email: updatedUser.email } 
    });
  } catch (error) {
    console.error("Reset error:", error);
    return NextResponse.json({ error: "Error al resetear" }, { status: 500 });
  }
}