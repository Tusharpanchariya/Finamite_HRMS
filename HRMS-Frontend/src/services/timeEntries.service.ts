import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

interface TimeEntryData {
  employeeId: number;
  projectId: number;
  task: string;
  date: string;
  startTime: string;
  endTime: string;
  description: string;
  billable: boolean;
}

interface TimeEntry {
  id: number;
  employeeId: number;
  projectId: number;
  task: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  description: string;
  billable: boolean;
  employee: {
    id: number;
    fullName: string;
    role: string;
  };
  project: {
    id: number;
    name: string;
  };
}

interface Project {
  id: number;
  name: string;
}

interface Employee {
  id: number;
  fullName: string;
  role: string;
}

export const fetchTimeEntries = async (): Promise<TimeEntry[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/time-entries`);
    // Assume backend returns array directly
    return response.data;
  } catch (error) {
    console.error('Error fetching time entries:', error);
    throw error;
  }
};

export const fetchProjects = async (): Promise<Project[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/projects`);
    // Auto-detect if backend sends array or { data: [...] }
    return Array.isArray(response.data) ? response.data : response.data?.data || [];
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
};

export const fetchEmployees = async (): Promise<Employee[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/employe`); // keep your actual endpoint
    // Auto-detect if backend sends array or { data: [...] }
    return Array.isArray(response.data) ? response.data : response.data?.data || [];
  } catch (error) {
    console.error('Error fetching employees:', error);
    throw error;
  }
};

export const createTimeEntry = async (entry: TimeEntryData): Promise<TimeEntry> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/time-entries`, entry);
    return response.data;
  } catch (error) {
    console.error('Error creating time entry:', error);
    throw error;
  }
};

export const updateTimeEntry = async (id: number, entry: TimeEntryData): Promise<TimeEntry> => {
  try {
    const response = await axios.put(`${API_BASE_URL}/time-entries/${id}`, entry);
    return response.data;
  } catch (error) {
    console.error('Error updating time entry:', error);
    throw error;
  }
};

export const deleteTimeEntry = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/time-entries/${id}`);
  } catch (error) {
    console.error('Error deleting time entry:', error);
    throw error;
  }
};
