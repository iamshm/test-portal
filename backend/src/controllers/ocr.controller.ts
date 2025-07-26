import { Request, Response, NextFunction } from "express";
import { ImageAnnotatorClient } from "@google-cloud/vision";
import multer from "multer";
import path from "path";
import { config } from "../config";

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

export const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPEG and PNG allowed."));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

export class OCRController {
  private vision: ImageAnnotatorClient;

  constructor() {
    this.vision = new ImageAnnotatorClient({
      keyFilename: config.googleCloud.keyFilename,
    });
  }

  uploadImage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const [result] = await this.vision.textDetection(req.file.path);
      const detections = result.textAnnotations || [];
      const extractedData = this.extractTimetableData(detections);

      res.json({
        message: "File uploaded and processed successfully",
        data: extractedData,
      });
    } catch (error) {
      next(error);
    }
  };

  private extractTimetableData(detections: any[]) {
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

    const timetableData = [];
    let currentEntry: any = {};

    for (const detection of detections) {
      const text = detection.description?.trim() || "";

      // Check for course code
      if (courseCodeRegex.test(text)) {
        if (Object.keys(currentEntry).length > 0) {
          timetableData.push(currentEntry);
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
      // Check for venue
      else if (
        text.includes("Room") ||
        text.includes("Lab") ||
        text.includes("Hall")
      ) {
        currentEntry.venue = text;
      }
    }

    // Add the last entry if it exists
    if (Object.keys(currentEntry).length > 0) {
      timetableData.push(currentEntry);
    }

    return timetableData;
  }
}
