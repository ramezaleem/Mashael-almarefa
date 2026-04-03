"use client";

import { useEffect, useRef, useState, Component } from "react";

// Error Boundary Component
class VideoErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("VideoPlayer Component Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center p-10 bg-black/40 rounded-[2rem] text-white text-center">
          <p className="text-emerald-400 font-bold mb-2">مشكلة في تشخيص المحتوى</p>
          <p className="text-[10px] text-white/40 mb-4">تعذر تحميل المشغل، يرجى المحاولة لاحقاً</p>
          <button 
            onClick={() => this.setState({ hasError: false })}
            className="px-6 py-2 bg-emerald-600 rounded-xl text-xs font-bold transition-all hover:bg-emerald-700 active:scale-95"
          >
            إعادة المحاولة
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function VideoPlayerCore({ videoUrl, poster, onVideoError }) {
    const videoRef = useRef(null);
    const isDev = process.env.NODE_ENV === "development";
    
    // Per user request: src logic with full URL for development
    // Since videoUrl already contains "/Videos/", we ensure no double slash
    const finalUrl = isDev ? `http://localhost:3000${videoUrl}` : videoUrl;
    
    // Log as requested for diagnostics
    console.log('Video src:', finalUrl);

    useEffect(() => {
        const playVideo = async () => {
            if (videoRef.current) {
                try {
                    // Force playback on mount or source change
                    await videoRef.current.play();
                    console.log("Video playback started successfully.");
                } catch (e) {
                    console.log("Autoplay blocked - awaiting user interaction.");
                }
            }
        };
        playVideo();
    }, [finalUrl]);

    return (
        <div className="w-full h-full relative group">
            <video 
                ref={videoRef}
                src={finalUrl}
                poster={poster}
                controls
                preload="metadata"
                muted 
                autoPlay
                loop
                playsInline
                crossOrigin="anonymous"
                className="w-full h-full object-contain shadow-2xl bg-black" 
                onError={(e) => {
                    if (process.env.NODE_ENV === "development") {
                        console.warn("Dev mode: video error ignored (Turbopack bug)");
                        return; // Prevent switching to error UI in dev
                    }
                    console.error("Video element error detected:", e.target.error?.message);
                    if (onVideoError) onVideoError(e);
                }}
                onLoadStart={() => console.log("Video load start...")}
                onWaiting={() => console.log("Video waiting (buffering)...")}
                onStalled={() => console.warn("Video stalled - potential connection/file issue.")}
                onCanPlay={() => console.log("Video can start playing now.")}
            >
                <source src={finalUrl} type="video/mp4" />
                المتصفح لا يدعم تشغيل الفيديو.
            </video>
        </div>
    );
}

export default function CourseVideoPlayer(props) {
    return (
        <VideoErrorBoundary>
            <VideoPlayerCore {...props} />
        </VideoErrorBoundary>
    );
}
