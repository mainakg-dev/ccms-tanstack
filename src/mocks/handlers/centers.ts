import { http, HttpResponse, delay } from 'msw';
import { mockCenters, mockEnquiries } from '../data';
import type { AmountEditData } from '../../features/centers/types';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Mutable copies for CRUD operations
let centers = [...mockCenters];
let enquiries = [...mockEnquiries];

export const centerHandlers = [
  // GET /All_Center
  http.get(`${BASE_URL}/All_Center`, async () => {
    await delay(300);
    return HttpResponse.json(centers);
  }),

  // GET /FetchAllEnquiry
  http.get(`${BASE_URL}/FetchAllEnquiry`, async () => {
    await delay(300);
    return HttpResponse.json(enquiries);
  }),

  // DELETE /deleteEnquiry
  http.delete(`${BASE_URL}/deleteEnquiry`, async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as { id: string };
    const index = enquiries.findIndex((e) => e.id === body.id);

    if (index === -1) {
      return HttpResponse.json(
        { message: 'Enquiry not found' },
        { status: 404 },
      );
    }

    enquiries = enquiries.filter((e) => e.id !== body.id);
    return HttpResponse.json({ message: 'Enquiry deleted successfully' });
  }),

  // POST /generate_franchise
  http.post(`${BASE_URL}/generate_franchise`, async ({ request }) => {
    await delay(500);
    const body = (await request.json()) as { enquiryId: string };
    const enquiry = enquiries.find((e) => e.id === body.enquiryId);

    if (!enquiry) {
      return HttpResponse.json(
        { message: 'Enquiry not found' },
        { status: 404 },
      );
    }

    // Update enquiry status
    enquiries = enquiries.map((e) =>
      e.id === body.enquiryId ? { ...e, status: 'APPROVED' as const } : e,
    );

    // Create a new center from the enquiry
    const newCenter = {
      id: `ctr_${Date.now()}`,
      centerName: `${enquiry.name}'s Center`,
      centerCode: `NEW-${String(centers.length + 1).padStart(3, '0')}`,
      address: enquiry.address,
      email: enquiry.email,
      mobile: enquiry.mobile,
      activated: false,
      createdAt: new Date().toISOString(),
    };
    centers = [...centers, newCenter];

    return HttpResponse.json({
      message: 'Franchise generated successfully',
      center: newCenter,
    });
  }),

  // POST /amountEdit
  http.post(`${BASE_URL}/amountEdit`, async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as AmountEditData;

    const center = centers.find((c) => c.id === body.centerId);
    if (!center) {
      return HttpResponse.json(
        { message: 'Center not found' },
        { status: 404 },
      );
    }

    return HttpResponse.json({
      message: 'Amount updated successfully',
      data: body,
    });
  }),
];
