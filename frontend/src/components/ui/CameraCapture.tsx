import React, { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import { Camera, RefreshCw, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface CameraCaptureProps {
  onCapture: (file: File) => void;
  capturedPreview: string | null;
  onReset: () => void;
  className?: string;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({
  onCapture,
  capturedPreview,
  onReset,
  className = "",
}) => {
  const webcamRef = useRef<Webcam>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const capturePhoto = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      fetch(imageSrc)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], `wfh-capture-${Date.now()}.jpg`, {
            type: "image/jpeg",
          });
          onCapture(file);
        });
    }
  }, [webcamRef, onCapture]);

  const videoConstraints = {
    facingMode: "user",
  };

  return (
    <div className={`w-full h-full flex flex-col flex-1 ${className}`}>
      {capturedPreview ? (
        <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-900 aspect-3/4 sm:aspect-4/3 lg:aspect-auto w-full h-full min-h-90 flex items-center justify-center flex-1">
          <img
            src={capturedPreview}
            alt="WFH Attendance Proof"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute top-3 right-3 bg-emerald-600/90 text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1 shadow-xs z-10">
            <Check className="w-3.5 h-3.5" /> Photo Captured
          </div>
          <div className="absolute bottom-4 left-0 right-0 flex justify-center z-10">
            <Button
              type="button"
              variant="secondary"
              onClick={onReset}
              title="Retake Photo"
              aria-label="Retake Photo"
              className="h-11 w-11 sm:h-auto sm:w-auto p-0 sm:px-4 sm:py-2 rounded-full sm:rounded-lg shadow-md"
              icon={<RefreshCw className="w-5 h-5 sm:w-4 sm:h-4" />}
            >
              <span className="hidden sm:inline">Retake Photo</span>
            </Button>
          </div>
        </div>
      ) : cameraError ? (
        <div className="p-6 border-2 border-dashed border-rose-200 rounded-xl bg-rose-50/50 text-center flex flex-col items-center justify-center flex-1 min-h-90">
          <AlertCircle className="w-8 h-8 mx-auto text-rose-500 mb-2" />
          <p className="text-sm font-medium text-slate-800 mb-1">
            Camera Unavailable
          </p>
          <p className="text-xs text-slate-500 mb-4 max-w-sm mx-auto">
            {cameraError}
          </p>
          <div className="flex justify-center">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCameraError(null)}
              icon={<RefreshCw className="w-4 h-4" />}
            >
              Retry Camera
            </Button>
          </div>
        </div>
      ) : (
        <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-900 aspect-3/4 sm:aspect-4/3 lg:aspect-auto w-full h-full min-h-90 flex-1">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            onUserMediaError={() => {
              setCameraError(
                "Camera access was denied or the device is not supported. Please allow camera permissions in your browser.",
              );
            }}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center pb-16 sm:pb-8">
            <div className="w-36 h-48 sm:w-44 sm:h-56 border-2 border-dashed border-white/50 rounded-[45%]" />
          </div>

          <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center px-4 z-10">
            <Button
              type="button"
              variant="primary"
              onClick={capturePhoto}
              title="Take Photo"
              aria-label="Take Photo"
              className="h-11 w-11 sm:h-auto sm:w-auto p-0 sm:px-4 sm:py-2 rounded-full sm:rounded-lg shadow-md"
              icon={<Camera className="w-5 h-5 sm:w-4 sm:h-4" />}
            >
              <span className="hidden sm:inline">Take Photo</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
