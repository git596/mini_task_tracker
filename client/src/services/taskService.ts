import api from './api';
import type { Task, TaskRequest, PagedResponse } from '../types/task';
import { TaskStatus, TaskPriority } from '../types/task';

export interface TaskFilters {
    search?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: 'ASC' | 'DESC';
}

export const taskService = {
    async getAllTasks(filters: TaskFilters = {}): Promise<PagedResponse<Task>> {
        const params = new URLSearchParams();

        if (filters.search) params.append('search', filters.search);
        if (filters.status) params.append('status', filters.status);
        if (filters.priority) params.append('priority', filters.priority);
        if (filters.page !== undefined) params.append('page', filters.page.toString());
        if (filters.size !== undefined) params.append('size', filters.size.toString());
        if (filters.sortBy) params.append('sortBy', filters.sortBy);
        if (filters.sortDir) params.append('sortDir', filters.sortDir);

        const response = await api.get<PagedResponse<Task>>(`/tasks?${params.toString()}`);
        return response.data;
    },

    async getTaskById(id: number): Promise<Task> {
        const response = await api.get<Task>(`/tasks/${id}`);
        return response.data;
    },

    async createTask(data: TaskRequest): Promise<Task> {
        const response = await api.post<Task>('/tasks', data);
        return response.data;
    },

    async updateTask(id: number, data: TaskRequest): Promise<Task> {
        const response = await api.put<Task>(`/tasks/${id}`, data);
        return response.data;
    },

    async deleteTask(id: number): Promise<void> {
        await api.delete(`/tasks/${id}`);
    },
};
