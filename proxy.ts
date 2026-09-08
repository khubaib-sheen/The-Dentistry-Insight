import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://rtzxxeeqfhmmnoubwzvq.supabase.co";
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "sb_publishable_v8RouLqDckbyAXURXFo18w_Q0M3Qx5-";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const { pathname } = request.nextUrl;

  // Gate everything under /admin except the login page itself.
  // (auth.getUser() only runs for /admin — no need to hit Supabase
  // Auth on every public page load.)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return response;
  }

  // Serve 301s for slugs that changed via the admin CMS (spec §3:
  // "auto-create a 301 redirect from old slug to new"). Prefiltered to
  // the six content folders so we're not hitting the DB on every request
  // (home, static pages, assets never have redirects).
  const REDIRECTABLE = /^\/(jobs|blogs|workshop|market|exams|students)\/[^/]+/;
  if (REDIRECTABLE.test(pathname)) {
    const { data: redirect } = await supabase
      .from("url_redirects")
      .select("to_path")
      .eq("from_path", pathname)
      .maybeSingle();

    if (redirect?.to_path) {
      return NextResponse.redirect(new URL(redirect.to_path, request.url), 301);
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|logo.png|founder.jpg).*)",
  ],
};
