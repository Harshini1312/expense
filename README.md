Expense Tracker
This repository contains the source code for the Smart spend application.  
It includes both frontend and backend components, along with supporting configuration and test files.

Project Structure

Frontend - frontend branch
- React
- React Router
- Axios
- Component-level styling (CSS)
- Unit tests with Jest and React Testing Library

Backend - backend branch
- ASP.NET Core Web API
- JWT-based authentication and authorization
- Service and repository layers
- Logging support (extensible)
- Unit tests with xUnit and InMemory EF Core

Database
- Entity Framework Core
- SQL Server integration (can also use InMemory for development and tests)

Features

User Authentication
- Register and login for Admin and Staff roles
- JWT token generation and validation

Architecture
- Clear separation of controllers, services, repositories and DTOs
- Reusable business logic in services
- Unit tests for controllers, services and auth flows
