import axios from "axios";
import type { ImageUploadResponse, ExtractedTimetableData } from "../types/ocr";

const API_URL = "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const ocrApi = {
  uploadImage: async (file: File): Promise<ImageUploadResponse> => {
    const formData = new FormData();
    formData.append("image", file);

    const response = await api.post<ImageUploadResponse>(
      "/ocr/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  processImage: async (imageUrl: string): Promise<ExtractedTimetableData[]> => {
    const response = await api.post<{ data: ExtractedTimetableData[] }>(
      "/ocr/process",
      {
        imageUrl,
      }
    );
    return response.data.data;
  },

  extractTimetable: async (
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<ExtractedTimetableData[]> => {
    try {
      // Step 1: Upload image
      if (onProgress) onProgress(0);
      const uploadResponse = await ocrApi.uploadImage(file);
      if (onProgress) onProgress(50);

      // Step 2: Process image with OCR
      const results = await ocrApi.processImage(uploadResponse.imageUrl);
      if (onProgress) onProgress(100);

      return results;
    } catch (error) {
      console.error("Error processing image:", error);
      throw error;
    }
  },
};
