import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { taskService, type TaskFilters } from '../services/taskService';
import type { Task, TaskRequest, PagedResponse } from '../types/task';

interface TaskState {
    tasks: Task[];
    currentTask: Task | null;
    totalPages: number;
    totalElements: number;
    currentPage: number;
    loading: boolean;
    error: string | null;
}

const initialState: TaskState = {
    tasks: [],
    currentTask: null,
    totalPages: 0,
    totalElements: 0,
    currentPage: 0,
    loading: false,
    error: null,
};

export const fetchTasks = createAsyncThunk(
    'tasks/fetchAll',
    async (filters: TaskFilters, { rejectWithValue }) => {
        try {
            const response = await taskService.getAllTasks(filters);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch tasks');
        }
    }
);

export const fetchTaskById = createAsyncThunk(
    'tasks/fetchById',
    async (id: number, { rejectWithValue }) => {
        try {
            const response = await taskService.getTaskById(id);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch task');
        }
    }
);

export const createTask = createAsyncThunk(
    'tasks/create',
    async (data: TaskRequest, { rejectWithValue }) => {
        try {
            const response = await taskService.createTask(data);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create task');
        }
    }
);

export const updateTask = createAsyncThunk(
    'tasks/update',
    async ({ id, data }: { id: number; data: TaskRequest }, { rejectWithValue }) => {
        try {
            const response = await taskService.updateTask(id, data);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update task');
        }
    }
);

export const deleteTask = createAsyncThunk(
    'tasks/delete',
    async (id: number, { rejectWithValue }) => {
        try {
            await taskService.deleteTask(id);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete task');
        }
    }
);

const taskSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        clearCurrentTask: (state) => {
            state.currentTask = null;
        },
        clearError: (state) => {
            state.error = null;
        },
        addOrUpdateTask: (state, action: PayloadAction<Task>) => {
            const index = state.tasks.findIndex(t => t.id === action.payload.id);
            if (index !== -1) {
                state.tasks[index] = action.payload;
            } else {
                state.tasks.unshift(action.payload);
            }
        },
        removeTask: (state, action: PayloadAction<number>) => {
            state.tasks = state.tasks.filter(t => t.id !== action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTasks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<PagedResponse<Task>>) => {
                state.loading = false;
                state.tasks = action.payload.content;
                state.totalPages = action.payload.totalPages;
                state.totalElements = action.payload.totalElements;
                state.currentPage = action.payload.number;
            })
            .addCase(fetchTasks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchTaskById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTaskById.fulfilled, (state, action: PayloadAction<Task>) => {
                state.loading = false;
                state.currentTask = action.payload;
            })
            .addCase(fetchTaskById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(createTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createTask.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(createTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(updateTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateTask.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(updateTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(deleteTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteTask.fulfilled, (state, action: PayloadAction<number>) => {
                state.loading = false;
                state.tasks = state.tasks.filter(t => t.id !== action.payload);
            })
            .addCase(deleteTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearCurrentTask, clearError, addOrUpdateTask, removeTask } = taskSlice.actions;
export default taskSlice.reducer;
