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
