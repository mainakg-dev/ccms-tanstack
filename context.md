# Project Context: Computer Institute Frontend

## Target Architecture & Tech Stack (For New App)

The new application must be built using the following modern stack and constraints:

- **Framework:** Tanstack Start
- **Language:** TypeScript (Strict Mode enabled)
- **Data Fetching & Server State:** TanStack Query (React Query)
- **Client State Management:** Zustand
- **Forms & Validation:** React Hook Form + Zod
- **Styling & UI:** Tailwind CSS + shadcn/ui
- **Monitoring & Error Tracking:** Sentry
- **Testing Suite:** Vitest, React Testing Library (RTL) for unit/integration, Playwright for E2E, and MSW (Mock Service Worker) for API mocking.
- **Project Structure:** Feature-based folder structure (e.g., grouping components, hooks, api, and types inside `src/features/{featureName}`).

## Exhaustive API Endpoints List

### Authentication & Security

- `POST /loginRoute` - Admin/Center login.
- `POST /studentLogin` - Student portal login.
- `GET /logout` - Clear active auth session.
- `POST /ChangePassword` - Change current user's password.
- `POST /otpInput` - OTP Verification for login/reset.
- `GET /generateSecret` - Generate 2FA secret key.
- `POST /otpVerify` - Verify OTP to enable 2FA.
- `POST /disable2fa` - Disable 2FA.

### Enrollments & Students

- `POST /createEnrollment` - Add a new student.
- `GET /generate-presigned-url` - Get presigned URL for image upload (takes `fileName`, `fileType`, `category` query params).
- `GET /AllEnrollments` - Fetch enrollments list (uses `cursor` and `limit` query params for infinite scrolling).
- `PUT /updateEnrollment` - Update student details.
- `DELETE /Delete_Enrollment` - Delete student enrollment.
- `POST /ActivateEnrollment` - Activate a pending enrollment.
- `POST /deActivateEnrollment` - Deactivate an active enrollment.
- `POST /generateId` - Generate ID card for an activated student.
- `GET /studentData` - Fetch current student's portal data.

### Exams & Marksheets

- `POST /exmformfillupDatafetch` - Fetch student details for exam form validation by EnrollmentNo.
- `POST /examFormFillup` - Submit exam form (requires ATI code, center code, payment receipt).
- `POST /generateadmit` - Generate admit card for a verified exam form.
- `POST /exmmarksentry` - Submit marks (theory/practical) and grades.
- `POST /updateMarksheet` - Edit an existing marksheet.

### Courses & Subjects

- `GET /fetchAllCourseWithSub` - Fetch all courses with nested subjects.
- `POST /createCourse` - Create a new course.
- `PUT /updateCourse` - Edit course details.
- `POST /subjectAdd` - Add a new subject.

### Centers, Franchises & Enquiries

- `GET /All_Center` - Fetch all registered centers/branches.
- `GET /FetchAllEnquiry` - Fetch franchise enquiries.
- `DELETE /deleteEnquiry` - Delete a franchise enquiry.
- `POST /generate_franchise` - Approve enquiry and generate franchise credentials.
- `POST /amountEdit` - Edit a center's course fee/amounts.

### Admin, Coordination & Content

- `GET /Fetch_Coordinator` - Fetch system coordinators.
- `POST /Coordinator_Update` - Update coordinator details.
- `DELETE /Delete_Admin` - Delete an admin user.
- `POST /noticecreate` - Create a new notice board entry.

## Exhaustive Business Rules & Domain Logic

### 1. User Authentication & Roles

- **Roles:** The system enforces strict isolation between three main user roles: `ADMIN`, `CENTER`, and `STUDENT`.

### 2. Student Admission / Entry Workflow

- **Initiation:** Only a `CENTER` can add a new student.
- **Mandatory Fields:** Name, Father's Name, Mother's Name, Address, DOB, Educational Qualification, Category, Course ID, ID Type, ID Proof No, Nationality, Sex, Mobile (exactly 10 digits), Email, Pincode, State, District, Police Station (PS), Post Office (PO), Village (Vill), and Admission Date.
- **Image Upload:** An applicant image (face) must be uploaded. The application requests a pre-signed URL (`/generate-presigned-url?category=face`), uploads the image to that URL via PUT, and then passes the resulting image URL to the enrollment endpoint (`/createEnrollment`).

### 3. Enrollment Verification Workflow

- **Status Lifecycle:** A student's enrollment goes through several status milestones: `Pending` -> `Enrollment Done` -> `Enrollment Verified` -> `Exam Form Verified` -> `Marksheet Verified` -> `Marksheet Approved` -> `PassOut`.
- **Activation:** New enrollments are created in an inactive state. The `ADMIN` must review the enrollment and manually toggle its `activated` status (`/ActivateEnrollment` or `/deActivateEnrollment`).
- **ID Generation:** Only after an enrollment is `activated` can the Admin generate a student ID card (`/generateId`).

### 4. Exam Form Fillup

- **Prerequisite:** The student's enrollment **must** be activated.
- **Form Requirements:** The center must submit the ATI Code, Exam Center Code, and the Last Payment Receipt No.

### 5. Marksheet Entry & Grading Rules

- **Prerequisite:** The Exam Form **must** be verified before a marksheet can be entered.
- **Entry Fields:** The center inputs the passing Year, Date of Publishing, and an overall Remark (`PASS` or `FAIL`).
- **Marks Calculation:**
  - For every subject in the course, the user enters `theoryMarks` and `practicalMarks`.
  - `Total Obtained Marks` = Sum of all `theoryMarks` + Sum of all `practicalMarks`
  - `Total Full Marks` = Sum of all `theoryFullMarks` + Sum of all `practicalFullMarks`
  - `Percentage` = `(Total Obtained Marks / Total Full Marks) * 100` (rounded to 2 decimal places).
- **Grading Scale Algorithm:**
  - `>= 90%` = **AA**
  - `>= 80%` = **A+**
  - `>= 70%` = **A**
  - `>= 60%` = **B+**
  - `>= 50%` = **B**
  - `>= 40%` = **C**
  - `< 40%` = **D**
