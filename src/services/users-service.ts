import { db } from '../db';
import { users, sessions } from '../db/schema';
import { eq } from 'drizzle-orm';

export interface RegisterUserPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginUserPayload {
  email: string;
  password: string;
}

export const usersService = {
  async registerUser(payload: RegisterUserPayload) {
    const { name, email, password } = payload;

    // 1. Check if email already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      return { error: 'Email sudah terdaftar' };
    }

    // 2. Hash password using Bun.password (bcrypt)
    const hashedPassword = await Bun.password.hash(password, {
      algorithm: 'bcrypt',
      cost: 10,
    });

    // 3. Insert user into database
    await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
    });

    return { data: 'OK' };
  },

  async loginUser(payload: LoginUserPayload) {
    const { email, password } = payload;

    // 1. Find user by email
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      return { error: 'Email atau password salah' };
    }

    // 2. Verify password
    const isPasswordValid = await Bun.password.verify(password, user.password);

    if (!isPasswordValid) {
      return { error: 'Email atau password salah' };
    }

    // 3. Generate session token (UUID)
    const token = crypto.randomUUID();

    // 4. Save session to database
    await db.insert(sessions).values({
      token,
      userId: user.id,
    });

    return { data: token };
  },
};
