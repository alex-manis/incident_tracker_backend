import { PrismaClient, Role } from '@prisma/client';
import { hashPassword } from '../src/lib/hash.js';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@example.com',
      passwordHash: await hashPassword('admin123'),
      role: Role.ADMIN,
    },
  });

  // Create manager user
  const manager = await prisma.user.upsert({
    where: { email: 'manager@example.com' },
    update: {},
    create: {
      name: 'Manager User',
      email: 'manager@example.com',
      passwordHash: await hashPassword('manager123'),
      role: Role.MANAGER,
    },
  });

  // Create agent user
  const agent = await prisma.user.upsert({
    where: { email: 'agent@example.com' },
    update: {},
    create: {
      name: 'Agent User',
      email: 'agent@example.com',
      passwordHash: await hashPassword('agent123'),
      role: Role.AGENT,
    },
  });

  console.log('Seeded users:', { admin, manager, agent });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
