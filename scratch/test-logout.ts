import { usersService } from '../src/services/users-service';
import { db } from '../src/db';
import { users, sessions } from '../src/db/schema';
import { eq } from 'drizzle-orm';

async function test() {
  console.log('Testing Logout User API...');

  // 1. Create a dummy user
  const email = `test-logout-${Date.now()}@example.com`;
  await usersService.registerUser({
    name: 'Test Logout User',
    email: email,
    password: 'password123'
  });

  // 2. Login to get token
  const loginResult = await usersService.loginUser({
    email: email,
    password: 'password123'
  });

  if (loginResult.error) {
    console.error('Login failed:', loginResult.error);
    process.exit(1);
  }

  const token = loginResult.data as string;
  console.log('Got token:', token);

  // 3. Verify session exists in DB
  const sessionBefore = await db.query.sessions.findFirst({
    where: eq(sessions.token, token),
  });
  if (sessionBefore) {
    console.log('✅ Session exists in DB before logout.');
  } else {
    console.error('❌ Session does not exist in DB before logout.');
    process.exit(1);
  }

  // 4. Test logoutUser service method
  const logoutResult = await usersService.logoutUser(token);
  if (logoutResult.data === 'OK') {
    console.log('✅ Service test passed: Logout returned OK.');
  } else {
    console.error('❌ Service test failed:', logoutResult);
    process.exit(1);
  }

  // 5. Verify session deleted from DB
  const sessionAfter = await db.query.sessions.findFirst({
    where: eq(sessions.token, token),
  });
  if (!sessionAfter) {
    console.log('✅ Session deleted from DB after logout.');
  } else {
    console.error('❌ Session still exists in DB after logout.');
    process.exit(1);
  }

  // 6. Test with already deleted token
  const invalidResult = await usersService.logoutUser(token);
  if (invalidResult.error === 'Unauthorized') {
    console.log('✅ Service test passed: Logout for non-existent token handled correctly.');
  } else {
    console.error('❌ Service test failed for non-existent token:', invalidResult);
    process.exit(1);
  }

  // Cleanup user
  const user = await db.query.users.findFirst({ where: eq(users.email, email) });
  if (user) {
    await db.delete(users).where(eq(users.id, user.id));
    console.log('Cleanup complete.');
  }

  console.log('All tests passed!');
  process.exit(0);
}

test().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
