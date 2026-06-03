import { http, HttpResponse, delay } from 'msw';
import { mockEnrollments } from '../data';
import type { Enrollment } from '../../features/enrollments/api';
import type { EnrollmentFormData } from '../../features/enrollments/types';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Mutable copy for CRUD operations
let enrollments: Enrollment[] = [...mockEnrollments];

export const enrollmentHandlers = [
  // GET /AllEnrollments (paginated with cursor)
  http.get(`${BASE_URL}/AllEnrollments`, async ({ request }) => {
    await delay(400);
    const url = new URL(request.url);
    const cursor = url.searchParams.get('cursor');
    const limit = parseInt(url.searchParams.get('limit') || '20', 10);

    let startIndex = 0;
    if (cursor) {
      const cursorIndex = enrollments.findIndex((e) => e.id === cursor);
      startIndex = cursorIndex >= 0 ? cursorIndex + 1 : 0;
    }

    const page = enrollments.slice(startIndex, startIndex + limit);
    const nextCursor =
      startIndex + limit < enrollments.length
        ? enrollments[startIndex + limit - 1]?.id ?? null
        : null;

    return HttpResponse.json({
      enrollments: page,
      nextCursor,
    });
  }),

  // POST /createEnrollment
  http.post(`${BASE_URL}/createEnrollment`, async ({ request }) => {
    await delay(500);
    const body = (await request.json()) as EnrollmentFormData;

    const enrollmentNo = `EN-2025-${String(enrollments.length + 1).padStart(3, '0')}`;
    const newEnrollment: Enrollment = {
      id: `enr_${Date.now()}`,
      enrollmentNo,
      name: body.name,
      fatherName: body.fatherName,
      motherName: body.motherName,
      email: body.email,
      mobile: body.mobile,
      dob: body.dob,
      address: body.address,
      courseName: 'Assigned Course',
      courseId: body.courseId,
      status: 'PENDING',
      activated: false,
      imageUrl: body.imageUrl,
      admissionDate: body.admissionDate,
      createdAt: new Date().toISOString(),
    };

    enrollments = [newEnrollment, ...enrollments];
    return HttpResponse.json(newEnrollment, { status: 201 });
  }),

  // PUT /updateEnrollment
  http.put(`${BASE_URL}/updateEnrollment`, async ({ request }) => {
    await delay(400);
    const body = (await request.json()) as Partial<EnrollmentFormData> & { id: string };

    const index = enrollments.findIndex((e) => e.id === body.id);
    if (index === -1) {
      return HttpResponse.json(
        { message: 'Enrollment not found' },
        { status: 404 },
      );
    }

    enrollments = enrollments.map((e) =>
      e.id === body.id ? { ...e, ...body } : e,
    );

    return HttpResponse.json(enrollments.find((e) => e.id === body.id));
  }),

  // DELETE /Delete_Enrollment
  http.delete(`${BASE_URL}/Delete_Enrollment`, async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as { id: string };

    const index = enrollments.findIndex((e) => e.id === body.id);
    if (index === -1) {
      return HttpResponse.json(
        { message: 'Enrollment not found' },
        { status: 404 },
      );
    }

    enrollments = enrollments.filter((e) => e.id !== body.id);
    return HttpResponse.json({ message: 'Enrollment deleted successfully' });
  }),

  // POST /ActivateEnrollment
  http.post(`${BASE_URL}/ActivateEnrollment`, async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as { id: string };

    enrollments = enrollments.map((e) =>
      e.id === body.id ? { ...e, activated: true, status: 'ACTIVE' } : e,
    );

    return HttpResponse.json({ message: 'Enrollment activated' });
  }),

  // POST /deActivateEnrollment
  http.post(`${BASE_URL}/deActivateEnrollment`, async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as { id: string };

    enrollments = enrollments.map((e) =>
      e.id === body.id ? { ...e, activated: false, status: 'INACTIVE' } : e,
    );

    return HttpResponse.json({ message: 'Enrollment deactivated' });
  }),

  // POST /generateId
  http.post(`${BASE_URL}/generateId`, async ({ request }) => {
    await delay(600);
    const body = (await request.json()) as { enrollmentNo: string };

    const enrollment = enrollments.find(
      (e) => e.enrollmentNo === body.enrollmentNo,
    );
    if (!enrollment) {
      return HttpResponse.json(
        { message: 'Enrollment not found' },
        { status: 404 },
      );
    }

    return HttpResponse.json({
      message: 'ID Card generated successfully',
      idCardUrl: `https://example.com/id-cards/${body.enrollmentNo}.pdf`,
    });
  }),

  // GET /generate-presigned-url
  http.get(`${BASE_URL}/generate-presigned-url`, async ({ request }) => {
    await delay(300);
    const url = new URL(request.url);
    const fileName = url.searchParams.get('fileName') || 'upload.jpg';
    const category = url.searchParams.get('category') || 'face';

    const key = `${category}/${Date.now()}-${fileName}`;

    return HttpResponse.json({
      url: `https://mock-s3-bucket.s3.amazonaws.com/${key}?X-Amz-Algorithm=mock&X-Amz-Signature=mock`,
      key,
    });
  }),
];
