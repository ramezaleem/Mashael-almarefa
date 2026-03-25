import Link from "next/link";

export default function Footer() {
    return (
        <footer id="contact" className="relative overflow-hidden bg-[#041722] text-emerald-50">
            <div className="site-container py-12">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    <div>
                        <h3 className="mb-3 text-2xl font-bold">مشاعل المعرفة</h3>
                        <p className="max-w-xl text-sm leading-relaxed text-emerald-100/85 text-balance">
                            بيئة تربوية متكاملة تزرع العلم والإيمان معًا، وتجمع بين تعليم القرآن واللغة العربية والمناهج الدراسية.
                        </p>
                    </div>
                    <div className="md:items-end flex flex-col items-center md:text-right">
                        <h4 className="mb-6 text-xl font-bold text-white">تواصل معنا</h4>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-emerald-100/85 md:flex-row-reverse">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div className="flex flex-col md:items-end">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500/70">البريد الإلكتروني</span>
                                    <span className="text-sm">info@mashael-almaarifa.com</span>
                                </div>
                            </div>

                            <a 
                                href="https://wa.me/201210212176" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 text-emerald-100/85 hover:text-white transition-all group md:flex-row-reverse"
                            >
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 ring-1 ring-emerald-500/20 group-hover:bg-emerald-500/20 group-hover:ring-emerald-500/40 transition-all shadow-sm">
                                    <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 448 512">
                                        <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-5.5-2.8-23.2-8.5-44.2-27.3-16.3-14.5-27.4-32.5-30.6-37.9-3.2-5.6-.4-8.6 2.4-11.3 2.5-2.5 5.5-6.5 8.3-9.7 2.8-3.3 3.7-5.5 5.5-9.3.5-3.6-.4-6.5-1.4-8.4-1-1.8-8.8-21.3-12-29-3.1-7.5-6.2-6.5-8.5-6.6-2.1-.1-4.6-.1-7-.1-2.4 0-6.2.9-9.5 4.4-3.2 3.5-12.5 12.2-12.5 29.7 0 17.5 12.7 34.4 14.5 36.6 1.8 2.2 25.1 38.2 60.8 53.6 8.5 3.7 15.1 5.9 20.3 7.5 8.6 2.7 16.4 2.3 22.5 1.4 6.8-.9 20.9-8.5 23.9-16.7 2.9-8.3 2.9-15.4 2.1-16.7-1-1.3-3.1-2.1-8.6-4.9z"/>
                                    </svg>
                                </div>
                                <div className="flex flex-col md:items-end">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">WhatsApp</span>
                                    <span dir="ltr" className="text-sm font-bold">+20 121 021 2176</span>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="mt-10 border-t border-emerald-200/15 pt-6 text-center text-sm text-emerald-100/70">
                    © {new Date().getFullYear()} مشاعل المعرفة. جميع الحقوق محفوظة.
                </div>
            </div>
        </footer>
    );
}
