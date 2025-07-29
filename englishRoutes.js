const express = require("express");
const router = express.Router();
const EnglishConcept = require("../models/englishModel");
require("dotenv").config();

// POST /api/generate
router.post("/generate", async (req, res) => {
  const { topic } = req.body;

  if (!topic) {
    return res.status(400).json({ error: "❌ Topic is required" });
  }

  try {
const apiKey = process.env.API_KEY;
const modelName = "models/gemini-1.5-flash";
const apiURL = `https://generativelanguage.googleapis.com/v1/${modelName}:generateContent?key=${apiKey}`;

   const response = await fetch(apiURL, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    contents: [
      {
        parts: [
          {
            text: `Explain the English grammar topic, and also give 5 word meaning as per day with proper sentence of that meaning. "${topic}" in simple terms with 1-2 examples.`
          }
        ]
      }
    ]
  })
});

const data = await response.json();
console.log("🔍 Gemini API raw response:", JSON.stringify(data, null, 2));

let explanation = "No explanation found.";

if (data.candidates && data.candidates.length > 0) {
  const parts = data.candidates[0].content?.parts;
  if (parts && parts.length > 0 && parts[0].text) {
    explanation = parts[0].text;
  } else {
    explanation = "No explanation inside content parts.";
  }
} else if (data.error) {
  explanation = `API Error: ${data.error.message}`;
}

const newConcept = new EnglishConcept({
  topic,
  explanation,
  examples: ""
});

await newConcept.save();

res.status(200).json({ topic, explanation });
  } catch (error) {
    console.error("❌ Error generating explanation:", error);
    res.status(500).json({ error: "❌ Error generating explanation" });
  }
});

module.exports = router;
