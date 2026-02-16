import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { createTask, updateTask, fetchTaskById, clearCurrentTask } from '../store/taskSlice';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { TaskStatus, TaskPriority } from '../types/task';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

export function TaskFormPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { currentTask, loading } = useAppSelector((state) => state.tasks);
    const isEdit = !!id;

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState<TaskStatus>(TaskStatus.TODO);
    const [priority, setPriority] = useState<TaskPriority>(TaskPriority.MEDIUM);
    const [dueDate, setDueDate] = useState('');

    useEffect(() => {
        if (isEdit && id) {
            dispatch(fetchTaskById(Number(id)));
        }
        return () => {
            dispatch(clearCurrentTask());
        };
    }, [isEdit, id, dispatch]);

    useEffect(() => {
        if (currentTask && isEdit) {
            setTitle(currentTask.title);
            setDescription(currentTask.description || '');
            setStatus(currentTask.status);
            setPriority(currentTask.priority);
            setDueDate(currentTask.dueDate || '');
        }
    }, [currentTask, isEdit]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) {
            toast.error('Title is required');
            return;
        }

        if (title.length > 100) {
            toast.error('Title must not exceed 100 characters');
            return;
        }

        if (description.length > 500) {
            toast.error('Description must not exceed 500 characters');
            return;
        }

        if (dueDate) {
            const selectedDate = new Date(dueDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            // Adjust for timezone offset to compare dates correctly
            const selectedDateLocal = new Date(selectedDate.getUTCFullYear(), selectedDate.getUTCMonth(), selectedDate.getUTCDate());
            selectedDateLocal.setHours(0, 0, 0, 0);

            if (selectedDateLocal < today) {
                toast.error('Due date cannot be in the past');
                return;
            }
        }

        const taskData = {
            title: title.trim(),
            description: description.trim() || undefined,
            status,
            priority,
            dueDate: dueDate || undefined,
        };

        try {
            if (isEdit && id) {
                await dispatch(updateTask({ id: Number(id), data: taskData })).unwrap();
                toast.success('Task updated successfully');
            } else {
                await dispatch(createTask(taskData)).unwrap();
                toast.success('Task created successfully');
            }
            navigate('/');
        } catch (error: any) {
            toast.error(error || `Failed to ${isEdit ? 'update' : 'create'} task`);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="container mx-auto px-4 py-8 max-w-2xl">
                <Button variant="ghost" onClick={() => navigate('/')} className="mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Tasks
                </Button>

                <Card>
                    <CardHeader>
                        <CardTitle>{isEdit ? 'Edit Task' : 'Create New Task'}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">
                                    Title <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Enter task title"
                                    maxLength={100}
                                    disabled={loading}
                                />
                                <p className="text-xs text-muted-foreground">{title.length}/100 characters</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Enter task description"
                                    rows={4}
                                    maxLength={500}
                                    disabled={loading}
                                />
                                <p className="text-xs text-muted-foreground">{description.length}/500 characters</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select value={status} onValueChange={(v) => setStatus(v as TaskStatus)} disabled={loading}>
                                        <SelectTrigger id="status">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="TODO">To Do</SelectItem>
                                            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                            <SelectItem value="DONE">Done</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="priority">Priority</Label>
                                    <Select value={priority} onValueChange={(v) => setPriority(v as TaskPriority)} disabled={loading}>
                                        <SelectTrigger id="priority">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="LOW">Low</SelectItem>
                                            <SelectItem value="MEDIUM">Medium</SelectItem>
                                            <SelectItem value="HIGH">High</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="dueDate">Due Date</Label>
                                <Input
                                    id="dueDate"
                                    type="date"
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                    disabled={loading}
                                />
                            </div>

                            <div className="flex gap-4">
                                <Button type="submit" disabled={loading} className="flex-1">
                                    {loading ? 'Saving...' : isEdit ? 'Update Task' : 'Create Task'}
                                </Button>
                                <Button type="button" variant="outline" onClick={() => navigate('/')} disabled={loading}>
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
