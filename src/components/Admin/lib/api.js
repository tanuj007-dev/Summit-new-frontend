
const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL ?? 'https://api.summithomeappliance.com';

export const API_ENDPOINTS = {
  blogs: {
    list: () => `${API_BASE_URL}/api/blogs`,
    create: () => `${API_BASE_URL}/api/blogs`,
    update: (id) => `${API_BASE_URL}/api/blogs/${id}`,
    delete: (id) => `${API_BASE_URL}/api/blogs/${id}`,
  },
  images: {
    upload: () => `${API_BASE_URL}/api/admin/upload-image`, // Assuming this exists or will be needed
  },
  users: {
    list: () => `${API_BASE_URL}/api/admin/users`, // For author selection
  }
};
