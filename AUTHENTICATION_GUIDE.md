# Authentication Guide

## Overview
The application uses **JWT-based authentication with HTTP-only cookies** for secure session management.

## Authentication Flow

### 1. Registration
- **Endpoint**: `POST /api/v1/todo/auth/register`
- **Request**: FormData with `fullName`, `email`, `password`, `phoneNumber`, `avatar` (optional)
- **Response**: Success message (user must login after registration)

### 2. Login
- **Endpoint**: `POST /api/v1/todo/auth/login`
- **Request**: JSON with `email` and `password`
- **Response**:
  - User data in response body
  - `accessToken` and `refreshToken` set as HTTP-only cookies
- **Client Action**: Store user data in localStorage and AuthContext

### 3. Protected Routes
- All todo-related endpoints require authentication
- Authentication is handled via cookies (sent automatically with `withCredentials: true`)
- Server middleware (`verifyJWT`) checks for token in:
  1. `req.cookies.accessToken` (primary)
  2. `Authorization` header with Bearer token (fallback)

### 4. Logout
- **Endpoint**: `GET /api/v1/todo/auth/logout`
- **Server Action**: Clears refresh token from database and cookies
- **Client Action**: Clear localStorage and redirect to login

## Client Configuration

### API Client Setup
```javascript
const apiClient = axios.create({
  baseURL: "http://localhost:5000/api/v1/todo",
  withCredentials: true, // Important: Sends cookies with every request
  timeout: 30000,
});
```

### Authentication Context
- Manages user state across the application
- Provides: `user`, `isAuthenticated`, `login`, `register`, `logout`
- Persists user data in localStorage for page refreshes
- Initializes by checking localStorage on app load

### Protected Routes
- Uses `ProtectedRoute` component wrapper
- Checks `isAuthenticated` from AuthContext
- Redirects to `/login` if not authenticated
- Shows loading spinner during authentication check

## API Endpoints

### Auth Endpoints
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/logout` - Logout user (requires auth)
- `GET /auth/get-me` - Get current user (requires auth)

### Todo Endpoints (All require authentication)
- `POST /todo/create-todo` - Create new todo
- `PUT /todo/update-todo-name/:todoId` - Update todo title
- `DELETE /todo/delete-todo/:todoId` - Delete todo
- `GET /todo/fetch-todo` - Get all user's todos

### Todo Item Endpoints (All require authentication)
- `POST /todo-item/create-todo-item/:todoId` - Create todo item
- `PUT /todo-item/complete-todo-item/:todoItemId` - Mark item complete
- `DELETE /todo-item/delete-todo-item/:todoItemId` - Delete todo item

## Security Features

1. **HTTP-Only Cookies**: Tokens stored in HTTP-only cookies (not accessible via JavaScript)
2. **CORS Configuration**: Server configured with specific origin and credentials support
3. **Password Hashing**: Passwords hashed with bcrypt before storage
4. **Token Expiry**: Access and refresh tokens have expiration times
5. **Secure Cookie Options**: `httpOnly: true`, `secured: true` in production

## Error Handling

### 401 Unauthorized
- Triggers automatic logout
- Clears localStorage
- Redirects to login page

### Network Errors
- Displays toast notification
- Maintains user session if temporary network issue

## Environment Variables

### Client (.env)
```
VITE_SERVER_URI=http://localhost:5000/api/v1/todo
```

### Server (.env)
```
ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=7d
CORS_ORIGIN=http://localhost:5173
```

## Testing Authentication

1. Start the server: `cd server && npm run dev`
2. Start the client: `cd client && npm run dev`
3. Register a new user at `/register`
4. Login with credentials at `/login`
5. Access protected `/todos` route
6. Verify cookies in browser DevTools (Application > Cookies)

## Common Issues

### Issue: "Unauthorized request" on protected routes
- **Cause**: Cookies not being sent
- **Solution**: Ensure `withCredentials: true` in axios config

### Issue: CORS errors
- **Cause**: Server CORS not configured for client origin
- **Solution**: Check `CORS_ORIGIN` in server .env matches client URL

### Issue: User not persisting on page refresh
- **Cause**: localStorage not being read on init
- **Solution**: AuthContext initializes from localStorage on mount

### Issue: Login successful but redirects to login
- **Cause**: User data not being stored properly
- **Solution**: Check login response structure and persistUser function
