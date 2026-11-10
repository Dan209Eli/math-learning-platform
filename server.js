const express = require('express');
const cors = require('cors');
const prisma = require('./src/prisma'); // Import our shared Prisma helper
const bcrypt = require('bcryptjs');

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
      correctAnswer: quiz.correctAnswer,
      explanation: quiz.explanation
    });
  } catch (error) {
    console.error('Error verifying answer:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// AUTHENTICATION MIDDLEWARE (The Bouncer)
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  // The header looks like "Bearer eyJhbGciOiJIUzI1NiIs..."
  // We split it by space to get just the token part
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided!' });
  }

  try {
    // Verify the token using our secret key
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified; // Save the user info for the next function to use
    next(); // Pass control to the actual route handler!
  } catch (error) {
    res.status(403).json({ error: 'Invalid or expired token!' });
  }
};

// REGISTER ROUTE
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use!' });
    }

    // 2. Hash the password securely (10 rounds of salt)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Save the new user to the database
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    });

    // Send back a success response (omitting the password for safety!)
    res.status(201).json({
      message: 'Account created successfully!',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const jwt = require('jsonwebtoken');

// A secret key used to sign our digital tokens (In professional apps, this lives in a .env file!)
const JWT_SECRET = 'super-secret-math-key-2026';

// LOGIN ROUTE
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find the user by email
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password!' });
    }

    // 2. Compare the typed password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid email or password!' });
    }

    // 3. Generate a JWT token that expires in 1 day
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    // 4. Send the token and user info back to the frontend
    res.status(200).json({
      message: 'Logged in successfully!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PROTECTED PROFILE ROUTE
app.get('/api/auth/me', verifyToken, async (req, res) => {
  try {
    // req.user.userId comes from our verifyToken bouncer!
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { id: true, name: true, email: true, createdAt: true } // Notice we exclude password!
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found!' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/scores - Save a student's quiz score (Protected Route)
app.post('/api/scores', verifyToken, async (req, res) => {
  try {
    const { topic, score, total } = req.body;
    const userId = req.user.userId; // Extracted from JWT token by verifyToken bouncer

    // Create a new score record linked to this user
    const newScore = await prisma.quizScore.create({
      data: {
        topic,
        score,
        total,
        userId
      }
    });

    res.status(201).json({ 
      message: 'Score saved successfully!', 
      newScore 
    });
  } catch (error) {
    console.error('Error saving score:', error);
    res.status(500).json({ error: 'Internal server error while saving score.' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Backend server is running live at http://localhost:${PORT}`);
});