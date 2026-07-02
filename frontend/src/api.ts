export const BASE_URL = import.meta.env.PROD ? '' : 'http://localhost:8000';
export const API_URL = import.meta.env.PROD ? '/api' : 'http://localhost:8000/api';

export const getPortfolio = async () => {
  const res = await fetch(`${API_URL}/portfolio`);
  return res.json();
};

export const getSettings = async () => {
  const res = await fetch(`${API_URL}/settings`);
  return res.json();
};

export const getReviews = async () => {
  const res = await fetch(`${API_URL}/reviews`);
  return res.json();
};

export const createReview = async (author: string, text: string, rating: number, createdAt?: string) => {
  const payload: any = { author, text, rating };
  if (createdAt) payload.created_at = createdAt;
  const res = await fetch(`${API_URL}/reviews`, {
    method: 'POST',
    headers: {
      ...getHeaders(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Error creating review');
  return res.json();
};

export const deleteReview = async (id: number) => {
  const res = await fetch(`${API_URL}/reviews/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error('Error deleting review');
  return res.json();
};

export const getServices = async () => {
  const res = await fetch(`${API_URL}/services`);
  return res.json();
};

export const createService = async (key: string, title: string, description: string, features: string, icon_name: string, price: string, image: File | null, imageUrl: string | null) => {
  const formData = new FormData();
  formData.append('key', key);
  formData.append('title', title);
  formData.append('description', description);
  formData.append('features', features);
  formData.append('icon_name', icon_name);
  formData.append('price', price);
  if (image) formData.append('image', image);
  if (imageUrl) formData.append('image_url', imageUrl);
  
  const headers = getHeaders();
  delete headers['Content-Type']; // Let browser set boundary

  const res = await fetch(`${API_URL}/services`, {
    method: 'POST',
    headers,
    body: formData,
  });
  if (!res.ok) throw new Error('Error creating service');
  return res.json();
};

export const updateService = async (id: number, key: string, title: string, description: string, features: string, icon_name: string, price: string, image: File | null) => {
  const formData = new FormData();
  formData.append('key', key);
  formData.append('title', title);
  formData.append('description', description);
  formData.append('features', features);
  formData.append('icon_name', icon_name);
  formData.append('price', price);
  if (image) formData.append('image', image);

  const headers = getHeaders();
  delete headers['Content-Type']; // Let browser set boundary

  const res = await fetch(`${API_URL}/services/${id}`, {
    method: 'PUT',
    headers,
    body: formData,
  });
  if (!res.ok) throw new Error('Error updating service');
  return res.json();
};

export const deleteService = async (id: number) => {
  const res = await fetch(`${API_URL}/services/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error('Error deleting service');
  return res.json();
};

export const login = async (username: string, password: string) => {
  const formData = new FormData();
  formData.append('username', username);
  formData.append('password', password);
  
  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    body: formData,
  });
  
  if (!res.ok) throw new Error('Invalid credentials');
  const data = await res.json();
  localStorage.setItem('admin_token', data.access_token);
  return data;
};

export const logout = () => {
  localStorage.removeItem('admin_token');
};

const getHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('admin_token');
  return {
    'Authorization': `Bearer ${token}`
  };
};

export const createPortfolioItem = async (title: string, type: string, image: File) => {
  const formData = new FormData();
  formData.append('title', title);
  formData.append('type', type);
  formData.append('image', image);
  
  const res = await fetch(`${API_URL}/portfolio`, {
    method: 'POST',
    headers: getHeaders(),
    body: formData, // fetch will set multipart/form-data boundary automatically
  });
  if (!res.ok) throw new Error('Error creating item');
  return res.json();
};

export const deletePortfolioItem = async (id: number) => {
  const res = await fetch(`${API_URL}/portfolio/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error('Error deleting item');
  return res.json();
};

export const updateSetting = async (key: string, value: string, description?: string) => {
  const res = await fetch(`${API_URL}/settings`, {
    method: 'POST',
    headers: {
      ...getHeaders(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ key, value, description }),
  });
  if (!res.ok) throw new Error('Error updating setting');
  return res.json();
};
