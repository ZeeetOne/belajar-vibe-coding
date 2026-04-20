import { Elysia, t } from 'elysia';
import { db } from './db';
import { users, selectUserSchema, insertUserSchema } from './db/schema';

const app = new Elysia()
  .decorate('db', db)
  .get('/', () => ({ message: 'Welcome to ElysiaJS + Drizzle + MySQL!' }))
  .group('/users', (app) =>
    app
      .get('/', async ({ db }) => {
        return await db.select().from(users);
      })
      .post('/', async ({ db, body }) => {
        const result = await db.insert(users).values(body);
        return { success: true, id: result[0].insertId };
      }, {
        body: insertUserSchema
      })
  )
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
