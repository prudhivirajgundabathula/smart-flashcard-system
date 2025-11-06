const express = require("express");
const router = express.Router();
const Flashcard = require("./models/Flashcard");

// Simple rule-based subject inference
const subjectKeywords = {
  Physics: ["force", "acceleration", "gravity", "newton"],
  Biology: ["photosynthesis", "cell", "organism"],
  Chemistry: ["atom", "reaction", "acid"],
  Math: ["equation", "algebra", "geometry"],
  History: ["war", "empire", "treaty"],
};

function inferSubject(text) {
  const lowerText = text.toLowerCase();
  for (const [subject, keywords] of Object.entries(subjectKeywords)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      return subject;
    }
  }
  return "General";
}

// POST /flashcard
router.post("/flashcard", async (req, res) => {
  const { student_id, question, answer } = req.body;
  const subject = inferSubject(question);

  const card = new Flashcard({ student_id, question, answer, subject });
  await card.save();

  res.json({ message: "Flashcard added successfully", subject });
});

// GET /get-subject?student_id=stu001&limit=5
router.get("/get-subject", async (req, res) => {
  const { student_id, limit } = req.query;
  const cards = await Flashcard.find({ student_id });

  const subjectGroups = {};
  cards.forEach(card => {
    if (!subjectGroups[card.subject]) subjectGroups[card.subject] = [];
    subjectGroups[card.subject].push(card);
  });

  const mixed = [];
  const subjects = Object.keys(subjectGroups);
  while (mixed.length < limit && subjects.length > 0) {
    for (const subject of subjects) {
      const group = subjectGroups[subject];
      if (group.length > 0) {
        mixed.push(group.pop());
        if (mixed.length === parseInt(limit)) break;
      }
    }
  }

  res.json(mixed);
});

module.exports = router;