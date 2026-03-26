"use client";

// Fresh test environment: Admin only
const INITIAL_USERS = [
  { 
    id: "ADM-001",
    role: "admin", 
    email: "admin@gmail.com", 
    password: "123", 
    name: "مدير النظام", 
    course: "", 
    redirect: "/admin/dashboard" 
  }
];

export const getLocalUsers = () => {
    if (typeof window === "undefined") return INITIAL_USERS;
    
    // Check if we need a fresh start (resetting database for current tests)
    const dbVersion = "v1.1_clean_test"; // Change this if you want another full reset
    const storedVersion = localStorage.getItem("app_users_version");
    
    if (storedVersion !== dbVersion) {
        localStorage.setItem("app_users", JSON.stringify(INITIAL_USERS));
        localStorage.setItem("app_users_version", dbVersion);
        return INITIAL_USERS;
    }

    const stored = localStorage.getItem("app_users");
    if (!stored) {
        localStorage.setItem("app_users", JSON.stringify(INITIAL_USERS));
        return INITIAL_USERS;
    }
    return JSON.parse(stored);
};

export const saveUser = (user) => {
    const users = getLocalUsers();
    // Prevent duplicate emails
    if (users.find(u => u.email === user.email)) {
        return null;
    }
    const newUser = {
        ...user,
        id: Date.now().toString(),
        age: user.age || 10,
        level: user.level || (user.role === "student" ? "مستوى جديد" : ""),
        joinDate: new Date().toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' }),
        redirect: user.role === "admin" ? "/admin/dashboard" : (user.role === "teacher" ? "/teacher/profile" : "/student/profile")
    };
    const updated = [...users, newUser];
    localStorage.setItem("app_users", JSON.stringify(updated));
    return newUser;
};

export const deleteUser = (id) => {
    const users = getLocalUsers();
    const updated = users.filter(u => u.id !== id && u.email !== id);
    localStorage.setItem("app_users", JSON.stringify(updated));
};

export const updateUser = (updatedUser) => {
    const users = getLocalUsers();
    const updated = users.map(u => (u.id === updatedUser.id || u.email === updatedUser.email) ? { ...u, ...updatedUser } : u);
    localStorage.setItem("app_users", JSON.stringify(updated));
};
