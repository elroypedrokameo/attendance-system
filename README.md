# Dexa WFH Attendance & Employee Monitoring System

A fullstack web application for employee Work-From-Home (WFH) attendance logging and human resources monitoring.

Built with a **Microservices Architecture** using NestJS, **Database-per-service** on MySQL 8.4, **Cloudflare R2 Object Storage** for photo proofs, and a Single Page Application (SPA) frontend using **React 19, TypeScript, TanStack Query, and Tailwind CSS**.

---

## 1. Tech Stack

### Backend & Microservices
- **Framework:** NestJS 11 (Node.js & TypeScript)
- **Architecture Pattern:** API Gateway + Internal Microservices via TCP Transport (`@nestjs/microservices`)
- **Database ORM:** TypeORM with `mysql2` driver
- **Authentication & Authorization:** JWT (`@nestjs/jwt`, `passport-jwt`, `bcrypt`) with Role-Based Access Control (RBAC: `ADMIN` vs `EMPLOYEE`)
- **File Storage:** Cloudflare R2 Object Storage via `@aws-sdk/client-s3` (S3-compatible, Multer memory storage, served via Cloudflare global CDN)
- **API Documentation:** Swagger / OpenAPI (`@nestjs/swagger`)

### Database
- **Engine:** MySQL 8.4 (InnoDB, UTF8mb4)
- **Database-per-Service Pattern:**
  - `employee_db`: Manages master departments, employees, and user login credentials
  - `attendance_db`: Manages daily attendance records, check-in/out timestamps, Cloudflare R2 photo proof URLs, and attendance statuses

### Frontend
- **Core:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS + Lucide React Icons
- **Server State & Caching:** TanStack Query (React Query) with custom clean-code hooks (`useAuthApi`, `useEmployees`, `useAttendance`)
- **HTTP Client:** Axios with JWT request interceptors & automatic redirect on session expiry
- **Webcam & Capture:** `react-webcam` (live camera capture only to prevent uploading old photos)

### Infrastructure & Deployment
- **Containerization:** Docker & Docker Compose
- **Reverse Proxy:** Nginx (serving React SPA on host port 8080 and proxying `/api` to the API Gateway)
- **Cloud Storage:** Cloudflare R2 Bucket (`dexa-attendance-system`) with Public R2 CDN delivery

---

## 2. System Architecture

```
                    ┌────────────────────────┐
                    │  Browser (React 19)    │
                    └───────────┬────────────┘
                                │ :8080 (HTTP)
                                ▼
                    ┌────────────────────────┐
                    │  Nginx Reverse Proxy   │
                    └───────────┬────────────┘
                                │ Proxies /api
                                ▼
                    ┌────────────────────────┐         Uploads Photo
                    │      api-gateway       ├─────────────────────────┐
                    │   (HTTP REST :3000)    │                         ▼
                    │  Auth / RBAC / Multer  │              ┌─────────────────────┐
                    └─────┬────────────┬─────┘              │    Cloudflare R2    │
                          │            │                    │   Object Storage    │
               TCP :3001  │            │  TCP :3002         │ (Public CDN URL)    │
                          ▼            ▼                    └─────────────────────┘
             ┌──────────────────┐    ┌────────────────────┐
             │ employee-service │    │ attendance-service │
             └────────┬─────────┘    └─────────┬──────────┘
                      │                        │
                      ▼                        ▼
               [ employee_db ]          [ attendance_db ]
                      └─────── MySQL 8.4 ──────┘
```

### Architectural Highlights

1. **API Gateway:** The single external HTTP entry point. Handles JWT verification, role-based guard enforcement (`ADMIN` vs `EMPLOYEE`), and API composition (merging attendance records with employee details across microservices).
2. **Cloudflare R2 Photo Storage:** Check-in and check-out photos are streamed directly into Cloudflare R2 using Multer `memoryStorage()`, keeping server disks completely stateless and delivering photos through Cloudflare's high-speed global CDN (`.r2.dev`).
3. **Internal Microservices (TCP):** `employee-service` and `attendance-service` run in Docker's private bridge network, communicating over NestJS native TCP transport using `@MessagePattern`.
4. **Database-per-Service:** Each microservice manages its own schema (`employee_db` and `attendance_db`), ensuring clean domain boundary isolation.
5. **Server-Side Timestamping:** Dates and timestamps are captured on the server (`new Date()`) when requests arrive, preventing client-side clock tampering. Check-ins after the configured `WORK_START_TIME` (default `09:15`) are automatically flagged as `LATE`.
6. **Duplicate Prevention:** A unique constraint on `(employee_id, date)` guarantees an employee cannot check in multiple times on the same calendar day.

---

