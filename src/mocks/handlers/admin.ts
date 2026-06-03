import { http, HttpResponse, delay } from 'msw';
import { mockCoordinators } from '../data';
import type { CoordinatorUpdateData, NoticeFormData } from '../../features/admin/types';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Mutable copy for CRUD operations
let coordinators = [...mockCoordinators];

let notices = [
  {
    id: 'ntc_1',
    title: 'Upcoming Semester Examinations Schedule',
    content: 'The examinations for the current semester are scheduled to start from July 10, 2026. All students must submit their exam form by June 30.',
    createdAt: '2026-06-01T09:00:00Z',
  },
  {
    id: 'ntc_2',
    title: 'New Course Added: Full Stack Web Development',
    content: 'We are excited to launch our new 6-month Full Stack Web Development course. Admissions are open starting today. Contact your nearest center for fee details.',
    createdAt: '2026-05-28T14:30:00Z',
  },
  {
    id: 'ntc_3',
    title: 'Portal Maintenance Notice',
    content: 'The CCMS portal will undergo brief scheduled maintenance and server upgrade on Sunday, June 15, from 2:00 AM to 4:00 AM. Please save your work.',
    createdAt: '2026-05-25T10:00:00Z',
  },
];

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

  // GET /Fetch_Notices
  http.get(`${BASE_URL}/Fetch_Notices`, async () => {
    await delay(300);
    return HttpResponse.json(notices);
  }),

  // POST /noticecreate
  http.post(`${BASE_URL}/noticecreate`, async ({ request }) => {
    await delay(400);
    const body = (await request.json()) as NoticeFormData;

    const newNotice = {
      id: `ntc_${Date.now()}`,
      title: body.title,
      content: body.content,
      createdAt: new Date().toISOString(),
    };
    notices = [newNotice, ...notices];

    return HttpResponse.json({
      message: 'Notice created successfully',
      notice: newNotice,
    });
  }),
];
