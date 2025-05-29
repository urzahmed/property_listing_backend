# Property Listing Backend

A secure backend API for property listing application built with Node.js, TypeScript, Express.js, and MongoDB.

## Features

- User authentication with JWT
- Secure password hashing with bcrypt
- MongoDB database integration
- TypeScript support
- Protected routes middleware
- Environment variable configuration

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/property_listing
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRES_IN=7d
   ```

4. Build the TypeScript code:
   ```bash
   npm run build
   ```

5. Start the server:
   ```bash
   npm start
   ```

For development with hot-reload:
```bash
npm run dev
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
  - Body: `{ "name": "string", "email": "string", "password": "string" }`

- `POST /api/auth/login` - Login user
  - Body: `{ "email": "string", "password": "string" }`

- `GET /api/auth/me` - Get current user (protected route)
  - Headers: `Authorization: Bearer <token>`

## Security Features

- Passwords are hashed using bcrypt
- JWT-based authentication
- Protected routes middleware
- Environment variables for sensitive data
- CORS enabled
- Input validation

## Error Handling

The API includes comprehensive error handling for:
- Invalid credentials
- Duplicate users
- Missing fields
- Server errors
- Authentication failures 