const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database with multiple math quizzes...');

  // Clear existing options and quizzes to avoid duplication conflicts
  await prisma.option.deleteMany();
  await prisma.quiz.deleteMany();

  // Question 1: Algebra
  await prisma.quiz.create({
    data: {
      topic: 'Algebra',
      question: 'Solve for $x$: $2x + 5 = 15$',
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

  // Question 2: Quadratic Equations
  await prisma.quiz.create({
    data: {
      topic: 'Algebra',
      question: 'Find the roots of: $x^2 - 9 = 0$',
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

  // Question 3: Linear Equations
  await prisma.quiz.create({
    data: {
      topic: 'Algebra',
      question: 'Evaluate for $x$ when $3x - 4 = 11$',
      correctAnswer: '$x = 5$',
      options: {
        create: [
          { text: '$x = 3$' },
          { text: '$x = 4$' },
          { text: '$x = 5$' },
          { text: '$x = 6$' },
        ],
      },
    },
  });

  console.log('✅ Database seeded with multiple quizzes successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });