import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { rateLimit } from "@/lib/rate-limit";
import { moduloDeRuta, MODULO_SIEMPRE_PERMITIDO } from "@/lib/permisos";

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}

// Next.js 16: archivo proxy.ts — función exportada como "proxy" (antes "middleware")
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip = getClientIp(request);

  // Rate limit: /api/pqrs — 5 envíos por IP cada 10 minutos
  if (pathname === "/api/pqrs" && request.method === "POST") {
    const result = rateLimit(`pqrs:${ip}`, 5, 10 * 60 * 1000);
    if (!result.allowed) {
      return NextResponse.json(
        { error: "Demasiadas solicitudes. Intente nuevamente más tarde." },
        {
          status: 429,
          headers: {
            "Retry-After": String(
              Math.ceil((result.resetAt - Date.now()) / 1000),
            ),
            "X-RateLimit-Limit": "5",
            "X-RateLimit-Remaining": "0",
          },
        },
      );
    }
  }

  // Rate limit: /gestion-interna/login — 10 intentos por IP cada minuto
  if (pathname === "/gestion-interna/login" && request.method === "POST") {
    const result = rateLimit(`login:${ip}`, 10, 60 * 1000);
    if (!result.allowed) {
      return NextResponse.json(
        { error: "Demasiados intentos. Espere un momento." },
        {
          status: 429,
          headers: {
            "Retry-After": String(
              Math.ceil((result.resetAt - Date.now()) / 1000),
            ),
            "X-RateLimit-Limit": "10",
            "X-RateLimit-Remaining": "0",
          },
        },
      );
    }
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Refrescar la sesión — obligatorio para que el token no expire silenciosamente.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAdminRoute = request.nextUrl.pathname.startsWith("/gestion-interna");
  const isLoginPage = request.nextUrl.pathname === "/gestion-interna/login";
  // /gestion-interna/login es la página de acceso; el resto requiere sesión

  if (isAdminRoute && !isLoginPage && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/gestion-interna/login";
    return NextResponse.redirect(loginUrl);
  }

  // Verificar estado (suspendido) y permiso de módulo del usuario autenticado.
  // Si la tabla profiles aún no existe (migración pendiente en Supabase),
  // se deja pasar — comportamiento de transición para no romper el panel.
  if (isAdminRoute && !isLoginPage && user) {
    const admin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const { data: perfil } = await admin
      .from("profiles")
      .select("estado, modulos_permitidos")
      .eq("id", user.id)
      .maybeSingle();

    if (perfil) {
      if (perfil.estado === "suspendido") {
        await supabase.auth.signOut();
        const loginUrl = request.nextUrl.clone();
        loginUrl.pathname = "/gestion-interna/login";
        loginUrl.searchParams.set("motivo", "suspendido");
        return NextResponse.redirect(loginUrl);
      }

      const modulo = moduloDeRuta(pathname);
      if (
        modulo &&
        modulo.slug !== MODULO_SIEMPRE_PERMITIDO &&
        !perfil.modulos_permitidos.includes(modulo.slug)
      ) {
        const dashboardUrl = request.nextUrl.clone();
        dashboardUrl.pathname = "/gestion-interna/dashboard";
        dashboardUrl.searchParams.set("motivo", "sin_permiso");
        return NextResponse.redirect(dashboardUrl);
      }
    }
  }

  // Redirigir al dashboard si ya tiene sesión e intenta acceder al login
  if (isLoginPage && user) {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = "/gestion-interna/dashboard";
    return NextResponse.redirect(dashboardUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
