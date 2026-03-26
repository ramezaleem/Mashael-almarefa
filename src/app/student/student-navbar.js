"use client";

import PortalNavbar from "@/components/portal-navbar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function StudentNavbar({ sectionTitle, links, ctaLabel, ctaHref }) {
    const [session, setSession] = useState(null);
    const router = useRouter();

    const loadSession = () => {
        const cookies = document.cookie.split("; ");
        const roleCookie = cookies.find(c => c.startsWith("userRole="));
        if (roleCookie) {
            const role = roleCookie.split("=")[1];
            if (role === "student") {
                const sessionCookie = cookies.find(c => c.startsWith("session="));
                if (sessionCookie) {
                    try {
                        const base64 = decodeURIComponent(sessionCookie.split("=")[1]);
                        const decoded = decodeURIComponent(atob(base64));
                        const data = JSON.parse(decoded);
                        
                        // Check for local profile updates (image, name, etc.)
                        const localProfile = localStorage.getItem(`student_profile_${data.email}`);
                        if (localProfile) {
                            const parsedLocal = JSON.parse(localProfile);
                            if (parsedLocal.image) data.image = parsedLocal.image;
                            if (parsedLocal.name) data.name = parsedLocal.name;
                        }
                        
                        setSession(data);
                    } catch {
                        console.error("Failed to parse session");
                        setSession({ role: "student", name: "طالب تجريبي", email: "student@gmail.com" });
                    }
                } else {
                    setSession({ role: "student", name: "طالب تجريبي", email: "student@gmail.com" });
                }
            } else {
                setSession({ role, name: "مستخدم", email: "" });
            }
        }
    }

    useEffect(() => {
        loadSession();
        window.addEventListener('profileUpdate', loadSession);
        return () => window.removeEventListener('profileUpdate', loadSession);
    }, []);

    const handleLogout = () => {
        document.cookie = "userRole=; path=/; max-age=0;";
        document.cookie = "session=; path=/; max-age=0;";
        router.push("/auth/login");
        router.refresh();
    };

    return (
        <PortalNavbar
            sectionTitle={sectionTitle}
            links={links}
            ctaLabel={ctaLabel}
            ctaHref={ctaHref}
            userSession={session}
            onLogout={handleLogout}
        />
    );
}
