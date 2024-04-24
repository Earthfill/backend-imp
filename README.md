# NestJS Authentication and Authorization

This repository provides basic authentication and authorization using NestJS, Mongoose (for MongoDB integration), JWT (JSON Web Tokens) for token-based authentication, and bcrypt for password hashing.

## Prerequisites

Before running this application, ensure you have Node.js and npm installed on your machine.

## Installation

1. **Clone this repository:**

   ```bash
   git clone <repository-url>

   ```

2. **Install dependencies:**
   cd nest-auth-example
   npm install

3. **Set up environment variables:**

MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES=3600 # JWT expiration time in seconds

4. **Start the application:**

npm start

## Features

### User Authentication (Sign Up / Sign In)

- **Create User Account (Sign Up)**

  - Endpoint: `POST /auth/signup`
  - Description: Create a new user account by providing name, email, password, and optional roles.

- **User Authentication (Sign In)**
  - Endpoint: `POST /auth/signin`
  - Description: Authenticate with email and password to receive a JWT token for accessing protected routes.

### Protected Routes

- **Retrieve User Profile**
  - Endpoint: `GET /auth/profile`
  - Description: Retrieve user profile information. Requires a valid JWT token passed in the Authorization header.
  - Features: Uses `JWTAuthGuard` for route protection and `RolesGuard` for role-based authorization.

### Project Structure

- `app.module.ts`: Main application module where other modules are imported.
- `users/`: Module for user-related features.
  - `users.module.ts`: User module defining controllers, services, and guards.
  - `users.controller.ts`: User controller handling HTTP requests.
  - `users.service.ts`: User service managing user data and interactions.
  - `entities/`: Contains user entity and schemas for Mongoose.
  - `auth.service.ts`: Service responsible for user authentication (sign up / sign in).
  - `dtos/`: Data transfer objects used for sign up and sign in requests.
  - `guards/`: Contains guard classes for route protection and role-based authorization.
  - `decorators/`: Custom decorators for handling current user and role-based metadata.

### Technologies Used

- **NestJS**: A progressive Node.js framework for building efficient, reliable, and scalable server-side applications.
- **Mongoose**: A MongoDB object modeling tool designed to work in an asynchronous environment.
- **JWT**: JSON Web Tokens for secure transmission of information between parties.
- **bcrypt**: A library to help hash passwords before storing them securely.

## Notes

- This example illustrates basic authentication and authorization concepts using NestJS.
- For production use, consider enhancing with more robust error handling, input validation, and security measures.

## Author

This was created by Kingsley Omoaka-Iyorah.
