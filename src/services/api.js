const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

async function getAuthToken() {
  // Get token from Clerk session
  if (window.Clerk?.session) {
    try {
      return await window.Clerk.session.getToken();
    } catch (err) {
      console.error('Failed to get auth token:', err);
      return null;
    }
  }
  return null;
}

async function fetchWithErrorHandling(url, options = {}) {
  const token = await getAuthToken();

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = new Error(`API error: ${response.status} ${response.statusText}`);
    error.status = response.status;
    throw error;
  }

  // Handle 204 No Content responses
  if (response.status === 204) {
    return null;
  }

  return response.json();
}

// Phase API
export const phaseApi = {
  getAll: () => fetchWithErrorHandling(`${API_BASE_URL}/phases`),

  getById: (id) => fetchWithErrorHandling(`${API_BASE_URL}/phases/${id}`),

  create: (data) => fetchWithErrorHandling(`${API_BASE_URL}/phases`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  update: (id, data) => fetchWithErrorHandling(`${API_BASE_URL}/phases/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  delete: (id) => fetchWithErrorHandling(`${API_BASE_URL}/phases/${id}`, {
    method: 'DELETE',
  }),
};

// Strategic Project API
export const projectApi = {
  getByPhase: (phaseId) => fetchWithErrorHandling(`${API_BASE_URL}/phases/${phaseId}/projects`),

  getById: (id) => fetchWithErrorHandling(`${API_BASE_URL}/projects/${id}`),

  create: (phaseId, data) => fetchWithErrorHandling(`${API_BASE_URL}/phases/${phaseId}/projects`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  update: (id, data) => fetchWithErrorHandling(`${API_BASE_URL}/projects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  updateStackRank: (id, stackRank) => fetchWithErrorHandling(`${API_BASE_URL}/projects/${id}/stack-rank`, {
    method: 'PUT',
    body: JSON.stringify({ stackRank }),
  }),

  delete: (id) => fetchWithErrorHandling(`${API_BASE_URL}/projects/${id}`, {
    method: 'DELETE',
  }),
};

// Team API
export const teamApi = {
  getAll: () => fetchWithErrorHandling(`${API_BASE_URL}/teams`),

  getById: (id) => fetchWithErrorHandling(`${API_BASE_URL}/teams/${id}`),

  create: (data) => fetchWithErrorHandling(`${API_BASE_URL}/teams`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  update: (id, data) => fetchWithErrorHandling(`${API_BASE_URL}/teams/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  delete: (id) => fetchWithErrorHandling(`${API_BASE_URL}/teams/${id}`, {
    method: 'DELETE',
  }),
};

// Staff API
export const staffApi = {
  getAll: () => fetchWithErrorHandling(`${API_BASE_URL}/staff`),

  getById: (id) => fetchWithErrorHandling(`${API_BASE_URL}/staff/${id}`),

  create: (data) => fetchWithErrorHandling(`${API_BASE_URL}/staff`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  update: (id, data) => fetchWithErrorHandling(`${API_BASE_URL}/staff/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  delete: (id) => fetchWithErrorHandling(`${API_BASE_URL}/staff/${id}`, {
    method: 'DELETE',
  }),
};

// Invitation API
export const invitationApi = {
  create: (data) => fetchWithErrorHandling(`${API_BASE_URL}/invitations`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  getAll: () => fetchWithErrorHandling(`${API_BASE_URL}/invitations`),

  revoke: (id) => fetchWithErrorHandling(`${API_BASE_URL}/invitations/${id}/revoke`, {
    method: 'PUT',
  }),

  resend: (id) => fetchWithErrorHandling(`${API_BASE_URL}/invitations/${id}/resend`, {
    method: 'PUT',
  }),

  validate: (token) => fetch(`${API_BASE_URL}/invitations/${token}/validate`)
    .then(res => {
      if (!res.ok) throw new Error('Validation failed');
      return res.json();
    }),

  accept: (data) => fetch(`${API_BASE_URL}/invitations/accept`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(res => {
    if (!res.ok) {
      return res.json().then(err => { throw new Error(err.message || 'Accept failed'); });
    }
    return res;
  }),
};

// Capacity API
export const capacityApi = {
  getStrategicAllocation: (phaseId) =>
    fetchWithErrorHandling(`${API_BASE_URL}/capacity/strategic?phaseId=${phaseId}`),

  getGaps: (phaseId) =>
    fetchWithErrorHandling(`${API_BASE_URL}/capacity/gaps?phaseId=${phaseId}`),
};
