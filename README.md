# SpendWise — Personal Finance Tracker

SpendWise is a full-stack personal finance application for tracking income and expenses, managing budgets, and reviewing financial activity through a dashboard.

## Features

- User registration and login with JWT authentication
- Create and manage income and expense transactions
- Create and manage budgets
- Dashboard and financial reports
- English and French language support
- PostgreSQL persistence with Entity Framework Core
- Frontend and backend tests
- Docker Compose setup for running the application locally

## Tech Stack

**Frontend:** React, TypeScript, Vite, Redux Toolkit, RTK Query, Tailwind CSS

**Backend:** ASP.NET Core Web API, C#, Entity Framework Core

**Database:** PostgreSQL

**Testing:** Vitest, React Testing Library, ASP.NET Core testing tools

**DevOps:** Docker, Docker Compose, Nginx

## Run Locally with Docker

1. Install Docker Desktop.
2. Clone this repository.
3. Create a `.env` file based on `.env.example` and set local development values.
4. Start the application:

   ```bash
   docker compose up -d --build
   ```

5. Open the frontend at `http://localhost:5173`.
6. Open Swagger at `http://localhost:5238/swagger`.

To stop the containers without deleting the database volume:

```bash
docker compose down
```

## Configuration and Security

Do not commit `.env` files, real credentials, or production secrets. Use environment variables for local configuration. The included settings are intended for development, not production deployment.

## Project Structure

- `spendwise/` — React frontend
- `SpendWise.Api/` — ASP.NET Core API
- `SpendWise.Api.Tests/` — backend tests
- `docker-compose.yml` — local multi-container setup

## Purpose

Built as a portfolio project to demonstrate full-stack development, REST API design, authentication, relational data persistence, automated testing, and containerization.