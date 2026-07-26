import Analysis from "../models/Analysis.js";
import fs from "fs";
import path from "path";
import pdfParse from "pdf-parse/lib/pdf-parse.js";
import OpenAI from "openai";

const analyzeWithAI = async (resumeText, jobDescription) => {
  console.log("Groq Key:", process.env.GROQ_API_KEY);

  const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
  });

  const prompt = `
You are an ATS Resume Analyzer.

Compare the resume against the job description.

Rules:

- Compare ONLY technical skills.
- Ignore communication skills.
- Ignore leadership skills.
- Ignore teamwork.
- Ignore soft skills.
- Do not invent skills.
- Only include technologies that actually appear.

Scoring Rules:

- Calculate ATS score from 0 to 100.
- Score must depend on skill match percentage.
- If almost all required skills match, score should be above 85.
- If around half match, score should be between 50-70.
- If very few skills match, score should be below 40.
- Do NOT return a random score.

Resume:
${resumeText}

Job Description:
${jobDescription}

Return ONLY valid JSON.

{
  "extractedSkills": [],
  "missingSkills": [],
  "suggestions": "",
  "jobRole": ""
}
`;

  const response = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.3,
    response_format: {
      type: "json_object",
    },
  });

  return JSON.parse(response.choices[0].message.content);
};

export const analyzeResume = async (req, res) => {
  try {
    const { jobDescription } = req.body;

    if (!req.file) {
      return res.status(400).json({
        message: "Resume file is required",
      });
    }

    if (!jobDescription || jobDescription.trim().length < 20) {
      return res.status(400).json({
        message: "Please provide a valid Job Description",
      });
    }

    const filePath = path.resolve(req.file.path);
    const pdfBuffer = fs.readFileSync(filePath);

    const pdf = await pdfParse(pdfBuffer);
    const resumeText = pdf.text;

    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({
        message: "Unable to extract text from PDF",
      });
    }

    const aiResult = await analyzeWithAI(resumeText, jobDescription);
    const matchedSkills = aiResult.extractedSkills || [];
    const missingSkills = aiResult.missingSkills || [];

    const matched = matchedSkills.length;
    const missing = missingSkills.length;
    const total = matched + missing;

    const score = total === 0 ? 0 : Math.round((matched / total) * 100);

    const analysis = await Analysis.create({
      userId: req.user.id,
      resumeUrl: `/uploads/${req.file.filename}`,
      jobRole: aiResult.jobRole || "Unknown",
      jobDescription,
      score: score,
      extractedSkills: matchedSkills,
      missingSkills: missingSkills,
      suggestions: aiResult.suggestions || "",
    });

    res.json({
      analysisId: analysis._id,
      score: score,
      extractedSkills: matchedSkills,
      missingSkills: missingSkills,
      suggestions: aiResult.suggestions,
      jobRole: aiResult.jobRole,
      pdfUrl: analysis.resumeUrl,
    });
  } catch (err) {
    console.error("Groq Error:", err);

    res.status(500).json({
      message: err.message,
    });
  }
};
