# Multi-Tenant Notification & Alert Management System

A robust, production-ready Full-Stack application designed to manage, assign, and track multi-tenant emergency and system alerts. Built with a Spring Boot (Java 17) backend and a modern React (Vite) frontend featuring Framer Motion animations and Glassmorphism UI.

## 🚀 Features

### **Authentication & Security**
- Secure JWT-based Authentication.
- Role-Based Access Control (RBAC): `SUPER_ADMIN`, `TENANT_ADMIN`, `USER`.
- Tenant-isolated data context natively woven into the JWT lifecycle.
- Passwords secured using BCrypt hashing.

### **Multi-Tenant Architecture**
- Complete data isolation per tenant.
- Automatic routing of alert data via thread-local `TenantContext` interceptors.

### **Core Interactive Dashboard**
- **Animated UI**: Fluid page transitions and hovering statistics cards built with Framer Motion.
- **Analytics & Reporting**: Interactive Chart.js graphs mapping Alert Severities and current lifecycle Resolutions.
- **Geospatial Mapping**: Full-canvas map view connecting to OpenStreetMap using Leaflet, dynamically clustering and pinning active alerts based on Lat/Long coordinates.

### **Alert Workflow Logic**
- Customized status pipelines: `Open` → `In Progress` → `Closed`.
- Formatted incident reporting (`Fire`, `Medical`, `Crime`, `System`).
- Assign alerts strictly mapped by tenant clearance levels.

---

## 🛠️ Tech Stack

### **Backend**
- **Java 17** & **Spring Boot 3.2**
- **Spring Security** (JWT + Filter Chains)
- **Spring Data JPA / Hibernate**
- **MySQL Database**
- **Lombok**, **Validation**, Global Exception Handlers

### **Frontend**
- **React.js** (Vite)
- **Tailwind CSS** (Glassmorphism & Blob Animations)
- **Framer Motion** (Page and micro-interactions)
- **Axios** (API Networking)
- **React Router Dom**
- **Chart.js / react-chartjs-2**
- **React-Leaflet / OpenStreetMap**

---

## 📸 Screenshots

*(Add your screenshots here before pushing to GitHub)*

| Dashboard Overview | Analytics & Statistics |
|:---:|:---:|
| <img src="[docs/dashboard.png](https://github.com/user-attachments/assets/07bd6bab-ea38-48e6-9a7d-09729ca1206e)" width="400" alt="Dashboard View"> | <img src="docs/statistics.png" width="400" alt="Analytics View"> |
<img width="1643" height="894" alt="image" src="https://github.com/user-attachments/assets/07bd6bab-ea38-48e6-9a7d-09729ca1206e" />

<img width="1886" height="938" alt="image" src="https://github.com/user-attachments/assets/2c88be5c-b3f2-4786-9046-8e02d241119e" />


| Map View (Leaflet) | Interactive Alert List |
|:---:|:---:|
<img width="1903" height="952" alt="image" src="https://github.com/user-attachments/assets/28f29572-1f43-49c7-9deb-4b4bd8a2caad" />
<img width="1786" height="927" alt="image" src="https://github.com/user-attachments/assets/c6252343-40d5-44ff-91b6-9a5e07de978d" />



| <img src="docs/map.png" width="400" alt="Map View"> | <img src="docs/alerts.png" width="400" alt="Alerts View"> |

---

## ⚙️ Local Development Setup

### Prerequisites
- Node.js (v18+)
- Java JDK 17
- Maven
- MySQL Server (Running on port 3306)

### 1. Database Configuration
Ensure MySQL is running. The application is configured to auto-generate the schema and sample data. 
If needed, update the database credentials in `backend/src/main/resources/application.yml`:
```yaml
spring:
  datasource:
    username: root
    password: tushar # Update this to your local MySQL password
```

### 2. Start the Backend
Navigate to the backend directory and launch the Spring Boot application:
```bash
cd backend
mvn clean install -DskipTests
mvn spring-boot:run
```
*The backend will run on `http://localhost:8080`. Note: On first run, it will automatically populate 20 sample alerts and 3 user roles.*

### 3. Start the Frontend
In a new terminal, navigate to the frontend directory:
```bash
cd frontend
npm install
npm run dev
```
*The frontend will run on `http://localhost:5173`.*

---

## 🔐 Default Test Credentials

The system automatically seeds the database with an "Acme Corp" tenant and the following users:

- **Super Admin**: `super@admin.com` | Password: `admin123`
- **Tenant Admin**: `admin@acme.com` | Password: `password`
- **Standard User**: `user@acme.com` | Password: `password`

---

## 📁 Folder Structure

```text
/
├── backend/                  # Spring Boot API
│   ├── src/main/java/com/alertsystem/
│   │   ├── config/           # Database Seeding
│   │   ├── controller/       # REST Endpoints
│   │   ├── dto/              # Data Transfer Objects
│   │   ├── exception/        # Global Error Handling
│   │   ├── model/            # JPA Entities 
│   │   ├── repository/       # Data Access
│   │   ├── security/         # JWT & Filters
│   │   └── service/          # Business Logic
│   └── pom.xml
│
└── frontend/                 # React Application
    ├── src/
    │   ├── api/              # Axios instance & Interceptors
    │   ├── components/       # Reusable UI (Navbar, Transitions)
    │   ├── context/          # Authentication Context
    │   ├── pages/            # View Routes (Dashboard, Map, List)
    │   ├── App.jsx           # App Routing
    │   └── index.css         # Tailwind Injections
    ├── tailwind.config.js    # Theming & Animations
    └── package.json
```
