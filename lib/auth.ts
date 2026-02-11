import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

/* ===============================
   安全に環境変数取得
=============================== */

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }

  return secret;
}

const JWT_EXPIRES_IN = "7d";

/* ===============================
   パスワードハッシュ
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
   JWT署名
=============================== */

export function signToken(userId: string): string {
  return jwt.sign(
    { userId },
    getJwtSecret(),
    {
      expiresIn: JWT_EXPIRES_IN
    }
  );
}

/* ===============================
   JWT検証
=============================== */

export function verifyToken(
  token: string
): { userId: string } {
  const decoded = jwt.verify(
    token,
    getJwtSecret()
  ) as { userId: string };

  if (!decoded.userId) {
    throw new Error("Invalid token payload");
  }

  return decoded;
}
