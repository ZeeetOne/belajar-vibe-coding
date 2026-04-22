import { Elysia, t } from 'elysia';
import { usersService } from '../services/users-service';

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
  .get('/current', async ({ headers, set }) => {
    const authHeader = headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      set.status = 401;
      return { error: 'Unauthorized' };
    }

    const token = authHeader.split(' ')[1];
    const result = await usersService.getCurrentUser(token);

    if (result.error) {
      set.status = 401;
      return result;
    }

    return result;
  });
