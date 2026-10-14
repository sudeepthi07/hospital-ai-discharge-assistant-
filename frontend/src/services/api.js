import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const checkApiHealth = async () => {
  try {
    const response = await api.get('/');
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getPatients = async () => {
  const response = await api.get('/patients');
  return response.data;
};

export const createPatient = async (patientData) => {
  const response = await api.post('/patients', patientData);
  return response.data;
};

export const getPatientSummaries = async (patientId) => {
  const response = await api.get(`/patients/${patientId}/summaries`);
  return response.data;
};

export const createDischargeSummary = async (summaryData) => {
  const response = await api.post('/discharge-summaries', summaryData);
  return response.data;
};

export default api;
