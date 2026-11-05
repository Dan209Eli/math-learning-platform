const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database with SHS math curriculum quizzes...');

  // Reset existing records to prevent duplication
  await prisma.option.deleteMany();
  await prisma.quiz.deleteMany();

  // Topic 1: Algebra & Equations
  await prisma.quiz.create({
    data: {
      topic: 'Algebra',
      question: 'Solve for $x$ in the equation: $2x + 5 = 15$',
      correctAnswer: '$x = 5$',
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
      options: {
        create: [
          { text: '$x = \\pm 2$' },
          { text: '$x = \\pm 3$' },
          { text: '$x = \\pm 9$' },
          { text: '$x = 0$' },
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

  console.log('✅ SHS Math curriculum successfully seeded!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });