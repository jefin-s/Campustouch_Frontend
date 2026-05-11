import api from './api';

export const getApplicants = () => api.get('/Applicant/applicants');

export const promoteToStudent = (data) => api.post('/Applicant/promote', data);
