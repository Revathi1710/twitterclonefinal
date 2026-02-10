// src/api.js
export const fetchAuthUser = async () => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });

  const data = await res.json();
  if (data.error) return null;
  if (!res.ok) throw new Error(data.error || 'Something went wrong');
  return data;
};
