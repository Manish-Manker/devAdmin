import api from './api'

export const userService = {
    getAllUsers: (params) => api.get('/users', { params }),
    getUserById: (id) => api.get(`/users/${id}`),
    createUser: (data) => api.post('/users', data),
    updateUser: (id, data) => api.put(`/users/${id}`, data),
    deleteUser: (id) => api.delete(`/users/${id}`),
    updateStatus: (id, status) => api.patch(`/users/${id}/status`, { status }),
}

export const postService = {
    getAllPosts: (params) => api.get('/posts', { params }),
    getPostById: (id) => api.get(`/posts/${id}`),
    createPost: (data) => api.post('/posts', data),
    updatePost: (id, data) => api.put(`/posts/${id}`, data),
    deletePost: (id) => api.delete(`/posts/${id}`),
    toggleStatus: (id) => api.post(`/posts/${id}/toggle-status`),
}

export const dashboardService = {
    getStats: () => api.get('/dashboard/stats'),
    getRevenue: (period) => api.get('/dashboard/revenue', { params: { period } }),
    getActivity: () => api.get('/dashboard/activity'),
}

export const reportService = {
    getAllReports: (params) => api.get('/reports', { params }), // Ensure this matches usage in ReportPost.jsx
    updateReportStatus: (id, status) => api.patch(`/reports/${id}/status`, { status }),
    updatePostStatus: (postId, status) => api.patch(`/posts/${postId}/status`, { status }),
    deleteReport: (id) => api.delete(`/reports/${id}`),
    // If you need to delete the post via report context:
    deleteReportedPost: (postId) => api.delete(`/posts/${postId}`),
}

export const contactService = {
    getAllContacts: (params) => api.get('/contacts', { params }),
    getContactById: (id) => api.get(`/contacts/${id}`),
    updateStatus: (id, status) => api.patch(`/contacts/${id}/status`, { status }),
    toggleStar: (id) => api.post(`/contacts/${id}/toggle-star`),
    deleteContact: (id) => api.delete(`/contacts/${id}`),
}

export const deletionService = {
    getAllRequests: (params) => api.get('/deletion-requests', { params }),
    updateStatus: (id, status) => api.patch(`/deletion-requests/${id}/status`, { status }),
    deleteUser: (id) => api.delete(`/users/${id}`), // Actual user deletion
}

export const waitingListService = {
    getAllEntries: (params) => api.get('/waiting-list', { params }),
    inviteUser: (id) => api.post(`/waiting-list/${id}/invite`),
    approveUser: (id) => api.post(`/waiting-list/${id}/approve`), // "Mark as Joined"
    deleteEntry: (id) => api.delete(`/waiting-list/${id}`),
}
