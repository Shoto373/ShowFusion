const API_URL = 'http://localhost:8000/api';

export const getPortfolio = async () => {
  const res = await fetch(`${API_URL}/portfolio`);
  return res.json();
};

export const getSettings = async () => {
  const res = await fetch(`${API_URL}/settings`);
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

const getHeaders = () => {
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
