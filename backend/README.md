# Intelligent UPI Risk Assessment and Fraud Detection Backend

Production-ready Node.js and Express backend foundation for the Intelligent UPI Risk Assessment and Fraud Detection System.

## Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- dotenv
- cookie-parser
- cors
- helmet
- morgan
- express-rate-limit
- express-validator
- nodemon

## Features

- Express bootstrap with security middleware
- MongoDB connection via Mongoose
- MVC structure with routes, controllers, services, validators, and models
- Standard JSON response format
- Global error handler
- 404 handler
- Morgan logging with Winston-backed logger
- Rate limiting for API and auth/fraud endpoints
- Cookie-based and header-based JWT auth support

## Folder Structure

- `config/` - database and JWT helpers
- `controllers/` - request handlers
- `middlewares/` - auth, validation, logging, error handling, rate limiting
- `models/` - Mongoose schemas
- `routes/` - route definitions
- `services/` - business logic
- `validators/` - express-validator rules
- `utils/` - response helpers, errors, async wrapper, utilities
- `constants/` - shared constants and status codes
- `uploads/` - uploaded files
- `logs/` - application logs
- `database/` - database connection helpers

## Environment Variables

Create a `.env` file from `.env.example`.

Required values:

- `PORT`
- `NODE_ENV`
- `MONGODB_URI`
- `JWT_SECRET`
- `JWT_EXPIRE`
- `JWT_REFRESH_SECRET`
- `JWT_REFRESH_EXPIRE`
- `CLIENT_URL`
- `RATE_LIMIT_WINDOW_MS`
- `RATE_LIMIT_MAX_REQUESTS`

## Installation

```bash
cd backend
npm install
```

## Development

```bash
npm run dev
```

## Production

```bash
npm start
```

## Health Check

```http
GET /health
```

## Response Format

Success responses follow this structure:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Success",
  "data": {},
  "error": null,
  "timestamp": "2026-08-04T00:00:00.000Z"
}
```

Errors follow the same envelope with `success: false` and a descriptive `error` value.