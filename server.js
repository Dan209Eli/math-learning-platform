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
// ----------------------------------------------------------
app.post('/api/quizzes/submit', async (req, res) => {
  try {
    const { quizId, selectedAnswer } = req.body;
    
    const quiz = await prisma.quiz.findUnique({
      where: { id: Number(quizId) }
    });

    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    // Normalize strings by trimming whitespace to prevent false mismatches
    const normalizedSelected = String(selectedAnswer).trim();
    const normalizedCorrect = String(quiz.correctAnswer).trim();

    const isCorrect = normalizedSelected === normalizedCorrect;

    res.json({
      success: true,
      isCorrect,
      message: isCorrect ? 'Spot on! Excellent work! 🎉' : 'Not quite, keep trying! 💪',
      correctAnswer: quiz.correctAnswer
    });
  } catch (error) {
    console.error('Error verifying answer:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Backend server is running live at http://localhost:${PORT}`);
});