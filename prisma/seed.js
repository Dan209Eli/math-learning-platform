const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database with SHS math quizzes and explanations...');

  // Reset existing records to prevent duplication
  await prisma.option.deleteMany();
  await prisma.quiz.deleteMany();

  // Topic 1: Algebra & Equations
  await prisma.quiz.create({
    data: {
      topic: 'Algebra',
      question: 'Solve for $x$ in the equation: $2x + 5 = 15$',
      correctAnswer: '$x = 5$',
      explanation: 'Subtract $5$ from both sides: $2x = 10$. Then divide by $2$: $x = 5$.',
      options: {
        create: [
          { text: '$x = 3$' },
          { text: '$x = 5$' },
          { text: '$x = 7$' },
          { text: '$x = 10$' },
        ],
      },
    },
  });

  // Topic 2: Quadratic Functions
  await prisma.quiz.create({
    data: {
      topic: 'Algebra',
      question: 'Find the truth set of $x^2 - 9 = 0$',
      correctAnswer: '$x = \\pm 3$',
      explanation: 'Rearrange to $x^2 = 9$, then take the square root of both sides to get $x = \\pm\\sqrt{9} = \\pm 3$.',
      options: {
        create: [
          { text: '$x = \\pm 2$' },
          { text: '$x = \\pm 3$' },
          { text: '$x = \\pm 9$' },
          { text: '$0$' },
        ],
      },
    },
  });

  // Topic 3: Trigonometry
  await prisma.quiz.create({
    data: {
      topic: 'Trigonometry',
      question: 'Evaluate $\\sin(30^\\circ) + \\cos(60^\\circ)$',
      correctAnswer: '$1$',
      explanation: 'From standard special angles, $\\sin(30^\\circ) = \\frac{1}{2}$ and $\\cos(60^\\circ) = \\frac{1}{2}$. Adding them gives $\\frac{1}{2} + \\frac{1}{2} = 1$.',
      options: {
        create: [
          { text: '$\\frac{1}{2}$' },
          { text: '$1$' },
          { text: '$\\frac{\\sqrt{3}}{2}$' },
          { text: '$\\sqrt{3}$' },
        ],
      },
    },
  });

  // Topic 4: Coordinate Geometry & Vectors
  await prisma.quiz.create({
    data: {
      topic: 'Geometry',
      question: 'Find the magnitude of the vector $\\mathbf{v} = 3\\mathbf{i} + 4\\mathbf{j}$',
      correctAnswer: '$5$',
      explanation: 'Use the magnitude formula $\|\\mathbf{v}\| = \\sqrt{x^2 + y^2} = \\sqrt{3^2 + 4^2} = \\sqrt{9 + 16} = \\sqrt{25} = 5$.',
      options: {
        create: [
          { text: '$5$' },
          { text: '$7$' },
          { text: '$12$' },
          { text: '$25$' },
        ],
      },
    },
  });

  // Topic 5: Statistics & Probability
  await prisma.quiz.create({
    data: {
      topic: 'Statistics',
      question: 'Calculate the mean of the set $\\{4, 8, 12, 16\\}$',
      correctAnswer: '$10$',
      explanation: 'The mean is the sum of the values divided by the count: $\\frac{4 + 8 + 12 + 16}{4} = \\frac{40}{4} = 10$.',
      options: {
        create: [
          { text: '$8$' },
          { text: '$10$' },
          { text: '$12$' },
          { text: '$14$' },
        ],
      },
    },
  });

  // Topic 6: Indices & Logarithms
  await prisma.quiz.create({
    data: {
      topic: 'Algebra',
      question: 'Simplify the expression: $\\log_{10}(25) + \\log_{10}(4)$',
      correctAnswer: '$2$',
      explanation: 'Using the logarithm product rule $\\log(a) + \\log(b) = \\log(ab)$, we get $\\log_{10}(25 \\times 4) = \\log_{10}(100)$. Since $10^2 = 100$, the answer is $2$.',
      options: {
        create: [
          { text: '$1$' },
          { text: '$2$' },
          { text: '$10$' },
          { text: '$29$' },
        ],
      },
    },
  });

  // Topic 7: Probability
  await prisma.quiz.create({
    data: {
      topic: 'Statistics',
      question: 'A fair die is rolled once. What is the probability of rolling an even number?',
      correctAnswer: '$\\frac{1}{2}$',
      explanation: 'The sample space for a die is $\\{1, 2, 3, 4, 5, 6\\}$ (6 outcomes). The even numbers are $\\{2, 4, 6\\}$ (3 outcomes). Probability = $\\frac{3}{6} = \\frac{1}{2}$.',
      options: {
        create: [
          { text: '$\\frac{1}{3}$' },
          { text: '$\\frac{1}{2}$' },
          { text: '$\\frac{2}{3}$' },
          { text: '$1$' },
        ],
      },
    },
  });

  console.log('✅ SHS Math curriculum with explanations seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });