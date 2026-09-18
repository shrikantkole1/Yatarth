/**
 * Yatarth AI — API Service Client
 */

export interface InspectionFilterParams {
  inspector_id?: string;
  status?: string;
  q?: string;
  page?: number;
  limit?: number;
}

export async function getInspectionsApi(params?: InspectionFilterParams) {
  const query = new URLSearchParams();
  if (params?.inspector_id) query.append('inspector_id', params.inspector_id);
  if (params?.status) query.append('status', params.status);
  if (params?.q) query.append('q', params.q);

  try {
    const res = await fetch(`/api/inspections?${query.toString()}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('API connection offline, returning fallback data');
    return { inspections: [], total: 0 };
  }
}

export async function createInspectionApi(data: {
  inspector_id: string;
  inspector_name: string;
  product_name: string;
  category: string;
  batch_number?: string;
  image?: string;
}) {
  const res = await fetch('/api/inspections', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create inspection record');
  return await res.json();
}

export async function confirmViewUploadApi(id: string, view: string, image_url: string) {
  const res = await fetch(`/api/inspections/${id}/views/${view}/confirm`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image_url }),
  });
  if (!res.ok) throw new Error(`Failed to confirm view upload for ${view}`);
  return await res.json();
}

export async function submitInspectionApi(id: string) {
  const res = await fetch(`/api/inspections/${id}/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  if (!res.ok) throw new Error('Failed to submit inspection');
  return await res.json();
}

export async function getInspectionByIdApi(id: string) {
  const res = await fetch(`/api/inspections/${id}`);
  if (!res.ok) throw new Error('Failed to fetch inspection details');
  return await res.json();
}

export async function getInspectionStatusApi(id: string) {
  const res = await fetch(`/api/inspections/${id}/status`);
  if (!res.ok) throw new Error('Failed to fetch status');
  return await res.json();
}

// ─── Citizen Complaints API ──────────────────────────────────────────────────
export async function getComplaintsApi() {
  try {
    const res = await fetch('/api/complaints');
    if (!res.ok) throw new Error('Failed to fetch complaints');
    return await res.json();
  } catch (err) {
    console.warn('Complaints API offline fallback');
    return [];
  }
}

export async function createComplaintApi(data: {
  citizen_name?: string;
  citizen_email?: string;
  product_name: string;
  category?: string;
  store_location?: string;
  region?: string;
  violations?: Array<{ rule_id: string; description: string; severity?: string }>;
  evidence_image_url?: string;
  inspection_id?: string;
}) {
  const res = await fetch('/api/complaints', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to submit citizen complaint');
  return await res.json();
}

export async function updateComplaintStatusApi(id: string, status: string, action_taken?: string) {
  const res = await fetch(`/api/complaints/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, action_taken }),
  });
  if (!res.ok) throw new Error('Failed to update complaint status');
  return await res.json();
}
