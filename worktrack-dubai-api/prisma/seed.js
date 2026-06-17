const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const COUNTRIES = ['UAE', 'Saudi Arabia', 'Egypt', 'Jordan', 'Lebanon', 'Kuwait', 'Qatar', 'Bahrain'];
const CITIES = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Riyadh', 'Cairo', 'Amman', 'Beirut', 'Kuwait City'];
const CATEGORIES = ['Development', 'Design', 'Marketing', 'Operations', 'Finance', 'HR', 'Sales'];
const PRIORITIES = ['high', 'medium', 'low'];
const GENDERS = ['male', 'female'];

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(daysBack, daysFwd) {
  const now = Date.now();
  const min = now - daysBack * 864e5;
  const max = now + daysFwd * 864e5;
  return new Date(min + Math.random() * (max - min));
}

async function main() {
  console.log('Seeding database…');

  await prisma.activityLog.deleteMany();
  await prisma.task.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();

  const adminHash = await bcrypt.hash('Admin@1234', 12);
  const admin = await prisma.user.create({
    data: {
      fullName: 'Sarah Al-Mansouri',
      email: 'admin@worktrack.ae',
      passwordHash: adminHash,
      role: 'admin',
      mobile: '501234567',
      countryCode: '+971',
      country: 'UAE',
      gender: 'female',
      city: 'Dubai',
      preferredLanguage: 'en',
      onboardingDone: true,
    },
  });

  const userNames = [
    ['Ahmed Al-Rashidi', 'ahmed@example.ae'],
    ['Fatima Hassan', 'fatima@example.ae'],
    ['Mohammed Al-Zaabi', 'mohammed@example.ae'],
    ['Layla Karimi', 'layla@example.ae'],
    ['Omar Shaikh', 'omar@example.ae'],
    ['Noor Abdullah', 'noor@example.ae'],
    ['Khalid Al-Otaibi', 'khalid@example.ae'],
    ['Mariam Jaber', 'mariam@example.ae'],
  ];

  const userHash = await bcrypt.hash('User@1234', 12);
  const users = [];

  for (const [fullName, email] of userNames) {
    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        passwordHash: userHash,
        role: 'user',
        mobile: `5${Math.floor(10000000 + Math.random() * 89999999)}`,
        countryCode: '+971',
        country: randomItem(COUNTRIES),
        gender: randomItem(GENDERS),
        city: randomItem(CITIES),
        preferredLanguage: Math.random() > 0.5 ? 'en' : 'ar',
        onboardingDone: true,
        isActive: Math.random() > 0.1,
      },
    });
    users.push(user);

    await prisma.activityLog.create({
      data: { userId: user.id, action: 'login', metadata: { ip: '127.0.0.1' } },
    });
  }

  const allUsers = [admin, ...users];

  const taskTitles = [
    'Prepare Q3 financial report',
    'Review UI design mockups',
    'Update API documentation',
    'Fix authentication bug',
    'Deploy staging environment',
    'Onboard new team member',
    'Client presentation slides',
    'Performance optimization audit',
    'Write unit tests for auth module',
    'Implement export feature',
    'Schedule team retrospective',
    'Update project roadmap',
  ];

  for (const user of allUsers) {
    const taskCount = Math.floor(5 + Math.random() * 10);
    for (let i = 0; i < taskCount; i++) {
      const isDone = Math.random() > 0.5;
      const dueDate = randomDate(10, 14);
      const task = await prisma.task.create({
        data: {
          userId: user.id,
          title: randomItem(taskTitles),
          description: 'Auto-generated seed task for demo purposes.',
          status: isDone ? 'done' : 'pending',
          priority: randomItem(PRIORITIES),
          category: randomItem(CATEGORIES),
          dueDate,
          completedAt: isDone ? new Date() : null,
        },
      });

      await prisma.activityLog.create({
        data: {
          userId: user.id,
          action: 'task_created',
          metadata: { taskId: task.id, title: task.title },
        },
      });

      if (isDone) {
        await prisma.activityLog.create({
          data: {
            userId: user.id,
            action: 'task_completed',
            metadata: { taskId: task.id, title: task.title },
          },
        });
      }
    }
  }

  console.log('Seed complete.');
  console.log('Admin credentials: admin@worktrack.ae / Admin@1234');
  console.log('User credentials: ahmed@example.ae / User@1234');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
