import { jwtVerify } from 'jose';
import { NextResponse } from 'next/server';

export async function proxy(request) {
  const path = request.nextUrl.pathname;

  const isPublicPath = path === '/auth/login';
  const token = request.cookies.get('token')?.value || '';

  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/', request.nextUrl));
  }
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/auth/login', request.nextUrl));
  }

  if (!isPublicPath) {
    if (!token) {
      return new NextResponse(JSON.stringify({ error: 'No token provided' }), {
        status: 401,
      });
    } else {
      try {
        const secret = new TextEncoder().encode(process.env.TOKEN_SECRET);

        await jwtVerify(token, secret);
        // Token valid → continue
        return NextResponse.next();
      } catch (error) {
        console.error(error);
        // token expired or invalid → clear cookie & redirect
        const res = NextResponse.redirect(
          new URL('/auth/login', request.nextUrl),
        );
        res.cookies.set('token', '', { maxAge: 0 });
        return res;
      }
    }
  }
}

export const config = {
  matcher: [
    '/',
    '/auth/login',
    '/categories',
    '/categories/:path*',
    '/pages',
    '/pages/:path*',
    '/api/categories/:path*',
    '/api/pages/:path*',
  ],
};
