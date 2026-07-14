// Helper to build headers with authentication token
const getHeaders = (token, isJson = true) => {
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (isJson) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
};

// Helper for handling API responses
const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || `HTTP error! status: ${response.status}`);
  }
  return data;
};

// --- Products API ---
export const getProducts = async (token, params = {}) => {
  const query = new URLSearchParams();
  if (params.category) query.append('category', params.category);
  if (params.search) query.append('search', params.search);
  if (params.limit) query.append('limit', params.limit);
  if (params.offset) query.append('offset', params.offset);
  if (params.low_stock) query.append('low_stock', params.low_stock); // if low_stock filter needed

  const url = `/api/products?${query.toString()}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: getHeaders(token),
  });
  return handleResponse(response);
};

export const getProduct = async (token, id) => {
  const response = await fetch(`/api/products/${id}`, {
    method: 'GET',
    headers: getHeaders(token),
  });
  return handleResponse(response);
};

export const createProduct = async (token, data) => {
  const response = await fetch('/api/products', {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const updateProduct = async (token, id, data) => {
  const response = await fetch(`/api/products/${id}`, {
    method: 'PUT',
    headers: getHeaders(token),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const deleteProduct = async (token, id) => {
  const response = await fetch(`/api/products/${id}`, {
    method: 'DELETE',
    headers: getHeaders(token),
  });
  return handleResponse(response);
};

// --- Orders API ---
export const getOrders = async (token, params = {}) => {
  const query = new URLSearchParams();
  if (params.status) query.append('status', params.status);
  if (params.search) query.append('search', params.search); // if backend supports search

  const url = `/api/orders?${query.toString()}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: getHeaders(token),
  });
  return handleResponse(response);
};

export const getOrder = async (token, id) => {
  const response = await fetch(`/api/orders/${id}`, {
    method: 'GET',
    headers: getHeaders(token),
  });
  return handleResponse(response);
};

export const updateOrder = async (token, id, data) => {
  const response = await fetch(`/api/orders/${id}`, {
    method: 'PUT',
    headers: getHeaders(token),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

// --- Custom Requests API ---
export const getCustomRequests = async (token, params = {}) => {
  const query = new URLSearchParams();
  if (params.status) query.append('status', params.status);

  const url = `/api/custom-requests?${query.toString()}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: getHeaders(token),
  });
  return handleResponse(response);
};

export const getCustomRequest = async (token, id) => {
  const response = await fetch(`/api/custom-requests/${id}`, {
    method: 'GET',
    headers: getHeaders(token),
  });
  return handleResponse(response);
};

export const updateCustomRequest = async (token, id, data) => {
  const response = await fetch(`/api/custom-requests/${id}`, {
    method: 'PUT',
    headers: getHeaders(token),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

// --- Users API ---
export const getUsers = async (token) => {
  const response = await fetch('/api/users', {
    method: 'GET',
    headers: getHeaders(token),
  });
  return handleResponse(response);
};

// --- Events API ---
export const getAdminEvents = async (token) => {
  // Although active is fetched publicly, admin fetches via API with token
  const response = await fetch('/api/events', {
    method: 'GET',
    headers: getHeaders(token),
  });
  return handleResponse(response);
};

export const createEvent = async (token, data) => {
  const response = await fetch('/api/events', {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const updateEvent = async (token, id, data) => {
  const response = await fetch(`/api/events/${id}`, {
    method: 'PUT',
    headers: getHeaders(token),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const deleteEvent = async (token, id) => {
  const response = await fetch(`/api/events/${id}`, {
    method: 'DELETE',
    headers: getHeaders(token),
  });
  return handleResponse(response);
};

// --- Upload API ---
export const uploadImage = async (token, file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/upload', {
    method: 'POST',
    headers: getHeaders(token, false), // do NOT set content-type for FormData, let browser handle boundary
    body: formData,
  });
  return handleResponse(response);
};

