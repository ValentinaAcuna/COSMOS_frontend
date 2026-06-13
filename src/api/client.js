const BASE_URL = import.meta.env.VITE_API_URL || "https://cosmos-backend-gxkb.onrender.com/api/v1"

function authHeaders() {
  const token = localStorage.getItem("token")
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...authHeaders(), ...options.headers },
    ...options,
  })
  const data = await res.json()
  if (!res.ok) throw { status: res.status, errors: data.errors || data.error }
  return data
}

export const api = {
  getProducts: (category) =>
    request(`/products${category ? `?category=${encodeURIComponent(category)}` : ""}`),

  getProduct: (id) => request(`/products/${id}`),

  deleteProduct: (id) => request(`/products/${id}`, { method: "DELETE" }),

  createProduct: (data) => request("/products", { method: "POST", body: JSON.stringify(data) }),

  login: (email, password) =>
    request("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),

  register: (data) =>
    request("/auth/register", { method: "POST", body: JSON.stringify(data) }),

  getProfile: () => request("/profile"),

  updateProfile: (data) =>
    request("/profile", { method: "PUT", body: JSON.stringify(data) }),

  getOrders: () => request("/orders"),

  createOrder: (items, notes) =>
    request("/orders", { method: "POST", body: JSON.stringify({ items, notes }) }),
}
