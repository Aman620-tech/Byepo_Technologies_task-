# Multi-Tenant Feature Flag Management System

## Project Overview

This project is a Multi-Tenant Feature Flag Management System built with:

- Node.js Backend
- Multiple Frontend Applications
- Role-based Access
- Organization-specific Feature Flags

The system contains:

- Backend API
- Super Admin Frontend
- Organization Admin Frontend
- User Frontend

---

# Project Structure

```txt
project-root/
│
├── backend/
├── frontend-superadmin/
├── frontend-admin/
├── frontend-user/
└── package.json
```

---

# Prerequisites

Make sure the following are installed:

- Node.js
- npm
- MongoDB

Recommended Versions:

```txt
Node.js >= 18
npm >= 9
MongoDB >= 6
```

---

# Initial Setup

## Install Root Dependencies

Run the following command in the project root:

```bash
npm install
```

This installs root-level packages such as:

- concurrently

---

# Environment Variables

Create a `.env` file inside the `backend` folder.

Example:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/feature-flags
JWT_SECRET=your_secret_key
SUPER_ADMIN_EMAIL=admin@example.com
SUPER_ADMIN_PASSWORD=admin123
```

---

# Running the Project

## Start All Applications Together

Run:

```bash
npm run dev
```

When running this command:

- All frontend and backend dependencies will be installed automatically
- All servers will start together

This will start:

- Backend Server
- Super Admin Frontend
- Admin Frontend
- User Frontend

---

# Individual Run Commands

## Backend

```bash
npm run dev:backend
```

## Super Admin Frontend

```bash
npm run dev:superadmin
```

## Admin Frontend

```bash
npm run dev:admin
```

## User Frontend

```bash
npm run dev:user
```

---

# Build Commands

## Build All Frontends

```bash
npm run build
```

---

# Individual Build Commands

## Super Admin Frontend

```bash
npm run build:superadmin
```

## Admin Frontend

```bash
npm run build:admin
```

## User Frontend

```bash
npm run build:user
```

---

# Features

## Super Admin

- Login
- Create Organizations
- View Organizations

## Organization Admin

- Signup
- Login
- Create Feature Flags
- Enable/Disable Features
- Delete Feature Flags

## User

- Check Feature Availability
- Organization-based Feature Access

---

# Tech Stack

## Backend

- Node.js
- Express.js
- MongoDB
- JWT Authentication

## Frontend

- React
- Vite
- Axios
- Tailwind CSS

---

# Authentication

- Custom JWT Authentication
- Role-Based Access Control
- Organization-Level Authorization

---

# Notes

- All feature flags are organization-specific
- Super Admin credentials are configured using environment variables
- Ensure MongoDB is running before starting the backend server

---

# Troubleshooting

## concurrently not recognized

Run:

```bash
npm install
```

---

## MongoDB connection error

Make sure MongoDB is running locally:

```bash
mongod
```

---

# Available Scripts

```json
{
  "install:all": "npm --prefix backend install && npm --prefix frontend-superadmin install && npm --prefix frontend-admin install && npm --prefix frontend-user install",

  "dev:backend": "npm --prefix backend run dev",

  "dev:superadmin": "npm --prefix frontend-superadmin run dev",

  "dev:admin": "npm --prefix frontend-admin run dev",

  "dev:user": "npm --prefix frontend-user run dev",

  "dev": "npm run install:all && concurrently \"npm run dev:backend\" \"npm run dev:superadmin\" \"npm run dev:admin\" \"npm run dev:user\"",

  "build:superadmin": "npm --prefix frontend-superadmin run build",

  "build:admin": "npm --prefix frontend-admin run build",

  "build:user": "npm --prefix frontend-user run build",

  "build": "npm run build:superadmin && npm run build:admin && npm run build:user"
}
```