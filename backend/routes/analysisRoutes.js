import express from "express";
import { analyzeResume } from "../controllers/AnalysisController.js";
import protect from "../middleware/authMiddleware.js";
import multer from "multer";
import path from "path";

const router = express.Router();

// File Upload Config — only PDFs allowed
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"), false);
  }
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB limit

router.post("/", protect, upload.single("resume"), analyzeResume);

export default router;
