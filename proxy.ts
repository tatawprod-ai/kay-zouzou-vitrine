import { NextRequest, NextResponse } from "next/server";

// Laisse passer /acces, l'API de validation, et les assets Next.js sans code.
const PUBLIC_PATHS = ["/acces", "/api/acces", "/_next", "/favicon.ico"];
// Préinscription publique, sans code VIP : égalité stricte (pas de startsWith)
// pour n'ouvrir que ces deux chemins exacts.
const PUBLIC_EXACT_PATHS = ["/inscription", "/api/inscriptions"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_EXACT_PATHS.includes(pathname) || PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const hasAccess = request.cookies.get("kz_vip")?.value === "1";
  if (!hasAccess) {
    const url = request.nextUrl.clone();
    url.pathname = "/acces";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
