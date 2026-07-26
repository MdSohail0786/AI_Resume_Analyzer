import mongoose from "mongoose";

const analysisSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    resumeUrl: { type: String, required: true },
    jobRole: { type: String },
    score: { type: Number },
    extractedSkills: [String],
    missingSkills: [String],
    suggestions: { type: String },
    jobDescription: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Analysis", analysisSchema);
