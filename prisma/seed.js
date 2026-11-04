const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database with initial math quiz...');

  // Create an Algebra quiz with options and the correct answer
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

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });