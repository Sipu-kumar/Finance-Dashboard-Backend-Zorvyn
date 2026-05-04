<div align="center">

# 🏦 Zorvyn Finance Suite

### A Full-Stack Financial Dashboard & Management System

![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2.4-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Java](https://img.shields.io/badge/Java-17-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)

*A secure, role-based finance management platform with real-time analytics, payment tracking, and comprehensive reporting*

[Features](#-features) · [Getting Started](#-getting-started) · [API Docs](#-api-endpoints) · [Tech Stack](#%EF%B8%8F-tech-stack) · [Project Structure](#-project-structure)

</div>

---

## 📋 What This Project Does

**Zorvyn Finance Suite** is a complete financial management web application that allows users to:

- 📊 **Track Income & Expenses** — Add, categorize, and manage all financial transactions
- 📈 **View Dashboard Analytics** — Get a real-time summary of balance, income, expenses, and savings
- 📉 **Analyze Performance** — Visualize balance trends, spending by category, and income vs expenses over time
- 💸 **Manage Payments** — Create, track, and schedule payments with multiple methods (UPI, Card, Bank Transfer, Wallet)
- 📑 **Generate Reports** — Create monthly, quarterly, annual, and custom financial reports
- ⚙️ **System Settings** — Export/import data as CSV, configure preferences
- 🔐 **Secure Access** — JWT authentication with role-based access control (Admin, Analyst, Viewer)

---

## ✨ Features

### 🔐 Authentication & Security
- JWT-based stateless authentication
- BCrypt password hashing
- Role-based access control (RBAC) — **ADMIN**, **ANALYST**, **VIEWER**
- Auto session expiry with redirect to login
- Protected routes on frontend

### 📊 Dashboard
- Summary cards for Balance, Income, Expenses, and Savings
- Trend indicators (up/down arrows)
- Summary overview table
- INR (₹) currency formatting

### 📝 Records
- Add income & expense transactions (Admin only)
- Category-based organization (Salary, Food & Dining, Utilities, etc.)
- Transaction history table with sorting by date
- Delete records (Admin only)
- View-only mode for Viewer role

### 📈 Performance Analytics
- **Balance Trend** — Line chart showing cumulative balance over 6M / 1Y / All time
- **Spending by Category** — Donut chart with interactive legend
- **Income vs Expenses** — Bar chart comparing monthly income & expenses
- **Category Breakdown** — Detailed table with percentage share and progress bars
- All charts are pure SVG — no external chart libraries

### 💸 Payments
- Create payments with payee, amount, method, and category
- Payment methods: UPI, Card, Bank Transfer, Wallet
- Status tracking: Completed, Pending, Failed, Scheduled
- Filter payment history by status
- Schedule future payments
- Auto-generated reference IDs (PAY-XXXXXXXX)
- Stats dashboard: Total Paid, Total Payments, Pending, Scheduled
- Mark scheduled payments as completed

### 📑 Reports
- Generate Monthly, Quarterly, Annual, and Custom reports
- View report history with growth percentages
- Download reports
- Delete old reports (Admin only)

### ⚙️ Settings
- **Data Management** — Export all data as CSV, Import from CSV, Clear all data
- **System Preferences** — Auto-save toggle, Animations toggle, Date format selection

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| **Java 17** | Core language |
| **Spring Boot 3.2.4** | Backend framework |
| **Spring Security** | Authentication & authorization |
| **Spring Data JPA** | Database ORM |
| **Hibernate** | Object-relational mapping |
| **PostgreSQL** | Relational database |
| **JWT (jjwt 0.11.5)** | Token-based auth |
| **Lombok** | Boilerplate reduction |
| **Maven** | Build & dependency management |

### Frontend
| Technology | Purpose |
|---|---|
| **React 18.3** | UI framework |
| **Vite 5.4** | Build tool & dev server |
| **React Router v6** | Client-side routing |
| **Vanilla CSS** | Styling (dark theme) |
| **SVG Charts** | Data visualization (no chart library) |

---

## 🔧 Prerequisites

Before running this project, make sure you have:

| Requirement | Version | Download |
|---|---|---|
| **Java JDK** | 17 or higher | [Download](https://adoptium.net/) |
| **Node.js** | 18 or higher | [Download](https://nodejs.org/) |
| **PostgreSQL** | 13 or higher | [Download](https://www.postgresql.org/download/) |
| **Maven** | 3.8+ (bundled via `mvnw`) | Included in project |
| **Git** | Latest | [Download](https://git-scm.com/) |

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Sipu-kumar/Finance-Dashboard-Backend-Zorvyn.git
cd Finance-Dashboard-Backend-Zorvyn
```

### 2️⃣ Setup PostgreSQL Database

Open your PostgreSQL client (psql, pgAdmin, etc.) and run:

```sql
CREATE DATABASE finance_db;
```

### 3️⃣ Configure Backend

Edit the file `dashboard/src/main/resources/application.properties`:

```properties
# Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/finance_db
spring.datasource.username=postgres
spring.datasource.password=YOUR_PASSWORD

# JPA / Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# Server
server.port=8080

# JWT
jwt.secret=a-very-long-secret-key-that-is-at-least-32-bytes-long!
jwt.expiration=3600000
```

> ⚠️ **Important:** Replace `YOUR_PASSWORD` with your actual PostgreSQL password.

### 4️⃣ Start the Backend

```bash
cd dashboard
./mvnw spring-boot:run
```

The backend will start on **http://localhost:8080**

> On Windows, use `.\mvnw.cmd spring-boot:run`

### 5️⃣ Install Frontend Dependencies

Open a new terminal:

```bash
cd frontend
npm install
```

### 6️⃣ Start the Frontend

```bash
npm run dev
```

The frontend will start on **http://localhost:5173**

### 7️⃣ Open the Application

Visit **http://localhost:5173** in your browser.

- **Sign Up** to create a new account
- **Log In** with your credentials
- Start managing your finances! 🎉

---

## 👥 User Roles

| Role | Permissions |
|---|---|
| **ADMIN** | Full access — add/delete records, create payments, manage users, generate reports |
| **ANALYST** | Add records, create payments, generate reports, view analytics |
| **VIEWER** | View-only access — dashboard, records, performance, reports |

---

## 🔑 API Endpoints

### 🔐 Authentication
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/auth/login` | Login & get JWT token | Public |
| `POST` | `/auth/signup` | Register new user | Public |

### 👤 Users
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/users` | List all users | ADMIN |
| `POST` | `/users` | Create a user | ADMIN |

### 💰 Records
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/records` | Get user's records | All roles |
| `POST` | `/records` | Add a record | ADMIN, ANALYST |
| `DELETE` | `/records/{id}` | Delete a record | ADMIN |

### 📊 Dashboard
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/dashboard/summary` | Income/expense/balance summary | All roles |
| `GET` | `/dashboard/performance?months=6` | Balance trend & spending analytics | All roles |

### 💸 Payments
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/payments` | Get all payments (optional `?status=`) | All roles |
| `GET` | `/payments/stats` | Payment statistics | All roles |
| `GET` | `/payments/scheduled` | Upcoming scheduled payments | All roles |
| `POST` | `/payments` | Create a payment | ADMIN, ANALYST |
| `PATCH` | `/payments/{id}/complete` | Mark payment as completed | ADMIN, ANALYST |
| `DELETE` | `/payments/{id}` | Delete a payment | ADMIN |

### 📑 Reports
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/reports` | Get all reports | All roles |
| `POST` | `/reports/generate` | Generate a report | ADMIN, ANALYST |
| `POST` | `/reports/custom` | Generate custom date range report | ADMIN, ANALYST |
| `DELETE` | `/reports/{id}` | Delete a report | ADMIN |

---

## 📂 Project Structure

```
Finance-Dashboard-Backend-Zorvyn/
│
├── dashboard/                          # 🟢 Spring Boot Backend
│   ├── src/main/java/com/finance/dashboard/
│   │   ├── controller/
│   │   │   ├── AuthController.java         # Login & Signup
│   │   │   ├── UserController.java         # User management
│   │   │   ├── RecordController.java       # Income/expense CRUD
│   │   │   ├── DashboardController.java    # Summary APIs
│   │   │   ├── PerformanceController.java  # Analytics APIs
│   │   │   ├── PaymentController.java      # Payment CRUD
│   │   │   └── ReportController.java       # Report generation
│   │   ├── service/
│   │   │   ├── DashboardService.java       # Dashboard logic
│   │   │   ├── RecordService.java          # Records business logic
│   │   │   ├── PerformanceService.java     # Analytics computation
│   │   │   ├── PaymentService.java         # Payment processing
│   │   │   └── ReportService.java          # Report generation
│   │   ├── model/
│   │   │   ├── User.java                   # User entity
│   │   │   ├── Role.java                   # Role enum
│   │   │   ├── Record.java                 # Transaction entity
│   │   │   ├── RecordType.java             # INCOME / EXPENSE enum
│   │   │   ├── Payment.java                # Payment entity
│   │   │   ├── PaymentStatus.java          # Payment status enum
│   │   │   └── Report.java                 # Report entity
│   │   ├── repository/                     # JPA repositories
│   │   ├── security/                       # JWT filter, config
│   │   └── dto/                            # Data transfer objects
│   ├── src/main/resources/
│   │   └── application.properties          # App configuration
│   └── pom.xml                             # Maven dependencies
│
├── frontend/                           # 🔵 React Frontend
│   ├── src/
│   │   ├── api/
│   │   │   ├── auth.js                     # Login/signup API
│   │   │   ├── dashboard.js                # Dashboard API
│   │   │   ├── records.js                  # Records API
│   │   │   ├── performance.js              # Performance API
│   │   │   ├── payments.js                 # Payments API
│   │   │   └── reports.js                  # Reports API
│   │   ├── components/
│   │   │   └── AppLayout.jsx               # Sidebar + topbar layout
│   │   ├── pages/
│   │   │   ├── Login.jsx                   # Login page
│   │   │   ├── Signup.jsx                  # Registration page
│   │   │   ├── Dashboard.jsx / .css        # Main dashboard
│   │   │   ├── Records.jsx / .css          # Transaction management
│   │   │   ├── Performance.jsx / .css      # Analytics & charts
│   │   │   ├── Payment.jsx / .css          # Payment management
│   │   │   ├── Reports.jsx / .css          # Report generation
│   │   │   └── Settings.jsx / .css         # App settings
│   │   ├── App.jsx                         # Router & protected routes
│   │   ├── index.css                       # Global styles
│   │   └── main.jsx                        # Entry point
│   ├── package.json
│   └── vite.config.js
│
└── README.md                           # 📖 This file
```

---

## 🎨 UI Pages

| Page | Description |
|---|---|
| **Login / Signup** | Purple-gradient themed auth pages with form validation |
| **Dashboard** | Summary cards (Balance, Income, Expenses, Savings) + overview table |
| **Records** | Add/view/delete transactions with category chips and type badges |
| **Performance** | Balance trend line chart, spending donut chart, income vs expense bars |
| **Payment** | Quick Pay form, payment history with status badges, scheduled payments |
| **Reports** | Generate & manage financial reports with growth indicators |
| **Settings** | Data export/import, system preferences |

---

## 🔒 Security Architecture

```
Client Request
    │
    ▼
┌─────────────────────┐
│   JWT Auth Filter    │ ← Validates token from Authorization header
└─────────────────────┘
    │
    ▼
┌─────────────────────┐
│  Security Config     │ ← CORS, CSRF, session management
└─────────────────────┘
    │
    ▼
┌─────────────────────┐
│  @PreAuthorize       │ ← Role-based method security
└─────────────────────┘
    │
    ▼
┌─────────────────────┐
│  Controller → Service│ ← Business logic (user-scoped data)
└─────────────────────┘
```

---

## 🧪 Quick Test with cURL

### 1. Register a User
```bash
curl -X POST http://localhost:8080/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin","email":"admin@zorvyn.com","password":"admin123","role":"ADMIN"}'
```

### 2. Login & Get Token
```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@zorvyn.com","password":"admin123"}'
```

### 3. Use the Token
```bash
curl -X GET http://localhost:8080/dashboard/summary \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📜 License

This project is for **educational and portfolio purposes**. Feel free to use, modify, and learn from it.

---

<div align="center">

**Built with ❤️ by [Sipu Kumar](https://github.com/Sipu-kumar)**

⭐ **Star this repo** if you found it useful!

</div>
