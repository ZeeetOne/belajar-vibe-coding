import { mysqlTable, serial, varchar, timestamp, bigint } from 'drizzle-orm/mysql-core';
import { createSelectSchema, createInsertSchema } from 'drizzle-typebox';

export const users = mysqlTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

export const sessions = mysqlTable('sessions', {
  id: serial('id').primaryKey(),
  token: varchar('token', { length: 255 }).notNull(),
  userId: bigint('user_id', { mode: 'number', unsigned: true }).notNull().references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// TypeBox schemas for validation
export const selectUserSchema = createSelectSchema(users);
export const insertUserSchema = createInsertSchema(users);
export const insertSessionSchema = createInsertSchema(sessions);
