import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { AlertCircle, Camera } from "lucide-react";
import { CameraCapture } from "@/components/ui/CameraCapture";
import { sanitizeInput } from "@/utils/sanitize";
import { useSubmitAttendance } from "@/hooks/useAttendance";

interface AttendanceActionProps {
  mode?: "in" | "out";
}

export const AttendanceAction: React.FC<AttendanceActionProps> = ({ mode }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isCheckOut = mode
    ? mode === "out"
    : location.pathname.includes("check-out");

  const submitAttendance = useSubmitAttendance(isCheckOut ? "out" : "in");

  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleCapture = (file: File) => {
    setPhoto(file);
    setPreview(URL.createObjectURL(file));
    setError(null);
  };

  const handleReset = () => {
    setPhoto(null);
    setPreview(null);
  };

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNote(sanitizeInput(e.target.value));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!photo) {
      setError("Please capture or upload a WFH photo proof first.");
      return;
    }

    setError(null);

    try {
      const cleanNote = sanitizeInput(note).trim();
      await submitAttendance.mutateAsync({
        photo,
        note: cleanNote || undefined,
      });

      navigate("/employee/dashboard", { replace: true });
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      setError(
        axiosErr.response?.data?.message ||
          axiosErr.message ||
          "An error occurred while submitting attendance.",
      );
    }
  };

  const config = {
    title: isCheckOut ? "Check Out" : "Check In",
    subtitle: isCheckOut
      ? "Take a photo as proof of ending your work day and include your daily work summary."
      : "Take a photo as proof of working from home and include your daily work plan.",
    textareaLabel: isCheckOut
      ? "Daily Work Summary (Optional)"
      : "Daily Work Plan",
    placeholder: isCheckOut
      ? "e.g. Completed feature tasks, prepared PR for code review, and tested all components..."
      : "Outline your planned tasks for today, e.g. Developing attendance features, API integration, and preparing reports...",
    buttonText: isCheckOut ? "Submit Check Out" : "Submit Check In",
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">{config.title}</h1>
          <p className="text-xs text-slate-500">{config.subtitle}</p>
        </div>
      </div>

      <div className="w-full bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch"
        >
          {/* Left Column: Camera Capture */}
          <div className="lg:col-span-7 flex flex-col min-h-95 lg:min-h-110">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              WFH Photo Proof <span className="text-rose-500">*</span>
            </label>
            <div className="flex-1 flex flex-col">
              <CameraCapture
                onCapture={handleCapture}
                capturedPreview={preview}
                onReset={handleReset}
              />
            </div>
          </div>

          {/* Right Column: Daily Work Note (Textarea) & Submit Button */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-5 lg:bg-zinc-50/60 lg:p-6 lg:rounded-xl lg:border lg:border-zinc-100">
            <div className="flex-1 flex flex-col space-y-2">
              <Textarea
                label={config.textareaLabel}
                placeholder={config.placeholder}
                value={note}
                onChange={handleNoteChange}
                rows={8}
                className="flex-1 min-h-50 resize-none"
              />
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                className="w-full"
                disabled={!photo || submitAttendance.isPending}
                isLoading={submitAttendance.isPending}
                icon={<Camera className="w-4 h-4" />}
              >
                {config.buttonText}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
