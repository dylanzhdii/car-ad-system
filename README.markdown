# Car Advertisement System

## Overview
A simple car advertisement system built with Node.js, Express, and PostgreSQL. Supports user management (superuser, admin, system_user, external user), ad creation/deletion, transactions, advanced search, and related cars display. Deployed with Docker (including pgAdmin) and version-controlled with Git.

## Technologies Used
- **Node.js & Express**: Backend API.
- **PostgreSQL**: Database.
- **Docker**: Deployment with pgAdmin.
- **HTML/JavaScript**: Simple UI.

## Setup and Running
1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd car-ad-system
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file with:
   ```
   DATABASE_URL=postgres://postgres:password@db:5432/car_ad_system
   JWT_SECRET=mysecretkey123
   PGADMIN_DEFAULT_EMAIL=admin@admin.com
   PGADMIN_DEFAULT_PASSWORD=admin
   ```

4. **Run with Docker**:
   ```bash
   docker-compose up --build
   ```

5. **Access the app**:
   - UI: `http://localhost:3000`
   - API: `http://localhost:3000/api/...`
   - pgAdmin: `http://localhost:5050` (email: admin@admin.com, password: admin)

## API Endpoints
- `POST /api/users/register`: Register user (mobile, password, role).
- `POST /api/users/login`: Login and get JWT token.
- `GET /api/users/me`: Get current user.
- `POST /api/ads`: Create ad (system_user only).
- `DELETE /api/ads/:ad_id`: Delete ad (admin/superuser only).
- `POST /api/transactions`: Create transaction (system_user only).
- `GET /api/ads/:ad_id/related`: Get related cars.
- `GET /api/ads/search`: Search with filters (min_price, max_price, brand, color, condition).

## Database Schema
Defined in `init.sql` with sample data:
- Users: 3 users (superuser, admin, system_user).
- Brands: Toyota, BMW, Hyundai.
- Cars: 4 cars (Camry, Corolla, X5, Tucson).
- Ads: 3 ads.

## UI
Simple HTML/JavaScript interface for registration, login, ad creation, transaction creation, and search.

## Testing
- Login with sample users:
  - Mobile: `09123456791`, Password: `password`, Role: `system_user`
  - Mobile: `09123456790`, Password: `password`, Role: `admin`
  - Mobile: `09123456789`, Password: `password`, Role: `superuser`
- Use `car_id` 1-4 for creating ads (from sample data).
- Use pgAdmin to view database: `http://localhost:5050`.

## GitHub
1. Create a repository on GitHub.
2. Push the project:
   ```bash
   git init
   git add .
   git commit -m "Simple car ad system"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```