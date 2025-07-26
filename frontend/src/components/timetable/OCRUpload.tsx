import { useState, useRef } from "react";
import type { ChangeEvent } from "react";
import { Upload, X, FileText, Check } from "lucide-react";
import { ocrApi } from "../../api/ocr";
import type {
  OCRProcessingStatus,
  ExtractedTimetableData,
} from "../../types/ocr";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { ErrorMessage } from "../common/ErrorMessage";

interface OCRUploadProps {
  onExtracted: (data: ExtractedTimetableData[]) => void;
  onClose: () => void;
}

export const OCRUpload = ({ onExtracted, onClose }: OCRUploadProps) => {
  const [status, setStatus] = useState<OCRProcessingStatus>({ status: "idle" });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setStatus({ status: "uploading", progress: 0 });

      const results = await ocrApi.extractTimetable(file, (progress) => {
        setStatus((prev) => ({
          ...prev,
          progress,
        }));
      });

      setStatus({
        status: "success",
        result: results,
      });

      onExtracted(results);
    } catch (err) {
      setStatus({
        status: "error",
        error: err instanceof Error ? err.message : "Failed to process image",
      });
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    try {
      setStatus({ status: "uploading", progress: 0 });

      const results = await ocrApi.extractTimetable(file, (progress) => {
        setStatus((prev) => ({
          ...prev,
          progress,
        }));
      });

      setStatus({
        status: "success",
        result: results,
      });

      onExtracted(results);
    } catch (err) {
      setStatus({
        status: "error",
        error: err instanceof Error ? err.message : "Failed to process image",
      });
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

        <div className="relative bg-white rounded-lg w-full max-w-md">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-medium text-gray-900">
              Upload Timetable Image
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 space-y-4">
            {status.error && <ErrorMessage message={status.error} />}

            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center ${
                status.status === "uploading" || status.status === "processing"
                  ? "border-indigo-300 bg-indigo-50"
                  : status.status === "success"
                  ? "border-green-300 bg-green-50"
                  : status.status === "error"
                  ? "border-red-300 bg-red-50"
                  : "border-gray-300 hover:border-indigo-400"
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              {status.status === "idle" && (
                <>
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      Upload a file
                    </button>{" "}
                    or drag and drop
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    PNG, JPG up to 10MB
                  </p>
                </>
              )}

              {(status.status === "uploading" ||
                status.status === "processing") && (
                <div className="space-y-4">
                  <LoadingSpinner size="lg" />
                  <div className="text-sm text-gray-600">
                    {status.status === "uploading"
                      ? "Uploading image..."
                      : "Processing image..."}
                  </div>
                  {status.progress !== undefined && (
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-indigo-600 h-2.5 rounded-full"
                        style={{ width: `${status.progress}%` }}
                      />
                    </div>
                  )}
                </div>
              )}

              {status.status === "success" && (
                <div className="space-y-4">
                  <Check className="mx-auto h-12 w-12 text-green-500" />
                  <div className="text-sm text-gray-600">
                    Successfully processed image
                  </div>
                </div>
              )}

              {status.status === "error" && (
                <div className="space-y-4">
                  <FileText className="mx-auto h-12 w-12 text-red-500" />
                  <div className="text-sm text-red-600">
                    Failed to process image
                  </div>
                </div>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
