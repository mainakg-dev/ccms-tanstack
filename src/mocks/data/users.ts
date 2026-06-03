import type { AuthResponse } from "../../features/auth/types";

export const mockUsers: Record<
  string,
  { password: string; response: AuthResponse }
> = {
  "mainak.g@gbserp.com": {
    password: "admin123",
    response: {
      user: {
        id: "usr_admin_001",
        email: "mainak.g@gbserp.com",
        name: "Dr. Rajesh Kumar",
        role: "ADMIN",
      },
      token: "mock-jwt-token-admin-001",
    },
  },
  "center@institute.com": {
    password: "center123",
    response: {
      user: {
        id: "usr_center_001",
        email: "center@institute.com",
        name: "Anita Desai",
        role: "CENTER",
      },
      token: "mock-jwt-token-center-001",
    },
  },
  "student@institute.com": {
    password: "student123",
    response: {
      user: {
        id: "usr_student_001",
        email: "student@institute.com",
        name: "Priya Sharma",
        role: "STUDENT",
      },
      token: "mock-jwt-token-student-001",
    },
  },
};
