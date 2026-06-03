import { http, HttpResponse, delay } from 'msw';
import { mockEnrollments } from '../data';
import { mockCourses } from '../data';
import type { ExamFormFillupData, MarksEntryData } from '../../features/exams/types';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const examHandlers = [
  // POST /exmformfillupDatafetch
  http.post(`${BASE_URL}/exmformfillupDatafetch`, async ({ request }) => {
    await delay(400);
    const body = (await request.json()) as { enrollmentNo: string };

    const enrollment = mockEnrollments.find(
      (e) => e.enrollmentNo === body.enrollmentNo,
    );

    if (!enrollment) {
      return HttpResponse.json(
        { message: 'Student not found' },
        { status: 404 },
      );
    }

    const course = mockCourses.find((c) => c.id === enrollment.courseId);

    return HttpResponse.json({
      enrollmentNo: enrollment.enrollmentNo,
      name: enrollment.name,
      courseName: enrollment.courseName,
      courseId: enrollment.courseId,
      activated: enrollment.activated,
      subjects: course?.subjects || [],
    });
  }),

  // POST /examFormFillup
  http.post(`${BASE_URL}/examFormFillup`, async ({ request }) => {
    await delay(500);
    const body = (await request.json()) as ExamFormFillupData;

    const enrollment = mockEnrollments.find(
      (e) => e.enrollmentNo === body.enrollmentNo,
    );

    if (!enrollment) {
      return HttpResponse.json(
        { message: 'Enrollment not found' },
        { status: 404 },
      );
    }

    if (!enrollment.activated) {
      return HttpResponse.json(
        { message: 'Student is not activated yet' },
        { status: 400 },
      );
    }

    return HttpResponse.json({
      message: 'Exam form submitted successfully',
      examFormId: `EXF-${Date.now()}`,
      data: body,
    });
  }),

  // POST /generateadmit
  http.post(`${BASE_URL}/generateadmit`, async ({ request }) => {
    await delay(600);
    const body = (await request.json()) as { enrollmentNo: string };

    const enrollment = mockEnrollments.find(
      (e) => e.enrollmentNo === body.enrollmentNo,
    );

    if (!enrollment) {
      return HttpResponse.json(
        { message: 'Student not found' },
        { status: 404 },
      );
    }

    return HttpResponse.json({
      message: 'Admit card generated successfully',
      admitCardUrl: `https://example.com/admit-cards/${body.enrollmentNo}.pdf`,
    });
  }),

  // POST /exmmarksentry
  http.post(`${BASE_URL}/exmmarksentry`, async ({ request }) => {
    await delay(500);
    const body = (await request.json()) as MarksEntryData;

    const enrollment = mockEnrollments.find(
      (e) => e.enrollmentNo === body.enrollmentNo,
    );

    if (!enrollment) {
      return HttpResponse.json(
        { message: 'Enrollment not found' },
        { status: 404 },
      );
    }

    return HttpResponse.json({
      message: 'Marks entered successfully',
      marksheetId: `MS-${Date.now()}`,
      data: body,
    });
  }),

  // POST /updateMarksheet
  http.post(`${BASE_URL}/updateMarksheet`, async ({ request }) => {
    await delay(400);
    const body = (await request.json()) as MarksEntryData;

    return HttpResponse.json({
      message: 'Marksheet updated successfully',
      data: body,
    });
  }),
];
