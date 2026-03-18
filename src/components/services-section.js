"use client";

import { useRef, useState, useEffect } from "react";

function BookIcon({ className = "w-6 h-6" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
  );
}

const platformSections = [
  {
    id: "quran-and-sciences",
    title: "ركن القرآن الكريم وعلومه",
    items: [
      "تحفيظ تفاعلي بالصوت والصورة",
      "تقسيم حسب العمر والمستوى",
      "اختبارات حفظ أسبوعية",
      "تسميع مباشر مع شيخ عبر جوجل ميت",
      "مسار الإجازة",
    ],
  },
  {
    id: "arabic-non-native",
    title: "اللغة العربية لغير الناطقين بها",
    items: [
      "تأسيس الحروف والنطق الصحيح",
      "مهارات الاستماع والتحدث والقراءة والكتابة",
      "مستويات متدرجة من المبتدئ إلى المتقدم",
      "محادثة تفاعلية مع معلمين متخصصين",
      "إعداد لاختبارات الكفاءة اللغوية",
    ],
  },
  {
    id: "egypt-gulf-curricula",
    title: "المناهج الدراسية (مصر + الخليج)",
    items: [
      "لغة عربية",
      "اللغات الأجنبية: (الإنجليزية، الفرنسية، الألمانية)",
      "الرياضيات (منهج: عربي - إنجليزي)",
      "العلوم: الفيزياء والكيمياء والأحياء (منهج: عربي – إنجليزي)",
      "الدراسات اجتماعية: تاريخ وجغرافيا.",
      "تربية إسلامية.",
    ],
  },
  {
    id: "courses-center",
    title: "الدورات:",
    items: [
      "النحو: تأسيس وتوظيف",
      "الصرف",
      "العَروض",
      "البلاغة",
      "إعداد معلم اللغة العربية للناطقين بغيرها",
      "التطبيق اللغوي",
      "دورة البحث العلمي ومناهجه",
      "الكتابة الأكاديمية",
    ],
  },
];

export default function ServicesSection() {
  const scrollContainerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -400, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 400, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        // Find which item is most visible
        const container = scrollContainerRef.current;
        const scrollPosition = Math.abs(container.scrollLeft);
        const itemWidth = container.children[0].offsetWidth + 24; // width + gap
        const newIndex = Math.round(scrollPosition / itemWidth);
        if (newIndex !== activeIndex && newIndex >= 0 && newIndex < platformSections.length) {
          setActiveIndex(newIndex);
        }
      }
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [activeIndex]);

  return (
    <section id="platform-sections" className="section-spacing relative overflow-hidden bg-gradient-to-b from-[#0c3447] via-[#0a2c3d] to-[#082433]">
      <div className="hero-mesh" />
      <div className="site-container relative z-10 w-full max-w-[1400px] mx-auto">
        <div className="mb-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <h2 className="text-3xl font-black text-white sm:text-4xl" style={{ lineHeight: 1.4 }}>
            أقسام المنصة الرئيسة
          </h2>

          {/* نلغي النصوص ونضع أزرار حديثة للتنقل (Arrows) على يسار العنوان */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={scrollRight}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-900/40 text-emerald-300 transition-all hover:-translate-y-0.5 hover:bg-emerald-500/20 active:scale-95"
              aria-label="التالي"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <button
              onClick={scrollLeft}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-900/40 text-emerald-300 transition-all hover:-translate-y-0.5 hover:bg-emerald-500/20 active:scale-95"
              aria-label="السابق"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>
        </div>

        <div className="relative w-full">
          {/* ظلال متلاشية على الأطراف لتعطي إيحاء بأن هناك بطاقات مخفية (Fade edges) */}
          <div className="absolute top-0 right-[-10px] bottom-0 w-12 bg-gradient-to-l from-[#0a2c3d] to-transparent z-10 pointer-events-none md:w-20"></div>
          <div className="absolute top-0 left-[-10px] bottom-0 w-12 bg-gradient-to-r from-[#0a2c3d] to-transparent z-10 pointer-events-none md:w-20"></div>

          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory hide-scrollbar"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {platformSections.map((section) => (
              <article
                id={section.id}
                key={section.id}
                className="min-w-[85vw] sm:min-w-[400px] flex-none snap-center glass card-hover rounded-3xl p-7 shadow-xl shadow-emerald-900/30 transition-transform duration-300 hover:scale-[1.02]"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-400/15 text-emerald-100 shadow-inner">
                  <BookIcon className="h-7 w-7" />
                </div>
                <h3 className="mb-4 text-xl font-bold leading-relaxed text-white">{section.title}</h3>
                {section.intro ? <p className="mb-3 text-emerald-100/95">{section.intro}</p> : null}
                {section.items.length ? (
                  <ul className="space-y-3 text-emerald-100/90">
                    {section.items.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                        <span className="text-sm sm:text-base leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </article>
            ))}
          </div>
        </div>

        {/* نقاط مؤشر التقدم السفلية (Pagination Dots) تظهر في الهواتف كدليل */}
        <div className="mt-4 flex justify-center gap-2 sm:hidden">
          {platformSections.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === activeIndex ? "w-8 bg-emerald-400" : "w-2 bg-emerald-900"
              }`}
            ></div>
          ))}
        </div>
      </div>
    </section>
  );
}
