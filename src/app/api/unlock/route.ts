import { NextResponse, type NextRequest } from "next/server";

export const dynamic = "force-dynamic";

const NINETY_DAYS = 60 * 60 * 24 * 90;

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const submitted = String(form.get("key") ?? "");
  const key = process.env.DASH_KEY;
  if (key && submitted !== key) {
    return NextResponse.redirect(new URL("/unlock?e=1", req.url), 303);
  }
  const res = NextResponse.redirect(new URL("/", req.url), 303);
  if (key) {
    res.cookies.set("dash_key", submitted, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: NINETY_DAYS,
    });
  }
  return res;
}
