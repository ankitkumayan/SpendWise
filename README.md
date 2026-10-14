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


<img width="1194" height="616" alt="image" src="https://github.com/user-attachments/assets/bee2f11c-e244-487b-9d07-a556a961d494" />


<img width="1202" height="612" alt="image" src="https://github.com/user-attachments/assets/44ac0239-2f36-4618-9ca4-42104019d352" />


<img width="1092" height="610" alt="image" src="https://github.com/user-attachments/assets/89d0e6e8-3159-4fda-8073-cd44cc79c7e0" />


<img width="1248" height="614" alt="image" src="https://github.com/user-attachments/assets/1fe0b7ac-4f76-4370-8822-a0a02f2f359b" />


<img width="1335" height="613" alt="image" src="https://github.com/user-attachments/assets/d16d0565-a187-4f1d-9a5b-2a948177be60" />




