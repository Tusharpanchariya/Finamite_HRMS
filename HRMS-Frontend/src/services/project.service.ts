export interface Project {
  id: number;
  name: string;
  description?: string;
  clientId?: number;
  status: string;
  startDate: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectData {
  name: string;
  description?: string;
  clientId?: number;
  status?: string;
  startDate: string;
  endDate?: string;
}

export interface UpdateProjectData {
  name?: string;
  description?: string;
  clientId?: number;
  status?: string;
  startDate?: string;
  endDate?: string;
}

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:3000/api';

class ProjectService {
  private async makeRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}/projects${endpoint}`;
    
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

  async getProjects(): Promise<Project[]> {
    return this.makeRequest<Project[]>('');
  }

  async getProjectById(id: number): Promise<Project> {
    return this.makeRequest<Project>(`/${id}`);
  }

  async createProject(data: CreateProjectData): Promise<Project> {
    return this.makeRequest<Project>('', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProject(id: number, data: UpdateProjectData): Promise<Project> {
    return this.makeRequest<Project>(`/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteProject(id: number): Promise<{ message: string }> {
    return this.makeRequest<{ message: string }>(`/${id}`, {
      method: 'DELETE',
    });
  }

  async getActiveProjects(): Promise<Project[]> {
    const projects = await this.getProjects();
    return projects.filter(project => project.status === 'active');
  }
}

export const projectService = new ProjectService();
export default projectService;