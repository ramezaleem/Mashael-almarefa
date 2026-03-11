import { NextResponse } from 'next/server';

export function middleware(request) {
    const userRoleCookie = request.cookies.get('userRole');
    const userRole = userRoleCookie ? userRoleCookie.value : null;

    const { pathname } = request.nextUrl;

    // Protect Admin Routes
    if (pathname.startsWith('/admin')) {
        if (userRole !== 'admin') {
            return NextResponse.redirect(new URL('/auth/login', request.url));
        }
    }

    // Protect Student Routes
    if (pathname.startsWith('/student')) {
        if (userRole !== 'student' && userRole !== 'admin') {
            return NextResponse.redirect(new URL('/auth/login', request.url));
        }
    }

    // Protect Teacher Routes
    const teacherRoutes = ['/teacher', '/quran-and-sciences', '/arabic-non-native', '/egypt-gulf-curricula'];
    const isTeacherRoute = teacherRoutes.some(route => pathname.startsWith(route));

    if (isTeacherRoute) {
        if (userRole !== 'teacher' && userRole !== 'admin') {
            return NextResponse.redirect(new URL('/auth/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    // Add all routes that need to be protected
    matcher: [
        '/admin/:path*',
        '/student/:path*',
        '/teacher/:path*',
        '/quran-and-sciences/:path*',
        '/arabic-non-native/:path*',
        '/egypt-gulf-curricula/:path*'
    ],
};
