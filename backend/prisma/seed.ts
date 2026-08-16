import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clean old data to avoid unique constraint violations
  await prisma.dailyChallengeCompletion.deleteMany();
  await prisma.dailyChallenge.deleteMany();
  await prisma.userReward.deleteMany();
  await prisma.reward.deleteMany();
  await prisma.userAchievement.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.practiceResult.deleteMany();
  await prisma.practiceSession.deleteMany();
  await prisma.progress.deleteMany();
  await prisma.sign.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.world.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();

  // 1. Seed Achievements
  const firstStepAch = await prisma.achievement.create({
    data: {
      slug: 'first-step',
      name: 'First Step',
      description: 'Complete your very first sign lesson!',
      xpReward: 50,
      condition: JSON.stringify({ type: 'lesson_completed', count: 1 }),
    },
  });

  const streak3Ach = await prisma.achievement.create({
    data: {
      slug: 'streak-3',
      name: 'Streak Starter',
      description: 'Maintain a 3-day learning streak!',
      xpReward: 100,
      condition: JSON.stringify({ type: 'streak', count: 3 }),
    },
  });

  const accuracy90Ach = await prisma.achievement.create({
    data: {
      slug: 'accuracy-90',
      name: 'Sign Precision',
      description: 'Submit a practice result with over 90% confidence!',
      xpReward: 150,
      condition: JSON.stringify({ type: 'confidence', value: 0.9 }),
    },
  });

  // 2. Seed Rewards
  const glovePioneerReward = await prisma.reward.create({
    data: {
      slug: 'glove-pioneer-badge',
      name: 'Glove Pioneer',
      description: 'Awarded to early users of SignaVerse',
      type: 'BADGE',
    },
  });

  const apprenticeTitleReward = await prisma.reward.create({
    data: {
      slug: 'sign-apprentice-title',
      name: 'Sign Apprentice',
      description: 'Title unlocked on your profile',
      type: 'TITLE',
    },
  });

  // 3. Seed World 1: First Signs
  const w1 = await prisma.world.create({
    data: {
      slug: 'first-signs',
      name: 'First Signs',
      description: 'Learn your very first basics of Indian Sign Language.',
      emoji: '🌱',
      order: 1,
      colorTheme: '#10B981',
      unlocksAtXP: 0,
    },
  });

  // World 1 - Lesson 1: Greetings
  const w1_l1 = await prisma.lesson.create({
    data: {
      worldId: w1.id,
      title: 'Greetings & Intros',
      description: 'Basic ways to greet people in ISL.',
      order: 1,
      xpReward: 100,
      coinReward: 20,
    },
  });

  await prisma.sign.createMany({
    data: [
      {
        lessonId: w1_l1.id,
        word: 'Namaste',
        description: 'Bring both palms together at chest level and bow slightly.',
        order: 1,
      },
      {
        lessonId: w1_l1.id,
        word: 'Hello',
        description: 'Extend dominant hand, fingers together, and wave slightly from the forehead outward.',
        order: 2,
      },
      {
        lessonId: w1_l1.id,
        word: 'Welcome',
        description: 'Open both hands, palms facing up, draw them towards your body in a welcoming gesture.',
        order: 3,
      },
    ],
  });

  // World 1 - Lesson 2: Responses
  const w1_l2 = await prisma.lesson.create({
    data: {
      worldId: w1.id,
      title: 'Simple Responses',
      description: 'Expressing confirmation, denial, or agreement.',
      order: 2,
      xpReward: 120,
      coinReward: 25,
    },
  });

  await prisma.sign.createMany({
    data: [
      {
        lessonId: w1_l2.id,
        word: 'Yes',
        description: 'Make a fist with your dominant hand and nod it up and down like a nodding head.',
        order: 1,
      },
      {
        lessonId: w1_l2.id,
        word: 'No',
        description: 'Extend index and middle fingers, tap them down onto the thumb repeatedly.',
        order: 2,
      },
      {
        lessonId: w1_l2.id,
        word: 'OK',
        description: 'Form the letters O and K with your fingers sequentially.',
        order: 3,
      },
    ],
  });

  // World 1 - Lesson 3: Manners
  const w1_l3 = await prisma.lesson.create({
    data: {
      worldId: w1.id,
      title: 'Everyday Manners',
      description: 'Polite words used in daily interactions.',
      order: 3,
      xpReward: 150,
      coinReward: 30,
    },
  });

  await prisma.sign.createMany({
    data: [
      {
        lessonId: w1_l3.id,
        word: 'Thank You',
        description: 'Touch fingertips of dominant hand to chin, then move hand forward and down toward the person.',
        order: 1,
      },
      {
        lessonId: w1_l3.id,
        word: 'Please',
        description: 'Place your flat dominant hand on your chest and move it in a circular motion.',
        order: 2,
      },
      {
        lessonId: w1_l3.id,
        word: 'Sorry',
        description: 'Make a fist with dominant hand and rub it in a circular motion over your chest/heart.',
        order: 3,
      },
    ],
  });

  // 4. Seed World 2: Alphabet Forest
  const w2 = await prisma.world.create({
    data: {
      slug: 'alphabet-forest',
      name: 'Alphabet Forest',
      description: 'Master fingerspelling the English alphabet in ISL.',
      emoji: '🌳',
      order: 2,
      colorTheme: '#3B82F6',
      unlocksAtXP: 300, // Locked until user earns 300 XP
    },
  });

  // World 2 - Lesson 1: Vowels
  const w2_l1 = await prisma.lesson.create({
    data: {
      worldId: w2.id,
      title: 'Vowels',
      description: 'Fingerspelling vowels A, E, I, O, U.',
      order: 1,
      xpReward: 150,
      coinReward: 35,
    },
  });

  await prisma.sign.createMany({
    data: [
      {
        lessonId: w2_l1.id,
        word: 'A',
        description: 'Touch the tip of your thumb on your non-dominant hand with your dominant index finger.',
        order: 1,
      },
      {
        lessonId: w2_l1.id,
        word: 'E',
        description: 'Touch the tip of your index finger on your non-dominant hand with your dominant index finger.',
        order: 2,
      },
      {
        lessonId: w2_l1.id,
        word: 'I',
        description: 'Touch the tip of your middle finger on your non-dominant hand with your dominant index finger.',
        order: 3,
      },
    ],
  });

  // 5. Seed World 3: Word Garden
  const w3 = await prisma.world.create({
    data: {
      slug: 'word-garden',
      name: 'Word Garden',
      description: 'Grow your vocabulary with everyday common words.',
      emoji: '🌼',
      order: 3,
      colorTheme: '#F59E0B',
      unlocksAtXP: 800,
    },
  });

  // World 3 - Lesson 1: Questions
  const w3_l1 = await prisma.lesson.create({
    data: {
      worldId: w3.id,
      title: 'Questions',
      description: 'Asking Who, What, and Where in ISL.',
      order: 1,
      xpReward: 200,
      coinReward: 40,
    },
  });

  await prisma.sign.createMany({
    data: [
      {
        lessonId: w3_l1.id,
        word: 'What',
        description: 'Extend both hands, palms up, and move them slightly side to side with a questioning face.',
        order: 1,
      },
      {
        lessonId: w3_l1.id,
        word: 'Where',
        description: 'Extend dominant index finger pointing up, and move it side to side.',
        order: 2,
      },
    ],
  });

  // 6. Seed Daily Challenges
  const todayStr = new Date().toISOString().split('T')[0]; // e.g. "2026-08-15"
  
  // Find one sign we seeded to link the challenge to
  const waterSign = await prisma.sign.findFirst({
    where: { word: 'Thank You' },
  });

  if (waterSign) {
    await prisma.dailyChallenge.create({
      data: {
        date: todayStr,
        signId: waterSign.id,
        xpReward: 100,
        coinReward: 50,
      },
    });
    console.log(`Seeded daily challenge for date ${todayStr}`);
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
