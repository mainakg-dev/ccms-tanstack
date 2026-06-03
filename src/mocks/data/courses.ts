import type { Course } from '../../features/courses/types';

export const mockCourses: Course[] = [
  {
    id: 'crs_001',
    courseName: 'Diploma in Computer Application (DCA)',
    duration: '6 Months',
    courseCode: 'DCA-101',
    subjects: [
      { id: 'sub_001', subjectName: 'Computer Fundamentals', theoryFullMarks: 100, practicalFullMarks: 50 },
      { id: 'sub_002', subjectName: 'MS Office', theoryFullMarks: 80, practicalFullMarks: 70 },
      { id: 'sub_003', subjectName: 'Internet & Email', theoryFullMarks: 60, practicalFullMarks: 40 },
    ],
    createdAt: '2024-01-10T10:00:00Z',
  },
  {
    id: 'crs_002',
    courseName: 'Advanced Diploma in Computer Application (ADCA)',
    duration: '1 Year',
    courseCode: 'ADCA-201',
    subjects: [
      { id: 'sub_004', subjectName: 'Programming in C', theoryFullMarks: 100, practicalFullMarks: 100 },
      { id: 'sub_005', subjectName: 'Database Management', theoryFullMarks: 80, practicalFullMarks: 70 },
      { id: 'sub_006', subjectName: 'Web Technologies', theoryFullMarks: 80, practicalFullMarks: 70 },
      { id: 'sub_007', subjectName: 'Tally ERP', theoryFullMarks: 60, practicalFullMarks: 90 },
    ],
    createdAt: '2024-01-12T10:00:00Z',
  },
  {
    id: 'crs_003',
    courseName: 'Certificate in Web Development',
    duration: '3 Months',
    courseCode: 'CWD-301',
    subjects: [
      { id: 'sub_008', subjectName: 'HTML & CSS', theoryFullMarks: 50, practicalFullMarks: 100 },
      { id: 'sub_009', subjectName: 'JavaScript', theoryFullMarks: 60, practicalFullMarks: 90 },
    ],
    createdAt: '2024-02-05T10:00:00Z',
  },
  {
    id: 'crs_004',
    courseName: 'Diploma in Hardware & Networking',
    duration: '6 Months',
    courseCode: 'DHN-401',
    subjects: [
      { id: 'sub_010', subjectName: 'Computer Hardware', theoryFullMarks: 100, practicalFullMarks: 100 },
      { id: 'sub_011', subjectName: 'Networking Fundamentals', theoryFullMarks: 80, practicalFullMarks: 70 },
      { id: 'sub_012', subjectName: 'Linux Administration', theoryFullMarks: 60, practicalFullMarks: 90 },
    ],
    createdAt: '2024-03-01T10:00:00Z',
  },
  {
    id: 'crs_005',
    courseName: 'Certificate in Python Programming',
    duration: '3 Months',
    courseCode: 'CPP-501',
    subjects: [
      { id: 'sub_013', subjectName: 'Python Basics', theoryFullMarks: 80, practicalFullMarks: 70 },
      { id: 'sub_014', subjectName: 'Data Structures with Python', theoryFullMarks: 100, practicalFullMarks: 100 },
    ],
    createdAt: '2024-04-15T10:00:00Z',
  },
];
