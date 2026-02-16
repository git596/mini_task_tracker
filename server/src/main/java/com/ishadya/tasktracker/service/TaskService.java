package com.ishadya.tasktracker.service;

import com.ishadya.tasktracker.dto.TaskRequestDTO;
import com.ishadya.tasktracker.dto.TaskResponseDTO;
import com.ishadya.tasktracker.model.TaskPriority;
import com.ishadya.tasktracker.model.TaskStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface TaskService {

    Page<TaskResponseDTO> getAllTasks(
            String search,
            TaskStatus status,
            TaskPriority priority,
            Pageable pageable
    );

    TaskResponseDTO getTaskById(Long id);

    TaskResponseDTO createTask(TaskRequestDTO taskRequestDTO);

    TaskResponseDTO updateTask(Long id, TaskRequestDTO taskRequestDTO);

    void deleteTask(Long id);
}
