const API_URL = import.meta.env.VITE_BACKEND_URL

async function refreshAccessToken() {
  await fetch(`${API_URL}/api/users/refresh`, {
    method: "POST",
    credentials: "include",
  });
}

export async function fetchWithAuth(url, options = {}) {
  let res = await fetch(`${API_URL}${url}`, {
    ...options,
    credentials: "include",
  });

  if (res.status === 401) {
    try {
      await refreshAccessToken();

      res = await fetch(`${API_URL}${url}`, {
        ...options,
        credentials: "include",
      });
    } catch (err) {
      console.error("Auto-refresh failed:", err.message);
    }
  }

  return res;
}
