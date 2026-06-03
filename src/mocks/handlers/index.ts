import { authHandlers } from './auth';
import { centerHandlers } from './centers';
import { courseHandlers } from './courses';
import { enrollmentHandlers } from './enrollments';
import { examHandlers } from './exams';
import { adminHandlers } from './admin';

export const handlers = [
  ...authHandlers,
  ...centerHandlers,
  ...courseHandlers,
  ...enrollmentHandlers,
  ...examHandlers,
  ...adminHandlers,
];
