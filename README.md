# 🎓 Campus Problem Reporter

A web based application that allows college students to report campus problems and track their status. Administrators can view submitted reports and update their status to help manage campus issues more efficiently.

## 🚀 Features

### 👨‍🎓 Student
- Student registration and login
- Submit campus problem reports
- View personal reports
- Edit and delete personal reports
- Search reports and filter by status
- Pagination for report lists
- Track report status

### 🛡️ Admin
- Admin login using the shared login page
- View submitted student reports
- View report statistics
- Filter reports by status
- Update report status
- Refresh report data

### 🔐 Security
- Password hashing
- PHP session-based authentication
- Role-based access checks for admin functionality
- Report ownership checks for student updates and deletions
- Server-side validation of report input
- Database queries using PDO prepared statements
- Logout endpoint to destroy the server-side session

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React | Frontend UI |
| Vite | Frontend development server |
| JavaScript | Application logic |
| CSS | Styling and responsive layout |
| PHP | Backend API |
| PostgreSQL | Database |
| PDO | Database access |
| Git & GitHub | Version control |

## 📁 Project Structure

```text
CampusProblemReporter/
├── frontend/
│   └── src/
│       ├── Components/
│       │   ├── Dashboard.jsx
│       │   ├── login.jsx
│       │   ├── register.jsx
│       │   ├── ReportForm.jsx
│       │   ├── ReportList.jsx
│       │   ├── AdminDashboard.jsx
│       │   └── AdminDashboard.css
│       └── Services/
│           └── api.js
│
├── backend/
│   ├── api/
│   │   ├── login.php
│   │   ├── register.php
│   │   ├── logout.php
│   │   ├── createReport.php
│   │   ├── myReports.php
│   │   ├── reports.php
│   │   ├── users.php
│   │   ├── test.php
│   │   ├── updateReport.php
│   │   ├── deleteReport.php
│   │   └── adminUpdateReportStatus.php
│   ├── db.php
│   └── config.php
│
├── README.md
└── LICENSE
```

## ⚙️ Prerequisites

Install the following before running the project:

- [Node.js](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/download/)
- [PHP](https://www.php.net/downloads.php)
- Git (optional, for cloning the repository)

## 💻 Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/ADITYA-PROGRAMMER5/Campus-Problem-Reporter.git
cd Campus-Problem-Reporter
```

### 2. Create the database

Open PostgreSQL using pgAdmin or `psql` and execute:

```sql
CREATE DATABASE campus_problem_reporter;
```

Connect to the newly created `campus_problem_reporter` database before creating the tables.

### 3. Create the `users` table

This table stores student and administrator account information.

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'student',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4. Create the `reports` table

This table stores campus problem reports. Each report belongs to a user through the `user_id` foreign key.

```sql
CREATE TABLE reports (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    location VARCHAR(150) NOT NULL,
    priority VARCHAR(20) NOT NULL DEFAULT 'medium',
    status VARCHAR(30) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_report_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
);
```

### Database Relationships

- **Primary keys:** The `id` column uniquely identifies each user and report.
- **Foreign key:** `reports.user_id` references `users.id`.
- **Unique email:** Each account must use a unique email address.
- **Default role:** New users receive the `student` role.
- **Default priority:** New reports use `medium` priority.
- **Default status:** New reports start with `pending` status.

**Important:** Create the `users` table before the `reports` table because the reports table references the users table.

The `updated_at` column receives its initial timestamp when the report is created. Automatically updating it when a report changes requires additional backend logic or a database trigger.

### 5. Configure the backend

Configure the PostgreSQL connection in the backend configuration files according to your local environment.

Keep database credentials private. Do not commit passwords or other sensitive configuration to GitHub.

Start the PHP development server from the `backend` directory:

```bash
php -S localhost:8000
```

The backend API base URL is:

```text
http://localhost:8000/api/
```

### 6. Install and start the frontend

Open a separate terminal and run:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL displayed by Vite, typically:

```text
http://localhost:5173
```

Keep both development servers running while using the application.

## 🔌 API Endpoints

The following endpoints are available in the backend API.

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `register.php` | Register an account |
| POST | `login.php` | Authenticate a user |
| POST | `logout.php` | End the current session |
| POST | `createReport.php` | Create a report |
| GET | `myReports.php` | Fetch the logged-in student's reports |
| GET | `reports.php` | Fetch reports for the admin dashboard |
| POST | `updateReport.php` | Update an owned report |
| POST | `deleteReport.php` | Delete an owned report |
| POST | `adminUpdateReportStatus.php` | Update report status as an admin |

Protected endpoints require an authenticated PHP session. Access depends on the user's role and, for student report operations, report ownership.

## 🔄 Report Statuses

- **Pending:** The issue is awaiting action.
- **In Progress:** The issue is being addressed.
- **Resolved:** The issue has been resolved.

## 🔒 Security Notes

- Never store plain-text passwords.
- Keep database credentials out of public repositories.
- Validate user input on the server.
- Enforce authentication and authorization in backend APIs, not only in React.
- Use HTTPS and secure cookie settings when deploying to production.
- Review and test all API endpoints before deploying publicly.

## 🎯 Project Objective

The goal of this project is to make campus issue reporting more organized, transparent, and manageable by providing a central platform for students and administrators.

## 👨‍💻 Author

[Aditya Jadhav](https://github.com/ADITYA-PROGRAMMER5)

**BCA Student | Aspiring Full-Stack Developer**

---

*Built as a learning project to practice React, PHP, PostgreSQL, API development, authentication, and full-stack application design.*
