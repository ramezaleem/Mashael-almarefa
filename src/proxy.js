import { NextResponse } from 'next/server';

export function proxy(request) {
    const userRoleCookie = request.cookies.get('userRole');
    const userRole = userRoleCookie ? userRoleCookie.value : null;

    const { pathname, searchParams } = request.nextUrl;

    // 1. Allow public routes
    const isPublicGuestRoute = 
        pathname === '/student/quran-teachers' || 
        pathname === '/student/arabic-teachers' || 
        pathname === '/student/curricula-teachers' ||
        pathname === '/student/courses';

    if (pathname === '/' || pathname.startsWith('/auth') || isPublicGuestRoute) {
        // Redirect logged in users away from auth pages unless they are explicitly logging out
        if (userRole && pathname.startsWith('/auth') && !searchParams.get('logout')) {
            if (userRole === 'student') return NextResponse.redirect(new URL('/student/profile', request.url));
            if (userRole === 'admin') return NextResponse.redirect(new URL('/admin/dashboard', request.url));
            if (userRole === 'teacher') return NextResponse.redirect(new URL('/teacher/profile', request.url));
        }
        return NextResponse.next();
    }

    // 2. If no role, redirect to login for any other path
    if (!userRole) {
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    // 3. Admin has access to all routes
    if (userRole === 'admin') {
        return NextResponse.next();
    }

    // 4. Decode Session for course checking
    let userCourse = "";
    const sessionCookie = request.cookies.get('session');
    if (sessionCookie) {
        try {
            const base64Str = sessionCookie.value;
            // Use Buffer for stability in server/edge environments if possible
            const uriEncodedStr = Buffer.from(base64Str, 'base64').toString('utf8');
            const jsonStr = decodeURIComponent(uriEncodedStr);
            const sessionData = JSON.parse(jsonStr);
            userCourse = sessionData.course || "";
        } catch {
            // fallback
        }
    }

    // explicit denial for non-admins for courses-center
    if (pathname.startsWith('/courses-center')) {
        if (userRole === 'student') {
            return NextResponse.redirect(new URL('/student/profile', request.url));
        } else if (userRole === 'teacher') {
            return NextResponse.redirect(new URL('/teacher/profile', request.url));
        }
    }

    // 5. Apply Restrictions
    if (userRole === 'student') {
        let isAllowed = pathname.startsWith('/student');
        if (isAllowed && pathname.startsWith('/student/quran-teachers') && userCourse !== 'ركن القرآن') isAllowed = false;
        if (isAllowed && pathname.startsWith('/student/arabic-teachers') && userCourse !== 'العربية لغير الناطقين') isAllowed = false;
        if (isAllowed && pathname.startsWith('/student/curricula-teachers') && userCourse !== 'المناهج الدراسية') isAllowed = false;

        if (!isAllowed) return NextResponse.redirect(new URL('/student/profile', request.url));
    }

    if (userRole === 'teacher') {
        let isAllowed = pathname.startsWith('/teacher');
        if (!isAllowed) {
            if (userCourse === 'ركن القرآن' && pathname.startsWith('/quran-and-sciences')) isAllowed = true;
            else if (userCourse === 'العربية لغير الناطقين' && pathname.startsWith('/arabic-non-native')) isAllowed = true;
            else if (userCourse === 'المناهج الدراسية' && pathname.startsWith('/egypt-gulf-curricula')) isAllowed = true;
        }
        if (!isAllowed) return NextResponse.redirect(new URL('/teacher/profile', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|manifest.json|sw.js|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
