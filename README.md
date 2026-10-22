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
- Secure admin login using the shared login page
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
https://github.com/ADITYA-PROGRAMMER5/Campus-Problem-Reporter.git
cd CampusProblemReporter
```

### 2. Set up the database

Open PostgreSQL and create a database:

```sql
CREATE DATABASE campus_problem_reporter;
```

### 3. Create the `users` Table

This table stores user information, including student and admin accounts.

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

### 4. Create the `reports` Table

This table stores campus problem reports submitted by users. Each report is linked to a user through `user_id`.

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

- **Primary keys:** `id` uniquely identifies each user and report.
- **Foreign key:** `reports.user_id` references `users.id`.
- **Unique email:** Each user must register with a different email address.
- **Default role:** New users receive the `student` role unless an authorized administrator assigns a different role.
- **Default priority:** New reports have `medium` priority.
- **Default status:** New reports start with `pending` status.

**Important:** Create the `users` table before the `reports` table because the reports table references the users table.

### 5. Configure the backend

Configure your PostgreSQL connection in the backend configuration file.

Keep database credentials private. Do not commit passwords, secrets, or other sensitive configuration to GitHub.

Start the PHP development server from the `backend` directory:

```bash
php -S localhost:8000
```

The backend API will be available at:

```text
http://localhost:8000/api/
```

### 6. Configure and start the frontend

Open a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL shown by Vite, typically:

```text
http://localhost:5173
```
