# Full-Stack E-Commerce Application

This is a complete, modern e-commerce application built with React, Node.js, Express, and MySQL.

## Project Structure

The project is divided into two main folders:
1. `backend/` - Node.js + Express API server with Sequelize ORM
2. `frontend/` - React application built with Vite

## Features

- **Authentication**: JWT-based login/registration with Role-Based Access Control
- **Products**: View, search, filter, and manage products
- **Cart & Checkout**: Complete shopping cart experience
- **User Dashboard**: Order history and profile management
- **Admin Dashboard**: Manage inventory, categories, and customer orders
- **UI/UX**: Modern, responsive design with glassmorphism elements, beautiful typography, and clean micro-interactions. No Tailwind, just flexible vanilla CSS!

## Getting Started

### Prerequisites
- Node.js (v18+)
- MySQL Server

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a MySQL database named `ecommerce_db` (or whatever you configure in `.env`).
4. Review the `.env` file credentials.
5. Run the development server:
   ```bash
   node server.js
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies (already done during scaffolding!):
   ```bash
   npm install
   ```
3. Run the Vite development server:
   ```bash
   npm run dev
   ```
4. Open the browser to the provided localhost link (typically `http://localhost:5173`). Have fun!
