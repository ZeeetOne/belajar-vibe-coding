import { Elysia } from 'elysia';

export const auth = new Elysia({ name: 'auth' })
  .derive(({ headers, set }) => {
    const authHeader = headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        token: null,
        unauthorized: () => {
          set.status = 401;
          return { error: 'Unauthorized' };
        }
      };
    }

    const token = authHeader.split(' ')[1];

    return {
      token,
      unauthorized: () => {
        set.status = 401;
        return { error: 'Unauthorized' };
      }
    };
  });
