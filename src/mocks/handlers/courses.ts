import { http, HttpResponse, delay } from 'msw';
import { mockCourses } from '../data';
import type { CourseFormData, AddSubjectData } from '../../features/courses/types';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Mutable copy for CRUD operations
let courses = [...mockCourses];

export const courseHandlers = [
  // GET /fetchAllCourseWithSub
  http.get(`${BASE_URL}/fetchAllCourseWithSub`, async () => {
    await delay(300);
    return HttpResponse.json(courses);
  }),

  // POST /createCourse
  http.post(`${BASE_URL}/createCourse`, async ({ request }) => {
    await delay(400);
    const body = (await request.json()) as CourseFormData;

    const newCourse = {
      id: `crs_${Date.now()}`,
      courseName: body.courseName,
      duration: body.duration,
      courseCode: body.courseCode || `NEW-${String(courses.length + 1).padStart(3, '0')}`,
      subjects: body.subjects || [],
      createdAt: new Date().toISOString(),
    };

    courses = [...courses, newCourse];
    return HttpResponse.json(newCourse, { status: 201 });
  }),

  // PUT /updateCourse
  http.put(`${BASE_URL}/updateCourse`, async ({ request }) => {
    await delay(400);
    const body = (await request.json()) as CourseFormData;

    if (!body.id) {
      return HttpResponse.json(
        { message: 'Course ID is required' },
        { status: 400 },
      );
    }

    const index = courses.findIndex((c) => c.id === body.id);
    if (index === -1) {
      return HttpResponse.json(
        { message: 'Course not found' },
        { status: 404 },
      );
    }

    courses = courses.map((c) =>
      c.id === body.id
        ? {
            ...c,
            courseName: body.courseName,
            duration: body.duration,
            courseCode: body.courseCode || c.courseCode,
            subjects: body.subjects || c.subjects,
          }
        : c,
    );

    return HttpResponse.json(courses[index]);
  }),

  // POST /subjectAdd
  http.post(`${BASE_URL}/subjectAdd`, async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as AddSubjectData;

    const courseIndex = courses.findIndex((c) => c.id === body.courseId);
    if (courseIndex === -1) {
      return HttpResponse.json(
        { message: 'Course not found' },
        { status: 404 },
      );
    }

    const newSubject = {
      id: `sub_${Date.now()}`,
      subjectName: body.subjectName,
      theoryFullMarks: body.theoryFullMarks,
      practicalFullMarks: body.practicalFullMarks,
    };

    courses = courses.map((c) =>
      c.id === body.courseId
        ? { ...c, subjects: [...c.subjects, newSubject] }
        : c,
    );

    return HttpResponse.json(newSubject, { status: 201 });
  }),
];
