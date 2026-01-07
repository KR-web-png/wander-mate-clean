import apiClient from '@/lib/api-client';

export const apiService = {
  // Health check
  async checkHealth() {
    const response = await apiClient.get('/health');
    return response.data;
  },

  // Auth endpoints
  auth: {
    login: async (credentials: { email: string; password: string }) => {
      const response = await apiClient.post('/auth/login', credentials);
      return response.data;
    },
    signup: async (data: { name: string; email: string; password: string }) => {
      const response = await apiClient.post('/auth/signup', data);
      return response.data;
    },
    getCurrentUser: async () => {
      const response = await apiClient.get('/auth/me');
      return response.data;
    },
    logout: async () => {
      const response = await apiClient.post('/auth/logout');
      return response.data;
    },
  },

  // User endpoints
  users: {
    getCurrentProfile: async () => {
      const response = await apiClient.get('/users/profile');
      return response.data;
    },
    getProfile: async (userId: string) => {
      const response = await apiClient.get(`/users/${userId}`);
      return response.data;
    },
    updateProfile: async (userId: string, data: any) => {
      const response = await apiClient.put(`/users/${userId}`, data);
      return response.data;
    },
    uploadAvatar: async (userId: string, file: File) => {
      const formData = new FormData();
      formData.append('avatar', file);
      const response = await apiClient.post(`/users/${userId}/avatar`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
  },

  // Trips endpoints
  trips: {
    getAll: async (filters?: any) => {
      const response = await apiClient.get('/trips', { params: filters });
      return response.data;
    },
    getById: async (id: string) => {
      const response = await apiClient.get(`/trips/${id}`);
      return response.data;
    },
    create: async (data: any) => {
      const response = await apiClient.post('/trips', data);
      return response.data;
    },
    update: async (id: string, data: any) => {
      const response = await apiClient.put(`/trips/${id}`, data);
      return response.data;
    },
    delete: async (id: string) => {
      const response = await apiClient.delete(`/trips/${id}`);
      return response.data;
    },
    join: async (id: string) => {
      const response = await apiClient.post(`/trips/${id}/join`);
      return response.data;
    },
    leave: async (id: string) => {
      const response = await apiClient.post(`/trips/${id}/leave`);
      return response.data;
    },
  },

  // Destinations endpoints
  destinations: {
    getAll: async () => {
      const response = await apiClient.get('/destinations');
      return response.data;
    },
    getById: async (id: string) => {
      const response = await apiClient.get(`/destinations/${id}`);
      return response.data;
    },
    search: async (query: string) => {
      const response = await apiClient.get('/destinations/search', {
        params: { q: query },
      });
      return response.data;
    },
    getPopular: async () => {
      const response = await apiClient.get('/destinations/popular');
      return response.data;
    },
  },

  // Matches endpoints
  matches: {
    getAll: async () => {
      const response = await apiClient.get('/matches');
      return response.data;
    },
    getById: async (id: string) => {
      const response = await apiClient.get(`/matches/${id}`);
      return response.data;
    },
    accept: async (id: string) => {
      const response = await apiClient.post(`/matches/${id}/accept`);
      return response.data;
    },
    decline: async (id: string) => {
      const response = await apiClient.post(`/matches/${id}/decline`);
      return response.data;
    },
  },

  // Chat/Messages endpoints
  messages: {
    getConversations: async () => {
      const response = await apiClient.get('/messages/conversations');
      return response.data;
    },
    getMessages: async (conversationId: string) => {
      const response = await apiClient.get(`/messages/conversations/${conversationId}`);
      return response.data;
    },
    sendMessage: async (conversationId: string, content: string) => {
      const response = await apiClient.post(`/messages/conversations/${conversationId}`, {
        content,
      });
      return response.data;
    },
  },

  // Payment endpoints
  payments: {
    createPayment: async (data: any) => {
      const response = await apiClient.post('/payments', data);
      return response.data;
    },
    getPaymentHistory: async () => {
      const response = await apiClient.get('/payments/history');
      return response.data;
    },
  },
};

export default apiService;
