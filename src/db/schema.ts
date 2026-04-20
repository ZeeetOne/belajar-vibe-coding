import { mysqlTable, serial, varchar, timestamp } from 'drizzle-orm/mysql-core';
import { createSelectSchema, createInsertSchema } from 'drizzle-typebox';

export const users = mysqlTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

// TypeBox schemas for validation
export const selectUserSchema = createSelectSchema(users);
export const insertUserSchema = createInsertSchema(users);
