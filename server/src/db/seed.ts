import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

import { initDatabase, getOne, execute } from './index.js';

export interface DemoUser {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'MANAGER' | 'AGENT';
  specialization: string;
  skills: string[];
}

export const DEMO_USERS: DemoUser[] = [
  {
    id: 'ADMIN',
    name: 'Admin',
    email: 'admin@novaworks.example',
    role: 'ADMIN',
    specialization: 'Administrator',
    skills: ['Company overview', 'transcript creation']
  },
  {
    id: 'PM01',
    name: 'Ayesha Khan',
    email: 'ayesha@novaworks.example',
    role: 'MANAGER',
    specialization: 'Web PM',
    skills: ['Web projects', 'client coordination']
  },
  {
    id: 'PM02',
    name: 'Bilal Ahmed',
    email: 'bilal@novaworks.example',
    role: 'MANAGER',
    specialization: 'Mobile PM',
    skills: ['Mobile projects', 'delivery planning']
  },
  {
    id: 'PM03',
    name: 'Hina Malik',
    email: 'hina@novaworks.example',
    role: 'MANAGER',
    specialization: 'AI PM',
    skills: ['AI projects', 'requirement review']
  },
  {
    id: 'DEV01',
    name: 'Ali Raza',
    email: 'ali@novaworks.example',
    role: 'AGENT',
    specialization: 'Full-Stack',
    skills: ['React', 'frontend integration']
  },
  {
    id: 'DEV02',
    name: 'Hamza Shah',
    email: 'hamza@novaworks.example',
    role: 'AGENT',
    specialization: 'Full-Stack',
    skills: ['Node.js', 'databases', 'APIs']
  },
  {
    id: 'DEV03',
    name: 'Sara Noor',
    email: 'sara@novaworks.example',
    role: 'AGENT',
    specialization: 'App Developer',
    skills: ['Flutter', 'mobile UI']
  },
  {
    id: 'DEV04',
    name: 'Usman Tariq',
    email: 'usman@novaworks.example',
    role: 'AGENT',
    specialization: 'App Developer',
    skills: ['Flutter', 'integration', 'testing']
  },
  {
    id: 'DEV05',
    name: 'Zain Abbas',
    email: 'zain@novaworks.example',
    role: 'AGENT',
    specialization: 'AI Developer',
    skills: ['LLMs', 'extraction', 'prompts']
  },
  {
    id: 'DEV06',
    name: 'Maryam Asif',
    email: 'maryam@novaworks.example',
    role: 'AGENT',
    specialization: 'AI Developer',
    skills: ['Retrieval', 'document processing']
  }
];

export async function seedDemoUsers() {
  await initDatabase();
  const passwordHash = await bcrypt.hash('Demo123!', 10);

  let insertedCount = 0;
  let updatedCount = 0;

  for (const user of DEMO_USERS) {
    const existing = await getOne<{ id: string }>('SELECT id FROM users WHERE email = ?', [user.email]);
    const skillsStr = JSON.stringify(user.skills);

    if (existing) {
      await execute(
        'UPDATE users SET name = ?, passwordHash = ?, role = ?, specialization = ?, skills = ? WHERE email = ?',
        [user.name, passwordHash, user.role, user.specialization, skillsStr, user.email]
      );
      updatedCount++;
    } else {
      await execute(
        'INSERT INTO users (id, name, email, passwordHash, role, specialization, skills) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [user.id, user.name, user.email, passwordHash, user.role, user.specialization, skillsStr]
      );
      insertedCount++;
    }
  }

  console.log(`Seeding complete. Inserted: ${insertedCount}, Updated: ${updatedCount}, Total: 10`);
}

// Execute directly if run as a script
if (process.argv[1]?.endsWith('seed.ts') || process.argv[1]?.endsWith('seed.js')) {
  seedDemoUsers()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Seed error:', err);
      process.exit(1);
    });
}
