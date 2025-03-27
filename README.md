# Product Management API

A RESTful API built with Node.js, Express, TypeScript, and MongoDB for managing products in a store. This project implements token-based authentication, comprehensive error handling, and follows best practices for security and scalability.

## Features

- **Authentication**

  - JWT-based authentication
  - User registration and login
  - Password hashing with bcrypt
  - Rate limiting for auth routes

- **Product Management**

  - CRUD operations for products
  - Search and filter products
  - Pagination support
  - Category-based filtering
  - Sort by different fields

- **Security**

  - Helmet for security headers
  - CORS protection
  - Rate limiting
  - Input validation
  - Error handling
  - JWT token verification

- **Database**
  - MongoDB with Mongoose
  - Efficient indexing
  - Type-safe schemas
  - Data validation

## Tech Stack

- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- JWT
- Jest (Testing)
- Docker

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Docker (optional)

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd manage-products
   ```

2. Install dependencies:

   ```bash
   yarn install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env
   ```

   Update the `.env` file with your configuration.

4. Start the development server:
   ```bash
   yarn dev
   ```

## Docker Setup

1. Build and run with Docker Compose:

   ```bash
   yarn docker:compose:build
   ```

2. Run existing containers:
   ```bash
   yarn docker:compose
   ```

## API Documentation

### Authentication Endpoints

#### POST /api/v1/auth/register

Register a new user

- Body:
  ```json
  {
    "name": "string",
    "email": "string",
    "password": "string"
  }
  ```

#### POST /api/v1/auth/login

Login with existing credentials

- Body:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```

### Product Endpoints

#### GET /api/v1/products

Get all products with pagination

- Query Parameters:
  - page (default: 1)
  - limit (default: 10)
  - search (optional)
  - category (optional)
  - sortBy (optional)
  - order (asc/desc)

#### GET /api/v1/products/:id

Get a single product by ID

#### POST /api/v1/products

Create a new product (requires authentication)

- Body:
  ```json
  {
    "name": "string",
    "description": "string",
    "price": "number",
    "category": "string",
    "stock": "number"
  }
  ```

#### PUT /api/v1/products/:id

Update a product (requires authentication)

#### DELETE /api/v1/products/:id

Delete a product (requires authentication)

## Testing

Run the test suite:

```bash
yarn test
```

Run tests with coverage:

```bash
yarn test:coverage
```

## Project Structure

```
src/
├── config/         # Configuration files
├── controllers/    # Route controllers
├── interfaces/     # TypeScript interfaces
├── middlewares/   # Express middlewares
├── models/        # Mongoose models
├── routes/        # Express routes
├── services/      # Business logic
├── tests/         # Test files
├── utils/         # Utility functions
├── validations/   # Request validation schemas
├── app.ts         # Express app setup
└── server.ts      # Server entry point
```

## Error Handling

The API uses a centralized error handling mechanism with custom error classes. All errors are properly formatted and include:

- Error message
- Error code
- Stack trace (in development)

## Security Measures

1. **Input Validation**: All requests are validated using Zod schemas
2. **Rate Limiting**: Prevents brute force attacks
3. **Security Headers**: Using Helmet middleware
4. **CORS**: Configured for cross-origin requests
5. **Password Security**: Passwords are hashed using bcrypt

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
