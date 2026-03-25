"use client";

import { useState, useEffect } from "react";
import AdminNavbar from "../admin/admin-navbar";
import Swal from "sweetalert2";

export default function CoursesCenterPage() {
    const [courses, setCourses] = useState([]);
    const [videos, setVideos] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [formData, setFormData] = useState({
        title: "",
        category: "",
        videoFile: null,
        thumbnailFile: null,
        notes: ""
    });

    useEffect(() => {
        const savedCourses = JSON.parse(localStorage.getItem("platform_courses") || "[]");
        setCourses(savedCourses);
        const savedVideos = JSON.parse(localStorage.getItem("platform_videos") || "[]");
        setVideos(savedVideos);
    }, []);

    const handleFileChange = (e) => {
        const field = e.target.name;
        const file = e.target.files[0];
        
        if (file && field === 'videoFile' && file.size > 100 * 1024 * 1024) {
            Swal.fire("خطأ", "حجم الفيديو يتجاوز 100 ميجابايت", "error");
            e.target.value = "";
            return;
        }

        setFormData(prev => ({ ...prev, [field]: file }));
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!formData.videoFile || !formData.title) {
            Swal.fire("تنبيه", "يرجى اختيار مادة تعليمية وفيديو للرفع", "warning");
            return;
        }

        setIsUploading(true);
        setUploadProgress(0);

        try {
            // Using XMLHttpRequest for progress tracking
            const xhr = new XMLHttpRequest();
            const data = new FormData();
            data.append("file", formData.videoFile);

            xhr.upload.addEventListener("progress", (event) => {
                if (event.lengthComputable) {
                    const percent = Math.round((event.loaded / event.total) * 100);
                    setUploadProgress(percent);
                }
            });

            const uploadPromise = new Promise((resolve, reject) => {
                xhr.onreadystatechange = () => {
                    if (xhr.readyState === 4) {
                        if (xhr.status >= 200 && xhr.status < 300) {
                            resolve(JSON.parse(xhr.responseText));
                        } else {
                            reject(new Error("Upload failed"));
                        }
                    }
                };
                xhr.open("POST", "/api/upload");
                xhr.send(data);
            });

            const result = await uploadPromise;

            // Handle metadata save (Simulating Postgres insert / Server Action)
            const newVideo = {
                id: Date.now(),
                title: formData.title,
                category: formData.category,
                videoUrl: result.url,
                thumbnailUrl: "/Logo.jpeg", // Placeholder
                notes: formData.notes,
                date: new Date().toLocaleDateString("ar-EG")
            };

            const updatedVideos = [newVideo, ...videos];
            setVideos(updatedVideos);
            localStorage.setItem("platform_videos", JSON.stringify(updatedVideos));

            // Sync courses if new
            if (!courses.includes(formData.title)) {
                const updatedCourses = [...courses, formData.title];
                setCourses(updatedCourses);
                localStorage.setItem("platform_courses", JSON.stringify(updatedCourses));
            }

            Swal.fire("تم بنجاح", "تم رفع الفيديو وحفظ البيانات بنجاح", "success");
            setFormData({ title: "", category: "", videoFile: null, thumbnailFile: null, notes: "" });
            e.target.reset();

        } catch (error) {
            console.error(error);
            Swal.fire("خطأ", "فشل عملية الرفع، يرجى المحاولة لاحقاً", "error");
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    return (
        <main className="min-h-screen bg-[#f8fbfb] pb-20" dir="rtl">
            <AdminNavbar />
            
            <div className="site-container pt-10">
                <header className="mb-10 text-center">
                    <h1 className="text-3xl font-black text-emerald-950 sm:text-4xl">مركز رفع الدورات</h1>
                    <p className="mt-4 text-slate-600">إدارة محتوى الفيديو والمواد التعليمية للمنصة</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Add Content Form */}
                    <div className="lg:col-span-1">
                        <section className="modern-card sticky top-28 rounded-3xl border border-white bg-white/70 p-6 shadow-xl shadow-emerald-900/5">
                            <h2 className="mb-6 text-xl font-bold text-emerald-900 border-b border-emerald-50 pb-3">إضافة فيديو جديد</h2>
                            <form onSubmit={handleUpload} className="space-y-5 text-right">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">اسم المادة / الدورة</label>
                                    <input 
                                        type="text" 
                                        list="courses-list"
                                        name="title"
                                        value={formData.title}
                                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                                        className="w-full rounded-xl border border-emerald-100 bg-white px-4 py-3 outline-none focus:border-emerald-500"
                                        placeholder="مثلاً: نور البيان"
                                        required
                                    />
                                    <datalist id="courses-list">
                                        {courses.map(c => <option key={c} value={c} />)}
                                    </datalist>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">التصنيف</label>
                                    <select 
                                        value={formData.category}
                                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                                        className="w-full rounded-xl border border-emerald-100 bg-white px-4 py-3 outline-none focus:border-emerald-500"
                                    >
                                        <option value="">-- اختر التصنيف --</option>
                                        <option value="قرآن كريم">قرآن كريم</option>
                                        <option value="لغة عربية">لغة عربية</option>
                                        <option value="مناهج مصرية">مناهج مصرية</option>
                                        <option value="مناهج خليجية">مناهج خليجية</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">فيديو الدرس (MP4, Max 100MB)</label>
                                    <div className="relative">
                                        <input 
                                            type="file" 
                                            name="videoFile"
                                            accept="video/mp4"
                                            onChange={handleFileChange}
                                            required
                                            className="hidden" 
                                            id="video-upload"
                                        />
                                        <label 
                                            htmlFor="video-upload" 
                                            className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl border-2 border-dashed border-emerald-200 bg-emerald-50/30 px-4 py-8 transition-all hover:bg-emerald-50 hover:border-emerald-400"
                                        >
                                            <div className="text-center">
                                                <svg className="mx-auto h-8 w-8 text-emerald-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                </svg>
                                                <span className="text-sm font-bold text-emerald-700">
                                                    {formData.videoFile ? formData.videoFile.name : "اضغط لرفع فيديو الدرس"}
                                                </span>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                {isUploading && (
                                    <div className="mt-4">
                                        <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
                                            <div 
                                                className="h-full bg-emerald-500 transition-all duration-300"
                                                style={{ width: `${uploadProgress}%` }}
                                            />
                                        </div>
                                        <p className="mt-2 text-center text-xs font-bold text-emerald-600">جاري الرفع: {uploadProgress}%</p>
                                    </div>
                                )}

                                <button 
                                    type="submit"
                                    disabled={isUploading}
                                    className="w-full rounded-xl bg-emerald-600 py-3.5 font-bold text-white shadow-lg transition-all hover:bg-emerald-500 disabled:bg-slate-300"
                                >
                                    {isUploading ? "جاري المعالجة..." : "حفظ ورفع المحتوى"}
                                </button>
                            </form>
                        </section>
                    </div>

                    {/* Content List */}
                    <div className="lg:col-span-2">
                        <section className="modern-card rounded-3xl border border-white bg-white/70 p-6 shadow-xl shadow-emerald-900/5">
                            <h2 className="mb-6 text-xl font-bold text-emerald-900">المحتوى الأخير</h2>
                            <div className="space-y-4">
                                {videos.map(video => (
                                    <article key={video.id} className="flex gap-4 rounded-2xl border border-emerald-50 bg-white p-4 transition-all hover:shadow-md">
                                        <div className="h-24 w-40 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                                            <video src={video.videoUrl} className="h-full w-full object-cover" />
                                        </div>
                                        <div className="flex flex-1 flex-col justify-between">
                                            <div>
                                                <div className="flex items-center justify-between">
                                                   <h3 className="font-bold text-emerald-950">{video.title}</h3>
                                                   <span className="text-xs font-bold text-slate-400">{video.date}</span>
                                                </div>
                                                <span className="mt-1 inline-block rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600">{video.category}</span>
                                            </div>
                                            <div className="flex gap-2">
                                                <button className="text-xs font-bold text-emerald-600 hover:underline">تعديل</button>
                                                <button className="text-xs font-bold text-red-500 hover:underline">حذف</button>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                                {videos.length === 0 && (
                                    <div className="py-20 text-center text-slate-500">لا يوجد محتوى مرفوع حالياً</div>
                                )}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </main>
    );
}
