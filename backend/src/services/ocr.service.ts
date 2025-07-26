import { ImageAnnotatorClient } from "@google-cloud/vision";
import { BaseService } from "./base.service";
import { AppError } from "../middleware/error.middleware";
import { config } from "../config";

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

export class OCRService extends BaseService {
  private vision: ImageAnnotatorClient;

  constructor() {
    super("ocr");
    this.vision = new ImageAnnotatorClient({
      projectId: config.googleCloud.projectId,
      keyFilename: config.googleCloud.keyFilename,
    });
  }

  async processImage(imageUrl: string): Promise<OCRResult[]> {
    try {
      const [result] = await this.vision.textDetection(imageUrl);
      const detections = result.textAnnotations || [];

      return detections.map((text: any) => ({
        text: text.description || "",
        confidence: text.confidence || 0,
        boundingBox: text.boundingPoly?.vertices?.[0] || null,
      }));
    } catch (error) {
      throw new AppError(500, "Error processing image with OCR");
    }
  }

  extractTimetableData(ocrResults: OCRResult[]): ExtractedTimetableData[] {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    const courseCodeRegex = /^[A-Z]{2,4}[0-9]{3,4}$/;
    const daysOfWeek = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];

    const timetableData: ExtractedTimetableData[] = [];
    let currentEntry: Partial<ExtractedTimetableData> = {};

    for (const result of ocrResults) {
      const text = result.text.trim();

      // Check for course code
      if (courseCodeRegex.test(text)) {
        if (Object.keys(currentEntry).length > 0) {
          timetableData.push({
            ...currentEntry,
            confidence: result.confidence,
          } as ExtractedTimetableData);
          currentEntry = {};
        }
        currentEntry.courseCode = text;
      }

      // Check for day of week
      else if (daysOfWeek.includes(text)) {
        currentEntry.dayOfWeek = text;
      }

      // Check for time
      else if (timeRegex.test(text)) {
        if (!currentEntry.startTime) {
          currentEntry.startTime = text;
        } else if (!currentEntry.endTime) {
          currentEntry.endTime = text;
        }
      }

      // Check for venue (any remaining text that might be a room number or location)
      else if (
        text.includes("Room") ||
        text.includes("Lab") ||
        text.includes("Hall")
      ) {
        currentEntry.venue = text;
      }
    }

    // Add the last entry if it exists
    if (Object.keys(currentEntry).length > 0 && currentEntry.courseCode) {
      timetableData.push({
        ...currentEntry,
        confidence: ocrResults[0]?.confidence || 0,
      } as ExtractedTimetableData);
    }

    return timetableData;
  }

  validateTimetableData(data: ExtractedTimetableData): boolean {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    const courseCodeRegex = /^[A-Z]{2,4}[0-9]{3,4}$/;
    const daysOfWeek = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];

    return (
      courseCodeRegex.test(data.courseCode) &&
      daysOfWeek.includes(data.dayOfWeek) &&
      timeRegex.test(data.startTime) &&
      timeRegex.test(data.endTime)
    );
  }
}
