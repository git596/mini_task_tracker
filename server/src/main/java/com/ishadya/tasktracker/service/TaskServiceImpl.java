package com.ishadya.tasktracker.service;

import com.ishadya.tasktracker.dto.TaskRequestDTO;
import com.ishadya.tasktracker.dto.TaskResponseDTO;
import com.ishadya.tasktracker.exception.ResourceNotFoundException;
import com.ishadya.tasktracker.model.Task;
import com.ishadya.tasktracker.model.TaskPriority;
import com.ishadya.tasktracker.model.TaskStatus;
import com.ishadya.tasktracker.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Override
    @Cacheable(value = "tasks", key = "#search + '-' + #status + '-' + #priority + '-' + #pageable.pageNumber")
    public Page<TaskResponseDTO> getAllTasks(
            String search,
            TaskStatus status,
            TaskPriority priority,
            Pageable pageable
    ) {
        Page<Task> tasks = taskRepository.findByFilters(search, status, priority, pageable);
        return tasks.map(this::convertToDTO);
    }

    @Override
    @Cacheable(value = "task", key = "#id")
    public TaskResponseDTO getTaskById(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));
        return convertToDTO(task);
    }

    @Override
    @Transactional
    @CacheEvict(value = {"tasks", "task"}, allEntries = true)
    public TaskResponseDTO createTask(TaskRequestDTO taskRequestDTO) {
        Task task = convertToEntity(taskRequestDTO);
        Task savedTask = taskRepository.save(task);
        TaskResponseDTO response = convertToDTO(savedTask);

        // Send WebSocket notification
        messagingTemplate.convertAndSend("/topic/tasks", new TaskEvent("CREATE", response));

        return response;
    }

    @Override
    @Transactional
    @CacheEvict(value = {"tasks", "task"}, allEntries = true)
    public TaskResponseDTO updateTask(Long id, TaskRequestDTO taskRequestDTO) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));

        task.setTitle(taskRequestDTO.getTitle());
        task.setDescription(taskRequestDTO.getDescription());
        task.setStatus(taskRequestDTO.getStatus() != null ? taskRequestDTO.getStatus() : task.getStatus());
        task.setPriority(taskRequestDTO.getPriority() != null ? taskRequestDTO.getPriority() : task.getPriority());
        task.setDueDate(taskRequestDTO.getDueDate());

        Task updatedTask = taskRepository.save(task);
        TaskResponseDTO response = convertToDTO(updatedTask);

        // Send WebSocket notification
        messagingTemplate.convertAndSend("/topic/tasks", new TaskEvent("UPDATE", response));

        return response;
    }

    @Override
    @Transactional
    @CacheEvict(value = {"tasks", "task"}, allEntries = true)
    public void deleteTask(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));

        taskRepository.delete(task);

        // Send WebSocket notification
        messagingTemplate.convertAndSend("/topic/tasks", new TaskEvent("DELETE", convertToDTO(task)));
    }

    private TaskResponseDTO convertToDTO(Task task) {
        return new TaskResponseDTO(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getStatus(),
                task.getPriority(),
                task.getDueDate(),
                task.getCreatedAt(),
                task.getUpdatedAt()
        );
    }

    private Task convertToEntity(TaskRequestDTO dto) {
        Task task = new Task();
        task.setTitle(dto.getTitle());
        task.setDescription(dto.getDescription());
        task.setStatus(dto.getStatus() != null ? dto.getStatus() : TaskStatus.TODO);
        task.setPriority(dto.getPriority() != null ? dto.getPriority() : TaskPriority.MEDIUM);
        task.setDueDate(dto.getDueDate());
        return task;
    }

    // Inner class for WebSocket event payload
    public record TaskEvent(String action, TaskResponseDTO task) {}
}
