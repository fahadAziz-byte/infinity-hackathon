import { seedDemoUsers } from '../src/db/seed.js';
import { db } from '../src/db/index.js';

const BASE_URL = 'http://localhost:5001';

async function runTests() {
  console.log('🧪 Starting Auth & RBAC Verification Tests...');
  process.env.PORT = '5001';
  process.env.NODE_ENV = 'test';

  // Seed DB first
  await seedDemoUsers();

  // Import and start server
  const { app } = await import('../src/index.js');
  const server = app.listen(5001);

  try {
    // 1. Invalid Login Test
    const badLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@novaworks.example', password: 'WrongPassword!' })
    });
    if (badLoginRes.status !== 401) throw new Error(`Expected 401 for bad password, got ${badLoginRes.status}`);
    console.log('✅ Invalid login rejected (401)');

    // 2. Login Admin
    const adminLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@novaworks.example', password: 'Demo123!' })
    });
    const adminData = await adminLoginRes.json();
    if (!adminData.token || adminData.user.role !== 'ADMIN') throw new Error('Admin login failed');
    const adminToken = adminData.token;
    console.log('✅ Admin login succeeded');

    // 3. Login Ayesha (Manager)
    const ayeshaLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'ayesha@novaworks.example', password: 'Demo123!' })
    });
    const ayeshaData = await ayeshaLoginRes.json();
    if (!ayeshaData.token || ayeshaData.user.role !== 'MANAGER') throw new Error('Ayesha login failed');
    const ayeshaToken = ayeshaData.token;
    console.log('✅ Manager (Ayesha) login succeeded');

    // 4. Login Ali (Agent)
    const aliLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'ali@novaworks.example', password: 'Demo123!' })
    });
    const aliData = await aliLoginRes.json();
    if (!aliData.token || aliData.user.role !== 'AGENT') throw new Error('Ali login failed');
    const aliToken = aliData.token;
    console.log('✅ Agent (Ali) login succeeded');

    // 5. Login Hamza (Agent)
    const hamzaLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'hamza@novaworks.example', password: 'Demo123!' })
    });
    const hamzaData = await hamzaLoginRes.json();
    const hamzaToken = hamzaData.token;
    console.log('✅ Agent (Hamza) login succeeded');

    // 6. Insert Test Projects and Tasks to verify RBAC
    db.exec(`
      DELETE FROM tasks;
      DELETE FROM projects;
      INSERT INTO projects (id, name, clientName, description, managerId, deadline)
      VALUES 
        ('proj-1', 'UrbanCart Website', 'UrbanCart Clothing', 'Demo store', 'PM01', '2026-10-20'),
        ('proj-2', 'QuickServe Mobile App', 'QuickServe Services', 'Mobile app', 'PM02', '2026-10-24');

      INSERT INTO tasks (id, projectId, title, description, assigneeId, deadline, estimatedHours)
      VALUES 
        ('task-1', 'proj-1', 'Product catalog UI', 'Catalog screen', 'DEV01', '2026-10-12', 12),
        ('task-2', 'proj-1', 'Product and cart APIs', 'APIs', 'DEV02', '2026-10-14', 14),
        ('task-3', 'proj-2', 'Login and profile screens', 'Login screen', 'DEV03', '2026-10-12', 8),
        ('task-4', 'proj-2', 'Booking APIs', 'Booking API', 'DEV02', '2026-10-16', 16);
    `);

    // 7. Verify Admin sees ALL projects (2 projects)
    const adminProjectsRes = await fetch(`${BASE_URL}/api/projects`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const adminProjects = await adminProjectsRes.json();
    if (adminProjects.projects.length !== 2) throw new Error(`Admin expected 2 projects, got ${adminProjects.projects.length}`);
    console.log('✅ Admin sees all 2 projects');

    // 8. Verify Ayesha (PM01) sees ONLY UrbanCart (1 project)
    const ayeshaProjectsRes = await fetch(`${BASE_URL}/api/projects`, {
      headers: { Authorization: `Bearer ${ayeshaToken}` }
    });
    const ayeshaProjects = await ayeshaProjectsRes.json();
    if (ayeshaProjects.projects.length !== 1 || ayeshaProjects.projects[0].id !== 'proj-1') {
      throw new Error(`Ayesha should only see proj-1, got ${JSON.stringify(ayeshaProjects)}`);
    }
    console.log('✅ Ayesha sees only her assigned project (proj-1)');

    // 9. Verify Ayesha cannot access QuickServe (proj-2) -> must return 403 Forbidden
    const ayeshaAccessDenied = await fetch(`${BASE_URL}/api/projects/proj-2`, {
      headers: { Authorization: `Bearer ${ayeshaToken}` }
    });
    if (ayeshaAccessDenied.status !== 403) {
      throw new Error(`Expected 403 when Ayesha accesses unmanaged project, got ${ayeshaAccessDenied.status}`);
    }
    console.log('✅ Ayesha forbidden (403) from accessing proj-2');

    // 10. Verify Ali (DEV01) sees only proj-1 and only his own task in proj-1
    const aliProjectsRes = await fetch(`${BASE_URL}/api/projects`, {
      headers: { Authorization: `Bearer ${aliToken}` }
    });
    const aliProjects = await aliProjectsRes.json();
    if (aliProjects.projects.length !== 1 || aliProjects.projects[0].id !== 'proj-1') {
      throw new Error(`Ali should only see proj-1, got ${JSON.stringify(aliProjects)}`);
    }

    const aliProjectDetails = await fetch(`${BASE_URL}/api/projects/proj-1`, {
      headers: { Authorization: `Bearer ${aliToken}` }
    });
    const aliDetail = await aliProjectDetails.json();
    // In proj-1 there are 2 tasks (task-1 for Ali, task-2 for Hamza). Ali MUST ONLY see task-1!
    if (aliDetail.tasks.length !== 1 || aliDetail.tasks[0].id !== 'task-1') {
      throw new Error(`Ali must only see his own task in proj-1, but saw: ${JSON.stringify(aliDetail.tasks)}`);
    }
    console.log('✅ Ali strictly sees only his assigned task (task-1) in proj-1');

    // 11. Verify Hamza (DEV02) has tasks in both proj-1 and proj-2
    const hamzaProjectsRes = await fetch(`${BASE_URL}/api/projects`, {
      headers: { Authorization: `Bearer ${hamzaToken}` }
    });
    const hamzaProjects = await hamzaProjectsRes.json();
    if (hamzaProjects.projects.length !== 2) {
      throw new Error(`Hamza should see both projects where he has tasks, got ${hamzaProjects.projects.length}`);
    }
    console.log('✅ Hamza sees both projects spanning his tasks');

    // 12. Non-admin forbidden from reset
    const nonAdminReset = await fetch(`${BASE_URL}/api/projects/reset`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${aliToken}` }
    });
    if (nonAdminReset.status !== 403) throw new Error('Non-admin must be forbidden from reset');
    console.log('✅ Non-admin forbidden (403) from reset');

    // 13. Admin reset works
    const adminReset = await fetch(`${BASE_URL}/api/projects/reset`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    if (adminReset.status !== 200) throw new Error('Admin reset failed');
    console.log('✅ Admin reset succeeded');

    console.log('\n🎉 ALL AUTH & RBAC TESTS PASSED SUCCESSFULLY!');
  } finally {
    server.close();
  }
}

runTests().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
