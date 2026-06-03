import { http, HttpResponse, delay } from 'msw';
import { mockCoordinators } from '../data';
import type { CoordinatorUpdateData, NoticeFormData } from '../../features/admin/types';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Mutable copy for CRUD operations
let coordinators = [...mockCoordinators];

export const adminHandlers = [
  // GET /Fetch_Coordinator
  http.get(`${BASE_URL}/Fetch_Coordinator`, async () => {
    await delay(300);
    return HttpResponse.json(coordinators);
  }),

  // POST /Coordinator_Update
  http.post(`${BASE_URL}/Coordinator_Update`, async ({ request }) => {
    await delay(400);
    const body = (await request.json()) as CoordinatorUpdateData;

    const index = coordinators.findIndex((c) => c.id === body.id);
    if (index === -1) {
      return HttpResponse.json(
        { message: 'Coordinator not found' },
        { status: 404 },
      );
    }

    coordinators = coordinators.map((c) =>
      c.id === body.id
        ? { ...c, name: body.name, email: body.email, mobile: body.mobile }
        : c,
    );

    return HttpResponse.json({
      message: 'Coordinator updated successfully',
      coordinator: coordinators.find((c) => c.id === body.id),
    });
  }),

  // DELETE /Delete_Admin
  http.delete(`${BASE_URL}/Delete_Admin`, async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as { id: string };

    const index = coordinators.findIndex((c) => c.id === body.id);
    if (index === -1) {
      return HttpResponse.json(
        { message: 'Admin/Coordinator not found' },
        { status: 404 },
      );
    }

    coordinators = coordinators.filter((c) => c.id !== body.id);
    return HttpResponse.json({ message: 'Admin deleted successfully' });
  }),

  // POST /noticecreate
  http.post(`${BASE_URL}/noticecreate`, async ({ request }) => {
    await delay(400);
    const body = (await request.json()) as NoticeFormData;

    return HttpResponse.json({
      message: 'Notice created successfully',
      notice: {
        id: `ntc_${Date.now()}`,
        title: body.title,
        content: body.content,
        createdAt: new Date().toISOString(),
      },
    });
  }),
];
