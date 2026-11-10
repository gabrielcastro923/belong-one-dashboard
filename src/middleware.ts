import { NextResponse, type NextRequest } from "next/server";

// Gate: when DASH_KEY is set, every page and /data/*.json needs cookie dash_key === DASH_KEY.
export function middleware(req: NextRequest) {
  const key = process.env.DASH_KEY;
  if (!key) return NextResponse.next();
  if (req.cookies.get("dash_key")?.value === key) return NextResponse.next();
  const url = req.nextUrl.clone();
  url.pathname = "/unlock";
  url.search = "";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|unlock|api/unlock).*)"],
};
