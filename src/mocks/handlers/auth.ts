import { http, HttpResponse, delay } from 'msw';
import { mockUsers } from '../data';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const authHandlers = [
  // POST /loginRoute
  http.post(`${BASE_URL}/loginRoute`, async ({ request }) => {
    await delay(400);
    const body = (await request.json()) as { email: string; password: string };

    const user = mockUsers[body.email];
    if (!user || user.password !== body.password) {
      return HttpResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 },
      );
    }

    return HttpResponse.json(user.response);
  }),

  // GET /logout
  http.get(`${BASE_URL}/logout`, async () => {
    await delay(200);
    return HttpResponse.json({ message: 'Logged out successfully' });
  }),

  // POST /ChangePassword
  http.post(`${BASE_URL}/ChangePassword`, async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as {
      currentPassword: string;
      newPassword: string;
    };

    if (body.currentPassword === 'wrongpassword') {
      return HttpResponse.json(
        { message: 'Current password is incorrect' },
        { status: 400 },
      );
    }

    return HttpResponse.json({ message: 'Password changed successfully' });
  }),
];
