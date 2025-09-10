export interface Task {
  id: number;
  name: string;
  description?: string;
  projectId: number;
  status: string;
  priority: string;
  assignedTo?: number;
  estimatedHours?: number;
  createdAt: string;
  updatedAt: string;
  project?: {
    id: number;
    name: string;
  };
}

export interface CreateTaskData {
  name: string;
  description?: string;
  projectId: number;
  status?: string;
  priority?: string;
  assignedTo?: number;
  estimatedHours?: number;
}

export interface UpdateTaskData {
  name?: string;
  description?: string;
  projectId?: number;
  status?: string;
  priority?: string;
  assignedTo?: number;
  estimatedHours?: number;
}

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:3000/api';

class TaskService {
  private async makeRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}/tasks${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async getTasks(): Promise<Task[]> {
    return this.makeRequest<Task[]>('');
  }

  async getTaskById(id: number): Promise<Task> {
    return this.makeRequest<Task>(`/${id}`);
  }

  async createTask(data: CreateTaskData): Promise<Task> {
    return this.makeRequest<Task>('', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTask(id: number, data: UpdateTaskData): Promise<Task> {
    return this.makeRequest<Task>(`/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteTask(id: number): Promise<{ message: string }> {
    return this.makeRequest<{ message: string }>(`/${id}`, {
      method: 'DELETE',
    });
  }

  async getTasksByProject(projectId: number): Promise<Task[]> {
    const tasks = await this.getTasks();
    return tasks.filter(task => task.projectId === projectId);
  }

  async getTasksByEmployee(employeeId: number): Promise<Task[]> {
    const tasks = await this.getTasks();
    return tasks.filter(task => task.assignedTo === employeeId);
  }
}

export const taskService = new TaskService();
export default taskService;