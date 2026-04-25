import api from './api';

// Departments
export const departmentService = {
  getAll: () => api.get('/Departement'),
  getById: (id) => api.get(`/Departement/${id}`),
  create: (data) => api.post('/Departement', data),
  update: (id, data) => api.put(`/Departement/${id}`, data),
  delete: (id) => api.delete(`/Departement/${id}`)
};

// Programs (Courses)
export const programService = {
  getAll: () => api.get('/Program'),
  getById: (id) => api.get(`/Program/${id}`),
  create: (data) => api.post('/Program', data),
  update: (id, data) => api.put(`/Program/${id}`, data),
  delete: (id) => api.delete(`/Program/${id}`)
};

// Semesters
export const semesterService = {
  getAll: () => api.get('/Semester'),
  getById: (id) => api.get(`/Semester/${id}`),
  create: (data) => api.post('/Semester', data),
  update: (id, data) => api.put(`/Semester/${id}`, data),
  delete: (id) => api.delete(`/Semester/${id}`)
};

// Subjects
export const subjectService = {
  getAll: () => api.get('/Subject'),
  getById: (id) => api.get(`/Subject/${id}`),
  create: (data) => api.post('/Subject', data),
  update: (id, data) => api.put(`/Subject/${id}`, data),
  delete: (id) => api.delete(`/Subject/${id}`)
};

// Classes
export const classService = {
  getAll: () => api.get('/classes'),
  getById: (id) => api.get(`/classes/${id}`),
  create: (data) => api.post('/classes', data),
  update: (id, data) => api.put(`/classes/${id}`, data),
  delete: (id) => api.delete(`/classes/${id}`)
};
