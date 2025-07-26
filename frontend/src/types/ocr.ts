export interface OCRResult {
  text: string;
  confidence: number;
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface ExtractedTimetableData {
  courseCode: string;
  courseName?: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  venue?: string;
  confidence: number;
}

export interface OCRProcessingStatus {
  status: "idle" | "uploading" | "processing" | "success" | "error";
  progress?: number;
  error?: string;
  result?: ExtractedTimetableData[];
}

export interface ImageUploadResponse {
  imageUrl: string;
  ocrResults: OCRResult[];
}
