import { Elysia, t } from 'elysia';
import { db } from './db';
import { usersRoute } from './routes/users-route';

const app = new Elysia()
  .decorate('db', db)
  .get('/', () => ({ message: 'Welcome to ElysiaJS + Drizzle + MySQL!' }))
  .use(usersRoute)
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
