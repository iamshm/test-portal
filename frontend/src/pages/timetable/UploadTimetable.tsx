import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, Check, Edit2 } from "lucide-react";
import axios from "axios";

interface ExtractedData {
  courseCode: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  venue?: string;
}

export const UploadTimetable = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedData[]>([]);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError(null);
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  const handleUpload = async () => {
    if (!file) return;

    try {
      setUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append("image", file);

      const response = await axios.post("/api/ocr/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setExtractedData(response.data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setExtractedData([]);
    setError(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Upload Timetable Image</h1>

      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${
            isDragActive
              ? "border-indigo-500 bg-indigo-50"
              : "border-gray-300 hover:border-indigo-400"
          }
          ${file ? "bg-gray-50" : ""}`}
      >
        <input {...getInputProps()} />
        {file ? (
          <div className="flex items-center justify-center gap-4">
            <span className="text-gray-700">{file.name}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveFile();
              }}
              className="p-1 text-gray-500 hover:text-red-500"
            >
              <X size={20} />
            </button>
          </div>
        ) : isDragActive ? (
          <div className="text-indigo-500">
            <Upload className="mx-auto mb-4" size={32} />
            <p>Drop the image here</p>
          </div>
        ) : (
          <div className="text-gray-500">
            <Upload className="mx-auto mb-4" size={32} />
            <p>Drag & drop a timetable image here, or click to select</p>
            <p className="text-sm mt-2">Supports: JPEG, PNG (max 5MB)</p>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Upload Button */}
      {file && !extractedData.length && (
        <button
          onClick={handleUpload}
          disabled={uploading}
          className={`mt-4 px-4 py-2 rounded-lg text-white ${
            uploading
              ? "bg-indigo-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {uploading ? "Processing..." : "Extract Timetable Data"}
        </button>
      )}

      {/* Extracted Data */}
      {extractedData.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">
            Extracted Timetable Data
          </h2>
          <div className="space-y-4">
            {extractedData.map((entry, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-lg shadow border border-gray-200"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{entry.courseCode}</h3>
                    <p className="text-gray-600">
                      {entry.dayOfWeek} • {entry.startTime} - {entry.endTime}
                    </p>
                    {entry.venue && (
                      <p className="text-gray-500 text-sm">{entry.venue}</p>
                    )}
                  </div>
                  <button className="p-1 text-gray-500 hover:text-indigo-600">
                    <Edit2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex gap-4">
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
              Save to Timetable
            </button>
            <button
              onClick={handleRemoveFile}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Upload Another Image
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
