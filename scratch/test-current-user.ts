import { usersService } from '../src/services/users-service';
import { db } from '../src/db';
import { users, sessions } from '../src/db/schema';
import { eq } from 'drizzle-orm';

async function test() {
  console.log('Testing Get Current User API...');

  // 1. Create a dummy user
  const email = `test-${Date.now()}@example.com`;
  await usersService.registerUser({
    name: 'Test User',
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

  const token = loginResult.data;
  console.log('Got token:', token);

  // 3. Test getCurrentUser service method directly
  const userResult = await usersService.getCurrentUser(token);
  if (userResult.data && userResult.data.email === email) {
    console.log('✅ Service test passed: User found correctly.');
  } else {
    console.error('❌ Service test failed:', userResult);
    process.exit(1);
  }

  // 4. Test with invalid token
  const invalidResult = await usersService.getCurrentUser('invalid-token');
  if (invalidResult.error === 'Unauthorized') {
    console.log('✅ Service test passed: Invalid token handled correctly.');
  } else {
    console.error('❌ Service test failed for invalid token:', invalidResult);
    process.exit(1);
  }

  // Cleanup (optional but good)
  // Find user id to delete
  const user = await db.query.users.findFirst({ where: eq(users.email, email) });
  if (user) {
    await db.delete(sessions).where(eq(sessions.userId, user.id));
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