## 3. How to Run the Project

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.
- [Node.js](https://nodejs.org/) v20+ (optional, only if running outside Docker).

### Quick Start with Docker Compose

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd attendance-system
   ```

2. **Copy the environment configuration:**
   ```bash
   cp .env.example .env
   ```
   *(Configure your database passwords, JWT secrets, and Cloudflare R2 credentials in `.env`).*

3. **Build and start all services:**
   ```bash
   docker compose up --build -d
   ```

4. **Verify running containers:**
   ```bash
   docker compose ps
   ```

5. **Access the application:**
   - **Frontend Web App:** [http://localhost:8080](http://localhost:8080) (Port 8080)
   - **Interactive Swagger API Docs:** [http://localhost:3000/api/docs](http://localhost:3000/api/docs)
   - **API Gateway Base URL:** [http://localhost:3000/api](http://localhost:3000/api)
   - **MySQL Host Port:** `localhost:3307`

6. **Stop the services:**
   ```bash
   docker compose down
   ```

---

## 4. Default Seed Accounts

The database is automatically pre-seeded with departments, employees, and user credentials via `database/init.sql`:

| Role | Name | Department & Position | Email | Password | Access & Capabilities |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **HR Admin** | Elroy Admin | Human Resources (HR Administrator) | `admin@dexa.com` | `admin123` | Full access: HR Monitoring Dashboard, Employee CRUD, View-only Attendance records |
| **WFH Employee** | Elroy Kameo | IT Department (Software Engineer) | `elroy@dexa.com` | `password123` | Employee Dashboard, Check-in/out with Cloudflare R2 photo, History, Profile |
| **WFH Employee** | Sarah Wijaya | Product Design (UI/UX Designer) | `sarah.wijaya@dexa.com` | `password123` | Active employee account with attendance history |
| **WFH Employee** | Budi Santoso | IT Department (Backend Engineer) | `budi.santoso@dexa.com` | `password123` | Active employee account with attendance history |
| **WFH Employee** | Amanda Putri | Human Resources (HR Specialist) | `amanda.putri@dexa.com` | `password123` | Active employee account |
| **Inactive** | Kevin Pratama | Finance & Accounting (Financial Analyst) | `kevin.pratama@dexa.com` | `password123` | Inactive employee account (`is_active = 0`) for testing login block / filter |

---

## 5. API Endpoints Reference

All endpoints are exposed through the API Gateway with prefix `/api`. Detailed schema definitions and request/response payloads are accessible in Swagger at `http://localhost:3000/api/docs`.

### Authentication
| Method | Endpoint | Authorization | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Public | Authenticates user credentials and returns JWT bearer token + user profile |
| `GET` | `/api/auth/profile` | Authenticated | Retrieves current authenticated user session and employee details |

### Employee Management (HR Admin)
| Method | Endpoint | Authorization | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/employees` | HR Admin | List employees with search, department filter, and pagination |
| `GET` | `/api/employees/departments` | Authenticated | List all master departments |
| `GET` | `/api/employees/:id` | HR Admin | Get employee details by ID |
| `POST` | `/api/employees` | HR Admin | Create new employee and automatically provision login account |
| `PATCH` | `/api/employees/:id` | HR Admin | Update employee personal or job information |
| `DELETE` | `/api/employees/:id` | HR Admin | Soft-deactivate employee account (`is_active = 0`) |

### Attendance (Employee & Monitoring)
| Method | Endpoint | Authorization | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/attendance/check-in` | Employee | Submit daily check-in (multipart: `photo` image uploaded to Cloudflare R2, `note` work description) |
| `POST` | `/api/attendance/check-out` | Employee | Submit daily check-out (multipart: `photo` image uploaded to Cloudflare R2) |
| `GET` | `/api/attendance/today` | Employee | Retrieve authenticated employee's check-in/out status for today |
| `GET` | `/api/attendance/history` | Employee | Retrieve authenticated employee's historical attendance records |
| `GET` | `/api/attendance` | HR Admin | Monitor all employee attendance records with date, department, and status filters |
| `GET` | `/api/attendance/summary` | HR Admin | Get daily attendance metric card counters (Total, Present, Late, etc.) |

---

## 6. Project Directory Structure

```
attendance-system/
├── backend/
│   ├── api-gateway/             # HTTP REST Gateway, Auth, RBAC, Cloudflare R2, Swagger
│   ├── attendance-service/      # Attendance TCP microservice & attendance_db logic
│   └── employee-service/        # Employee & User TCP microservice & employee_db logic
├── frontend/
│   ├── src/
│   │   ├── api/                 # Axios HTTP client configuration
│   │   ├── context/             # AuthContext session state
│   │   ├── hooks/               # TanStack Query custom hooks (useAuthApi, useEmployees, etc.)
│   │   ├── layouts/             # Admin & Employee shell layouts
│   │   ├── pages/               # React page components (Login, Dashboard, Actions, etc.)
│   │   └── routes/              # ProtectedRoute guard wrapper
│   ├── Dockerfile
│   └── nginx.conf               # Frontend reverse proxy config
├── database/
│   └── init.sql                 # MySQL schema definitions and initial seed data
├── docker-compose.yml           # Multi-service container orchestration
├── .env.example                 # Environment configuration template
└── README.md                    # Project documentation
```
