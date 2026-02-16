-- Sample Data for Mini Task Tracker

-- Insert a default user (username: demo, password: password123)
INSERT INTO users (username, password, full_name) VALUES
('demo', '$2a$12$RQlYDy/WwcbSmr2r7ewnNOo6.OPStqAqgPtLq6zz.UeL9YTcgoGFC', 'Demo User');
-- Note: The password hash above is for 'password123' using BCrypt

-- Insert sample tasks
INSERT INTO tasks (title, description, status, priority, due_date) VALUES
('Mini task tracker', 'This is a full-stack web application created using React.js, Java(SpringBoot), MySQL', 'DONE', 'HIGH', '2026-02-10'),
('React for frontend', 'React.js is a javaScript library', 'DONE', 'HIGH', '2026-02-11'),
('Java for backend', 'Java Springboot is a strong backend framework', 'IN_PROGRESS', 'HIGH', '2026-02-15'),
('JWT Authentication', 'User authentication and authorization handled using JWT tokens.', 'IN_PROGRESS', 'MEDIUM', '2026-02-16'),
('Tailwind CSS', 'Styling was done using Tailwind css with shadcn', 'TODO', 'HIGH', '2026-02-18'),
('WebSocket Notifications', 'Real-time task updates using SockJS.', 'TODO', 'MEDIUM', '2026-02-20'),
('ReadMe file', 'ReadMe file is added for easier setup', 'TODO', 'LOW', '2026-02-22'),
('SQL Dump', 'MySQL scripts were added for database setup', 'TODO', 'LOW', '2026-02-25');
