"use client";

import { useEffect, useRef, useState } from "react";
import Button from "@/components/ui/button";

export default function CameraScanDrug() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [error, setError] = useState("");

  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch {
        setError("لا يمكن فتح الكاميرا. يرجى السماح بالأذونات.");
      }
    }

    startCamera();
  }, []);

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = canvas.toDataURL("image/jpeg");

    sessionStorage.setItem("guest_drug_image", imageData);

    window.location.href = "/guest/scan-drug/result";
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 flex flex-col items-center">

      <h1 className="text-lg font-semibold mb-4">مسح علبة الدواء</h1>

      {error && <p className="text-red-400 mb-3">{error}</p>}

      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full max-w-md rounded-xl border border-slate-700"
      />

      <canvas ref={canvasRef} className="hidden" />

      <Button className="mt-6 w-full max-w-md py-3" onClick={capturePhoto}>
        التقاط الصورة
      </Button>
    </div>
  );
}
