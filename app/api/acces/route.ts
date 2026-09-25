import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { code } = await request.json();
  const expected = process.env.ACCESS_CODE;

  if (!expected) {
    return NextResponse.json(
      { ok: false, error: "ACCESS_CODE non configuré côté serveur." },
      { status: 500 }
    );
  }

  if ((code || "").trim().toUpperCase() !== expected.toUpperCase()) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set("kz_vip", "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 jours
  });
  return res;
}
