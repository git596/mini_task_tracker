import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchTasks, deleteTask, addOrUpdateTask, removeTask } from '../store/taskSlice';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../components/ui/alert-dialog';
import { Plus, Search, Trash2, Edit, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { TaskStatus, TaskPriority } from '../types/task';
import { toast } from 'sonner';
import { Client } from '@stomp/stompjs';

const statusColors = {
    TODO: 'bg-slate-500',
    IN_PROGRESS: 'bg-blue-500',
    DONE: 'bg-green-500',
};

const priorityColors = {
    LOW: 'bg-gray-500',
    MEDIUM: 'bg-yellow-500',
    HIGH: 'bg-red-500',
};

export function TaskListPage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { tasks, loading, totalPages, currentPage, totalElements } = useAppSelector((state) => state.tasks);

    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<TaskStatus | 'ALL'>('ALL');
    const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'ALL'>('ALL');
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortDir, setSortDir] = useState<'ASC' | 'DESC'>('DESC');
    const [page, setPage] = useState(0);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState<number | null>(null);

    const loadTasks = useCallback(() => {
        dispatch(fetchTasks({
            search: search || undefined,
            status: statusFilter !== 'ALL' ? statusFilter : undefined,
            priority: priorityFilter !== 'ALL' ? priorityFilter : undefined,
            page,
            size: 9,
            sortBy,
            sortDir,
        }));
    }, [dispatch, search, statusFilter, priorityFilter, page, sortBy, sortDir]);

    useEffect(() => {
        loadTasks();
    }, [loadTasks]);

    // WebSocket connection for real-time updates
    useEffect(() => {
        const client = new Client({
            brokerURL: import.meta.env.VITE_WS_URL || 'ws://localhost:8080/ws',
            onConnect: () => {
                console.log('WebSocket connected');
                client.subscribe('/topic/tasks', (message) => {
                    const event = JSON.parse(message.body);
                    if (event.action === 'CREATE' || event.action === 'UPDATE') {
                        dispatch(addOrUpdateTask(event.task));
                        toast.success(`Task ${event.action === 'CREATE' ? 'created' : 'updated'}`);
                    } else if (event.action === 'DELETE') {
                        dispatch(removeTask(event.task.id));
                        toast.info('Task deleted');
                    }
                });
            },
            onStompError: (frame) => {
                console.error('WebSocket error:', frame);
            },
            onWebSocketError: (error) => {
                console.error('WebSocket connection error:', error);
            },
        });

        client.activate();

        return () => {
            client.deactivate();
        };
    }, [dispatch]);

    const handleSearch = (value: string) => {
        setSearch(value);
        setPage(0);
    };

    const handleDelete = async () => {
        if (taskToDelete) {
            try {
                await dispatch(deleteTask(taskToDelete)).unwrap();
                toast.success('Task deleted successfully');
                setDeleteDialogOpen(false);
                setTaskToDelete(null);
            } catch (error: any) {
                toast.error(error || 'Failed to delete task');
            }
        }
    };

    const openDeleteDialog = (id: number) => {
        setTaskToDelete(id);
        setDeleteDialogOpen(true);
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Task List</h1>
                        <p className="text-muted-foreground mt-1">Total Tasks: {totalElements}</p>
                    </div>
                    <Button onClick={() => navigate('/tasks/new')}>
                        <Plus className="mr-2 h-4 w-4" />
                        New Task
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search tasks..."
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v as any); setPage(0); }}>
                        <SelectTrigger>
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All Statuses</SelectItem>
                            <SelectItem value="TODO">To Do</SelectItem>
                            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                            <SelectItem value="DONE">Done</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={priorityFilter} onValueChange={(v) => { setPriorityFilter(v as any); setPage(0); }}>
                        <SelectTrigger>
                            <SelectValue placeholder="Filter by priority" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All Priorities</SelectItem>
                            <SelectItem value="LOW">Low</SelectItem>
                            <SelectItem value="MEDIUM">Medium</SelectItem>
                            <SelectItem value="HIGH">High</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={`${sortBy}-${sortDir}`} onValueChange={(v) => {
                        const [by, dir] = v.split('-');
                        setSortBy(by);
                        setSortDir(dir as 'ASC' | 'DESC');
                    }}>
                        <SelectTrigger>
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="createdAt-DESC">Newest First</SelectItem>
                            <SelectItem value="createdAt-ASC">Oldest First</SelectItem>
                            <SelectItem value="dueDate-ASC">Due Date (Earliest)</SelectItem>
                            <SelectItem value="priority-DESC">Priority (High to Low)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <Card key={i}>
                                <CardHeader>
                                    <Skeleton className="h-6 w-3/4" />
                                    <Skeleton className="h-4 w-1/2 mt-2" />
                                </CardHeader>
                                <CardContent>
                                    <Skeleton className="h-20 w-full" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : tasks.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground text-lg">No tasks found</p>
                        <Button onClick={() => navigate('/tasks/new')} className="mt-4">
                            Create your first task
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {tasks.map((task) => (
                                <Card key={task.id} className="hover:shadow-lg transition-shadow">
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <CardTitle className="line-clamp-2">{task.title}</CardTitle>
                                            <div className="flex gap-1">
                                                <Badge className={statusColors[task.status]}>{task.status.replace('_', ' ')}</Badge>
                                            </div>
                                        </div>
                                        
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground line-clamp-3">
                                            {task.description || 'No description'}
                                        </p>
                                    </CardContent>
                                    <CardDescription className="flex items-center gap-2">
                                        <Badge variant="outline" className={priorityColors[task.priority]}>
                                            {task.priority}
                                        </Badge>
                                        {task.dueDate && (
                                            <span className="text-xs">Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                                        )}
                                    </CardDescription>
                                    <CardFooter className="flex justify-between">
                                        <Button variant="ghost" size="sm" onClick={() => navigate(`/tasks/${task.id}`)}>
                                            <Eye className="mr-1 h-4 w-4" />
                                        </Button>
                                        <div className="flex gap-2">
                                            <Button variant="ghost" size="sm" onClick={() => navigate(`/tasks/${task.id}/edit`)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="sm" onClick={() => openDeleteDialog(task.id)}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-4 mt-8">
                                <Button
                                    variant="outline"
                                    onClick={() => setPage(p => Math.max(0, p - 1))}
                                    disabled={currentPage === 0}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                    Previous
                                </Button>
                                <span className="text-sm">
                                    Page {currentPage + 1} of {totalPages}
                                </span>
                                <Button
                                    variant="outline"
                                    onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                                    disabled={currentPage === totalPages - 1}
                                >
                                    Next
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the task.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
