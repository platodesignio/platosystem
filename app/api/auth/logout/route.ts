import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  cookies().delete("plato_user");
  cookies().delete("plato_workspace");
  return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_APP_URL));
}
