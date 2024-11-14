import axios from "axios";

const BASE_URL = "http://localhost:5000";

export const fetchModels = () => axios.get(`${BASE_URL}/models`);
export const uploadCSV = (formData) =>
  axios.post(`${BASE_URL}/predict`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const fetchPerformanceHistory = () =>
  axios.get(`${BASE_URL}/performance_history`);

