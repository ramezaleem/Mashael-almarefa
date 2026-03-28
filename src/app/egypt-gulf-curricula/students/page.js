"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import TeacherNavbar from "../../teacher/teacher-navbar";

const NAV_LINKS = [
    { label: "طلاب القسم", href: "/egypt-gulf-curricula/students" },
    { label: "الملف الشخصي", href: "/teacher/profile" },
];

const STUDENTS_DATA = [
    { id: "EGC-001", name: "طالب المناهج الدراسية", email: "student3@gmail.com", age: 10, joinDate: "15 يناير 2026", level: "الصف الرابع الابتدائي" },
    { id: "EGC-002", name: "عمر عبد الله", email: "omar.cur@example.com", age: 12, joinDate: "20 يناير 2026", level: "الصف الأول الإعدادي" },
    { id: "EGC-003", name: "فاطمة علي", email: "fatma.cur@example.com", age: 9, joinDate: "01 فبراير 2026", level: "الصف الثالث الابتدائي" },
];

function ProgressModal({ student, onClose, onSave }) {
    const [activeTab, setActiveTab] = useState("progress"); // "progress" or "sessions"
    const [progress, setProgress] = useState({
        attendance: "95",
        rating: "8.5",
        hours: "20",
        nextLesson: "السبت القادم 4م",
        reading: "80",
        writing: "70",
        listening: "90",
        conversation: "85",
        achievements: "",
        notes: ""
    });

    const [upcomingSessions, setUpcomingSessions] = useState([
        { course: "المناهج الدراسية - رياضيات", date: "السبت 7 مارس", time: "6:00 م", duration: "60 دقيقة", meetLink: "https://meet.google.com/new" }
    ]);

    const [newSession, setNewSession] = useState({
        course: "المناهج الدراسية - رياضيات",
        date: "",
        time: "",
        duration: "60 دقيقة",
        meetLink: "https://meet.google.com/new"
    });

    useEffect(() => {
        const savedProgress = localStorage.getItem(`progress_${student.email}`);
        if (savedProgress) {
            setProgress(JSON.parse(savedProgress));
        }
        const savedSessions =
            localStorage.getItem(`sessions_${student.email}`) ||
            localStorage.getItem(`upcoming_sessions_${student.email}`);
        if (savedSessions) {
            setUpcomingSessions(JSON.parse(savedSessions));
        }
    }, [student.email]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(student.email, progress, upcomingSessions);
    };

    const addSession = () => {
        if (!newSession.date || !newSession.time) return;
        setUpcomingSessions([...upcomingSessions, newSession]);
        setNewSession({ ...newSession, date: "", time: "" });
    };

    const removeSession = (index) => {
        setUpcomingSessions(upcomingSessions.filter((_, i) => i !== index));
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-2xl overflow-hidden rounded-[2.5rem] bg-white shadow-2xl animate-in fade-in zoom-in duration-300">
                <div className="bg-emerald-600 px-8 py-4 text-white">
                    <div className="flex items-center justify-between">
                        <div className="text-right">
                            <h2 className="text-xl font-black">إدارة بيانات الطالب</h2>
                            <p className="text-xs text-emerald-100 font-medium">{student.name}</p>
                        </div>
                        <button onClick={onClose} className="rounded-full bg-white/20 p-2 hover:bg-white/30 transition-colors">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                </div>

                <div className="flex border-b border-emerald-100 bg-emerald-50/30">
                    <button 
                        onClick={() => setActiveTab("progress")}
                        className={`flex-1 py-3 text-sm font-bold transition-all ${activeTab === "progress" ? "bg-white text-emerald-700 border-b-2 border-emerald-600" : "text-slate-500 hover:text-emerald-600"}`}
                    >
                        تحديث التقدم
                    </button>
                    <button 
                        onClick={() => setActiveTab("sessions")}
                        className={`flex-1 py-3 text-sm font-bold transition-all ${activeTab === "sessions" ? "bg-white text-emerald-700 border-b-2 border-emerald-600" : "text-slate-500 hover:text-emerald-600"}`}
                    >
                        جدولة الحصص
                    </button>
                </div>
                
                <div className="max-h-[70vh] overflow-y-auto p-8">
                    {activeTab === "progress" ? (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h3 className="font-bold text-emerald-800 border-b border-emerald-100 pb-2">الإحصائيات</h3>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1">الحضور (%)</label>
                                        <input type="number" value={progress.attendance} onChange={(e) => setProgress({...progress, attendance: e.target.value})} className="w-full rounded-xl border border-emerald-100 bg-emerald-50/30 px-4 py-2 text-sm outline-none focus:border-emerald-500" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1">التقييم (10/)</label>
                                        <input type="text" value={progress.rating} onChange={(e) => setProgress({...progress, rating: e.target.value})} className="w-full rounded-xl border border-emerald-100 bg-emerald-50/30 px-4 py-2 text-sm outline-none focus:border-emerald-500" />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="font-bold text-emerald-800 border-b border-emerald-100 pb-2">المهارات (%)</h3>
                                    {['reading', 'writing'].map((skill) => (
                                        <div key={skill} className="flex items-center gap-3">
                                            <label className="w-16 text-xs font-bold text-slate-500">{skill === 'reading' ? 'قراءة' : 'كتابة'}</label>
                                            <input type="range" min="0" max="100" value={progress[skill]} onChange={(e) => setProgress({...progress, [skill]: e.target.value})} className="flex-1 h-1.5 bg-emerald-100 rounded-lg appearance-none cursor-pointer accent-emerald-600" />
                                            <span className="w-8 text-[10px] font-bold text-emerald-600">{progress[skill]}%</span>
                                        </div>
                                    ))}
                                    {['listening', 'conversation'].map((skill) => (
                                        <div key={skill} className="flex items-center gap-3">
                                            <label className="w-16 text-xs font-bold text-slate-500">{skill === 'listening' ? 'استماع' : 'محادثة'}</label>
                                            <input type="range" min="0" max="100" value={progress[skill]} onChange={(e) => setProgress({...progress, [skill]: e.target.value})} className="flex-1 h-1.5 bg-emerald-100 rounded-lg appearance-none cursor-pointer accent-emerald-600" />
                                            <span className="w-8 text-[10px] font-bold text-emerald-600">{progress[skill]}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h3 className="font-bold text-emerald-800 border-b border-emerald-100 pb-2">ملاحظات</h3>
                                <textarea 
                                    value={progress.notes} 
                                    onChange={(e) => setProgress({...progress, notes: e.target.value})}
                                    placeholder="اكتب ملاحظات المعلم هنا..."
                                    rows="3"
                                    className="w-full rounded-xl border border-emerald-100 bg-emerald-50/30 px-4 py-2 text-sm outline-none focus:border-emerald-500 resize-none"
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/20 p-4">
                                <h3 className="text-sm font-bold text-emerald-800 mb-4">إضافة حصة جديدة</h3>
                                <div className="grid grid-cols-2 gap-3 mb-3">
                                    <input type="text" placeholder="التاريخ (مثلاً: السبت 7 مارس)" value={newSession.date} onChange={(e) => setNewSession({...newSession, date: e.target.value})} className="rounded-xl border border-emerald-100 bg-white px-3 py-2 text-xs outline-none focus:border-emerald-500" />
                                    <input type="text" placeholder="الوقت (مثلاً: 6:00 م)" value={newSession.time} onChange={(e) => setNewSession({...newSession, time: e.target.value})} className="rounded-xl border border-emerald-100 bg-white px-3 py-2 text-xs outline-none focus:border-emerald-500" />
                                </div>
                                <button type="button" onClick={addSession} className="w-full rounded-xl bg-emerald-600 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition-colors">إضافة للجدول</button>
                            </div>

                            <div className="space-y-3">
                                <h3 className="text-sm font-bold text-emerald-800">الحصص المجدولة</h3>
                                {upcomingSessions.length > 0 ? upcomingSessions.map((session, idx) => (
                                    <div key={idx} className="flex items-center justify-between rounded-xl border border-emerald-100 bg-white p-3 text-xs shadow-sm">
                                        <div>
                                            <p className="font-bold text-emerald-950">{session.course}</p>
                                            <p className="text-slate-500">{session.date} | {session.time}</p>
                                        </div>
                                        <button onClick={() => removeSession(idx)} className="text-red-400 hover:text-red-600 p-1">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </div>
                                )) : (
                                    <p className="text-center py-4 text-xs text-slate-400 italic">لا توجد حصص مجدولة لهذا الطالب</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="border-t border-emerald-100 p-6 bg-emerald-50/10">
                    <div className="flex gap-3">
                        <button onClick={handleSubmit} className="flex-1 rounded-xl bg-emerald-600 py-3 font-bold text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-500">حفظ الكل</button>
                        <button onClick={onClose} className="flex-1 rounded-xl bg-slate-100 py-3 font-bold text-slate-600 transition-all hover:bg-slate-200">إلغاء</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function FooterSection({ currentYear }) {
    return (
        <footer id="contact" className="relative overflow-hidden bg-[#041722] text-emerald-50">
            <div className="site-container py-12">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    <div>
                        <h3 className="mb-3 text-2xl font-bold">مشاعل المعرفة</h3>
                        <p className="max-w-xl text-sm leading-relaxed text-emerald-100/85">
                            بيئة تربوية متكاملة تزرع العلم والإيمان معًا، وتجمع بين تعليم القرآن واللغة العربية والمناهج الدراسية.
                        </p>
                    </div>
                    <div className="md:text-left">
                        <h4 className="mb-3 text-lg font-bold">تواصل معنا</h4>
                        <p className="text-sm text-emerald-100/85">البريد الإلكتروني: info@mashael-almaarifa.com</p>
                        <p className="mt-2 text-sm text-emerald-100/85" dir="ltr">
                            WhatsApp: +20 121 021 2176
                        </p>
                    </div>
                </div>
                <div className="mt-10 border-t border-emerald-200/15 pt-6 text-center text-sm text-emerald-100/70">
                    © {currentYear || "2026"} مشاعل المعرفة. جميع الحقوق محفوظة.
                </div>
            </div>
        </footer>
    );
}

export default function CurriculaStudentsListPage() {
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [currentYear, setCurrentYear] = useState(null);

    useEffect(() => {
        const fetchStudents = async () => {
            const { getLocalUsers } = require("@/utils/local-db");
            const allUsers = await getLocalUsers();
            // Filter students for "المناهج الدراسية"
            const filtered = allUsers.filter(u => u.role === "student" && u.course === "المناهج الدراسية");
            setStudents(filtered);
            setCurrentYear(new Date().getFullYear());
        };
        
        fetchStudents();
    }, []);

    const handleSave = (studentEmail, progress, sessions) => {
        localStorage.setItem(`progress_${studentEmail}`, JSON.stringify(progress));
        localStorage.setItem(`sessions_${studentEmail}`, JSON.stringify(sessions));
        alert("تم حفظ البيانات والجدول بنجاح!");
        setSelectedStudent(null);
    };

    return (
        <main dir="rtl" className="relative flex min-h-[100dvh] flex-col overflow-x-clip text-emerald-950 font-sans">
            <div className="fixed inset-0 z-[-1] bg-gradient-to-b from-[#f8fbfb] via-[#f2f8f8] to-[#eef5f5]">
                <div className="absolute top-0 right-0 h-[500px] w-[500px] -translate-x-1/4 -translate-y-1/4 rounded-full bg-emerald-100/60 blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 h-[600px] w-[600px] translate-x-1/3 translate-y-1/4 rounded-full bg-emerald-50/80 blur-3xl pointer-events-none" />
            </div>

            <TeacherNavbar
                sectionTitle="المناهج الدراسية"
                links={NAV_LINKS}
                ctaLabel="العودة إلى الصفحة الرئيسة"
                ctaHref="/teacher/dashboard"
                showCtaWithSession={true}
            />

            <section className="relative z-10 flex flex-1 flex-col justify-center px-4 pt-28 pb-16 sm:px-6 sm:pt-32 sm:pb-24">
                <div className="mx-auto w-full max-w-5xl">
                    <header className="mb-10 text-center">
                        <span className="mb-4 inline-block rounded-full bg-emerald-100 px-5 py-2 text-sm font-bold text-emerald-700 shadow-sm border border-emerald-200/50">بوابة المعلمين - المناهج الدراسية</span>
                        <h1 className="mb-4 text-3xl font-black text-emerald-950 sm:text-4xl text-balance">الطلبة المسجلين بالقسم</h1>
                        <p className="mx-auto max-w-xl text-base text-slate-600 sm:text-lg text-balance">إدارة وتحديث تقدم الطلاب المسجلين لديك في قسم المناهج الدراسية.</p>
                    </header>

                    <div className="modern-card overflow-hidden rounded-[2rem] border border-white/60 bg-white/60 shadow-2xl shadow-emerald-900/5">
                        <div className="overflow-x-auto">
                            <table className="w-full text-right text-sm text-slate-600">
                                <thead className="bg-emerald-50/80 text-emerald-900 border-b border-emerald-200/60">
                                    <tr>
                                        <th className="px-6 py-4 font-bold">#</th>
                                        <th className="px-6 py-4 font-bold">اسم الطالب</th>
                                        <th className="px-6 py-4 font-bold text-center">العمر</th>
                                        <th className="px-6 py-4 font-bold">الصف الدراسي</th>
                                        <th className="px-6 py-4 font-bold text-center">الإجراءات</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-emerald-100/60">
                                    {students.map((student, idx) => (
                                        <tr key={student.id} className="transition-colors hover:bg-emerald-50/40">
                                            <td className="px-6 py-4 font-medium text-slate-500">{idx + 1}</td>
                                            <td className="px-6 py-4 font-bold text-emerald-950">{student.name}</td>
                                            <td className="px-6 py-4 text-center">{student.age} سنة</td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center rounded-md bg-emerald-100/40 px-2 py-1 text-xs font-medium text-emerald-700">{student.level}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center gap-3">
                                                    <button 
                                                        onClick={() => setSelectedStudent(student)}
                                                        className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white transition-all hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-600/20"
                                                    >
                                                        تحديث التقدم / الجدولة
                                                    </button>
                                                    <Link
                                                        href="/egypt-gulf-curricula"
                                                        className="font-bold text-xs text-emerald-700 hover:text-emerald-900 transition-colors"
                                                    >
                                                        تسجيل حضور
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {students.length === 0 && (
                                <div className="p-8 text-center text-slate-500">
                                    لا يوجد طلاب مسجلين حالياً
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {selectedStudent && (
                <ProgressModal 
                    student={selectedStudent} 
                    onClose={() => setSelectedStudent(null)} 
                    onSave={handleSave} 
                />
            )}

            <div className="mt-auto w-full relative z-20">
                <FooterSection currentYear={currentYear} />
            </div>
        </main>
    );
}
