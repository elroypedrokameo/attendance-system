-- Create Databases
CREATE DATABASE IF NOT EXISTS employee_db;
CREATE DATABASE IF NOT EXISTS attendance_db;

-- Grant permissions to app user
GRANT ALL PRIVILEGES ON employee_db.* TO 'dexa_user'@'%';
GRANT ALL PRIVILEGES ON attendance_db.* TO 'dexa_user'@'%';
FLUSH PRIVILEGES;

-- 1. EMPLOYEE DATABASE
USE employee_db;

CREATE TABLE IF NOT EXISTS departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    phone VARCHAR(50) NULL,
    department_id INT NOT NULL,
    position VARCHAR(100) NOT NULL,
    join_date DATE NOT NULL,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_employees_department FOREIGN KEY (department_id) REFERENCES departments(id)
);

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'EMPLOYEE') NOT NULL DEFAULT 'EMPLOYEE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_users_employee FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE SET NULL
);

-- Seed Data: Departments (Sesuai dengan FE EmployeeList.tsx)
INSERT INTO departments (id, name) VALUES
(1, 'IT Department'),
(2, 'Product Design'),
(3, 'Human Resources'),
(4, 'Finance & Accounting'),
(5, 'Operations')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Seed Data: Employees
INSERT INTO employees (id, employee_code, name, email, phone, department_id, position, join_date, is_active) VALUES
(1, 'ADM-HR001', 'Elroy Admin', 'admin@dexa.com', '08129483721', 3, 'HR Administrator', '2020-06-10', 1),
(2, 'EMP-2026-001', 'Elroy Kameo', 'elroy@dexa.com', '0827284623', 1, 'Software Engineer', '2022-01-15', 1),
(3, 'EMP-2026-002', 'Sarah Wijaya', 'sarah.wijaya@dexa.com', '08129876543', 2, 'UI/UX Designer', '2023-03-10', 1),
(4, 'EMP-2026-003', 'Budi Santoso', 'budi.santoso@dexa.com', '08134567890', 1, 'Backend Engineer', '2022-08-01', 1),
(5, 'EMP-2026-004', 'Amanda Putri', 'amanda.putri@dexa.com', '08561234567', 3, 'HR Specialist', '2021-11-20', 1),
(6, 'EMP-2026-005', 'Kevin Pratama', 'kevin.pratama@dexa.com', '08198765432', 4, 'Financial Analyst', '2021-05-12', 0)
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Seed Data: Users
-- Password admin@dexa.com -> admin123
-- Password lainnya        -> password123
INSERT INTO users (id, employee_id, email, password, role) VALUES
(1, 1, 'admin@dexa.com', '$2b$10$kVCrjFZybZnEjDIK9b6wfOfnIAYxaKRcoZewRebavxxJEmpl/Omnm', 'ADMIN'),
(2, 2, 'elroy@dexa.com', '$2b$10$ZUMY8dL9NEdxpElAeQJFfO3Z/lYm5.YjzeYtRHH4FJ1p4F.SGliD2', 'EMPLOYEE'),
(3, 3, 'sarah.wijaya@dexa.com', '$2b$10$ZUMY8dL9NEdxpElAeQJFfO3Z/lYm5.YjzeYtRHH4FJ1p4F.SGliD2', 'EMPLOYEE'),
(4, 4, 'budi.santoso@dexa.com', '$2b$10$ZUMY8dL9NEdxpElAeQJFfO3Z/lYm5.YjzeYtRHH4FJ1p4F.SGliD2', 'EMPLOYEE'),
(5, 5, 'amanda.putri@dexa.com', '$2b$10$ZUMY8dL9NEdxpElAeQJFfO3Z/lYm5.YjzeYtRHH4FJ1p4F.SGliD2', 'EMPLOYEE'),
(6, 6, 'kevin.pratama@dexa.com', '$2b$10$ZUMY8dL9NEdxpElAeQJFfO3Z/lYm5.YjzeYtRHH4FJ1p4F.SGliD2', 'EMPLOYEE')
ON DUPLICATE KEY UPDATE email = VALUES(email);

-- 2. ATTENDANCE DATABASE
USE attendance_db;

CREATE TABLE IF NOT EXISTS attendances (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    date DATE NOT NULL,
    check_in_time DATETIME NULL,
    check_in_photo VARCHAR(255) NULL,
    check_in_note VARCHAR(500) NULL,
    check_out_time DATETIME NULL,
    check_out_photo VARCHAR(255) NULL,
    check_out_note VARCHAR(500) NULL,
    status ENUM('ON_TIME', 'LATE', 'LEAVE', 'SICK', 'ABSENT') NOT NULL DEFAULT 'ON_TIME',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_employee_date (employee_id, date),
    INDEX idx_attendance_date (date),
    INDEX idx_employee_id (employee_id)
);

-- Seed Data: Sample Attendances
INSERT INTO attendances (employee_id, date, check_in_time, check_in_photo, check_in_note, check_out_time, check_out_photo, check_out_note, status) VALUES
(2, DATE_SUB(CURRENT_DATE, INTERVAL 1 DAY), CONCAT(DATE_SUB(CURRENT_DATE, INTERVAL 1 DAY), ' 08:45:00'), 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80', 'Planning sprint tasks A, B, and C for project X.', CONCAT(DATE_SUB(CURRENT_DATE, INTERVAL 1 DAY), ' 17:15:00'), 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80', 'Completed tasks A, B, and C and pushed PR for code review.', 'ON_TIME'),
(3, CURRENT_DATE, CONCAT(CURRENT_DATE, ' 08:58:00'), 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80', 'Starting design system token audit and mobile responsive wireframes.', CONCAT(CURRENT_DATE, ' 17:32:00'), 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80', 'Completed mobile wireframes and handed off Figma specs to frontend.', 'ON_TIME'),
(4, CURRENT_DATE, CONCAT(CURRENT_DATE, ' 09:24:00'), 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&auto=format&fit=crop&q=80', 'ISP outage in the morning, switched to mobile tethering for WFH.', NULL, NULL, NULL, 'LATE')
ON DUPLICATE KEY UPDATE employee_id = VALUES(employee_id);


-- Seed Data: Sample Attendances
INSERT INTO attendances (employee_id, date, check_in_time, check_in_photo, check_in_note, check_out_time, check_out_photo, check_out_note, status) VALUES
(2, DATE_SUB(CURRENT_DATE, INTERVAL 1 DAY), CONCAT(DATE_SUB(CURRENT_DATE, INTERVAL 1 DAY), ' 08:45:00'), 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80', 'Planning sprint tasks A, B, and C for project X.', CONCAT(DATE_SUB(CURRENT_DATE, INTERVAL 1 DAY), ' 17:15:00'), 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80', 'Completed tasks A, B, and C and pushed PR for code review.', 'ON_TIME'),
(3, CURRENT_DATE, CONCAT(CURRENT_DATE, ' 08:58:00'), 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80', 'Starting design system token audit and mobile responsive wireframes.', CONCAT(CURRENT_DATE, ' 17:32:00'), 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80', 'Completed mobile wireframes and handed off Figma specs to frontend.', 'ON_TIME'),
(4, CURRENT_DATE, CONCAT(CURRENT_DATE, ' 09:24:00'), 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&auto=format&fit=crop&q=80', 'ISP outage in the morning, switched to mobile tethering for WFH.', NULL, NULL, NULL, 'LATE')
ON DUPLICATE KEY UPDATE employee_id = VALUES(employee_id);