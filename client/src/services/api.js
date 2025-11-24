import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export const api = {
  // Upload image
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await axios.post(`${API_BASE}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Enhance image
  enhanceImage: async (imagePath) => {
    const response = await axios.post(`${API_BASE}/upload/enhance`, {
      imagePath
    });
    return response.data;
  },

  // Analyze image with AI
  analyzeImage: async (imagePath) => {
    const response = await axios.post(`${API_BASE}/upload/analyze`, {
      imagePath
    });
    return response.data;
  },

  // Create Square catalog item
  createSquareItem: async (itemData) => {
    const response = await axios.post(`${API_BASE}/square/create-item`, itemData);
    return response.data;
  },

  // List Square items
  listSquareItems: async (limit = 10) => {
    const response = await axios.get(`${API_BASE}/square/items`, {
      params: { limit }
    });
    return response.data;
  },

  // Health check
  healthCheck: async () => {
    const response = await axios.get(`${API_BASE}/health`);
    return response.data;
  }
};
