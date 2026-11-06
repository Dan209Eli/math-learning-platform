const express = require('express');
const cors = require('cors');
const prisma = require('./src/prisma'); // Import our shared Prisma helper

const app = express();
const PORT = 3000;

// 1. Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// -------------------------------------------------------------
app.get('/api/quizzes', async (req, res) => {
  try {
    const { topic } = req.query;
    const whereClause = topic ? { topic } : {};
    
    // Tell Prisma to fetch quizzes (filtered by topic if provided) and their options
    const quizzes = await prisma.quiz.findMany({
      where: whereClause,
      include: {
        options: true,
      },
    });

    res.json({
      success: true,
      count: quizzes.length,
      data: quizzes,
    });
  } catch (error) {
    console.error('Failed to fetch quizzes from database:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch quizzes' });
  }
});

// -------------------------------------------------------------
// ROUTE 2: Grade the student's answer using the database
// -------------------------------------------------------------
app.post('/api/quizzes/submit', async (req, res) => {
  try {
    const { quizId, selectedAnswer } = req.body;

    // Find the specific quiz in our database by its ID
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
    });

    if (!quiz) {
      return res.status(404).json({ success: false, message: "Quiz not found!" });
    }

    const isCorrect = selectedAnswer === quiz.correctAnswer;

    res.json({
      success: true,
      isCorrect,
      message: isCorrect ? "Spot on! That's correct! 🎉" : "Not quite, keep trying! 💪",
      correctAnswer: isCorrect ? null : quiz.correctAnswer,
    });
  } catch (error) {
    console.error('Failed to grade quiz:', error);
    res.status(500).json({ success: false, error: 'Failed to grade quiz' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Backend server is running live at http://localhost:${PORT}`);
});