import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// Axios instance

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - runs BEFORE every request
// This adds the JWT token to every request automatically

api.interceptors.request.use(
  (config) => {
    // Get token from localStorage (we'll store it there after login)
    const token = localStorage.getItem("token");

    // If token exists, add it to the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - runs AFTER every response
// This handles errors globally (like expired tokens)
api.interceptors.response.use(
  (response) => {
    // If response is successful, just return it
    return response;
  },
  (error) => {
    // If we get 401 (unauthorized), token might be expired
    if (error.response?.status === 401) {
      // Clear the token and reload to login
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

// ============================================
// API calls
// ============================================

//////////////////// user ///////////////////////////

export const authAPI = {
  register: async (userData) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
};

/////////////////// categories ///////////////////////////

export const categoriesAPI = {
  getAll: async () => {
    const response = await api.get("/categories");
    return response.data;
  },

  create: async (categoryData) => {
    const response = await api.post("/categories", categoryData);
    return response.data;
  },

  update: async ({ id, ...categoryData }) => {
    const response = await api.put(`/categories/${id}`, categoryData);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },
};

//////////////////////// links //////////////////////////////////

export const linksAPI = {
  // Get all links (optionally filtered by category)
  getAll: async (categoryId) => {
    const url = categoryId ? `/links?category_id=${categoryId}` : "/links";
    const response = await api.get(url);
    return response.data;
  },

  getOne: async (id) => {
    const response = await api.get(`/links/${id}`);
    return response.data;
  },

  create: async (linkData) => {
    const response = await api.post("/links", linkData);
    return response.data;
  },

  update: async ({ id, ...linkData }) => {
    const response = await api.put(`/links/${id}`, linkData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/links/${id}`);
    return response.data;
  },
};

// Export the axios instance too, in case you need it
export default api;

// most of API calss are async function so that they are promises in Fact, keep that shit in mind
