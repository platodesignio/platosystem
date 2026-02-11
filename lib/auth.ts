import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

/* ===============================
   環境変数チェック
=============================== */

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
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
    JWT_SECRET as string,
    {
      expiresIn: JWT_EXPIRES_IN
    }
  );
}

/* ===============================
   JWT検証
=============================== */

export function verifyToken(token: string): {
  userId: string;
} {
  const decoded = jwt.verify(
    token,
    JWT_SECRET as string
  ) as { userId: string };

  if (!decoded.userId) {
    throw new Error("Invalid token payload");
  }

  return decoded;
}
