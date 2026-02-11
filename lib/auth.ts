import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

/* ===============================
   パスワード
=============================== */

export async function hashPassword(
  password: string
): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

/* ===============================
   JWT
=============================== */

function requireJwtSecret(): string {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }

  return secret;
}

export function signToken(userId: string): string {
  const secret = requireJwtSecret();

  return jwt.sign(
    { userId },
    secret,
    { expiresIn: "7d" }
  );
}

export function verifyToken(
  token: string
): { userId: string } {
  const secret = requireJwtSecret();

  const decoded = jwt.verify(
    token,
    secret
  ) as { userId: string };

  if (!decoded.userId) {
    throw new Error("Invalid token payload");
  }

  return decoded;
}

