import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { AlertCircle, Camera } from "lucide-react";
import { CameraCapture } from "@/components/ui/CameraCapture";

export const EmployeeCheckIn = () => {
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Submitting check-in with note:", note);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Check In</h1>
          <p className="text-xs text-slate-500">
            Take a photo as proof of working from home and include your daily
            work plan.
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              WFH Photo Proof <span className="text-rose-500">*</span>
            </label>
            <CameraCapture
              onCapture={handleCapture}
              capturedPreview={preview}
              onReset={handleReset}
            />
          </div>

          <Input
            label="Notes (Optional)"
            placeholder="e.g. Working on attendance features & API integration..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={!photo}
              isLoading={false}
              icon={<Camera className="w-4 h-4" />}
            >
              Submit Check In
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
