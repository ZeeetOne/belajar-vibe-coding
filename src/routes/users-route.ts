import { Elysia, t } from 'elysia';
import { usersService } from '../services/users-service';
import { auth } from '../middlewares/auth';

export const usersRoute = new Elysia({ prefix: '/api/users' })
  .post('/', async ({ body, set }) => {
    const result = await usersService.registerUser(body);

    if (result.error) {
      set.status = 400;
      return result;
    }

    return result;
  }, {
    body: t.Object({
      name: t.String(),
      email: t.String({ format: 'email' }),
      password: t.String(),
    })
  })
  .post('/login', async ({ body, set }) => {
    const result = await usersService.loginUser(body);

    if (result.error) {
      set.status = 401; // Unauthorized
      return result;
    }

    return result;
  }, {
    body: t.Object({
      email: t.String({ format: 'email' }),
      password: t.String(),
    })
  })
  .use(auth)
  .get('/current', async ({ token, unauthorized }) => {
    if (!token) return unauthorized();

    const result = await usersService.getCurrentUser(token);

    if (result.error) {
      return unauthorized();
    }

    return result;
  })
  .delete('/logout', async ({ token, unauthorized }) => {
    if (!token) return unauthorized();

    const result = await usersService.logoutUser(token);

    if (result.error) {
      return unauthorized();
    }

    return result;
  });
