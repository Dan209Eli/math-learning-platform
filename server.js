const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

// 1. Middleware (The security guard and translator)
app.use(cors());
app.use(express.json());

// 2. Our storage box of math questions (The menu)
const mathQuizzes = [
  {
    id: 1,
    topic: "Algebra",
    question: "Solve for $x$: $2x + 5 = 15$",
    options: ["$x = 3$", "$x = 5$", "$x = 7$", "$x = 10$"],
    correctAnswer: "$x = 5$"
  },
  {
    id: 2,
    topic: "Linear Equations",
    question: "What is the slope of the line $y = 3x + 2$?",
    options: ["$2$", "$3$", "$5$", "$1$"],
    correctAnswer: "$3$"
  }
];

// 3. GET Route: Serve the quizzes to the frontend
app.get('/api/quizzes', (req, res) => {
  res.json({
    success: true,
    count: mathQuizzes.length,
    data: mathQuizzes
  });
});

// 4. POST Route: Grade the student's answer
app.post('/api/quizzes/submit', (req, res) => {
  const { quizId, selectedAnswer } = req.body;
  const quiz = mathQuizzes.find(q => q.id === quizId);
  
  if (!quiz) {
    return res.status(404).json({ success: false, message: "Quiz not found!" });
  }
  
  const isCorrect = selectedAnswer === quiz.correctAnswer;
  
  res.json({
    success: true,
    isCorrect: isCorrect,
    message: isCorrect ? "Spot on! That's correct! 🎉" : "Not quite, keep trying! 💪",
    correctAnswer: isCorrect ? null : quiz.correctAnswer
  });
});

// 5. START THE SERVER (Always goes at the very bottom!)
app.listen(PORT, () => {
  console.log(`Backend server is running live at http://localhost:${PORT}`);
});