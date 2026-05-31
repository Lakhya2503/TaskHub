# Testing Authentication

## Prerequisites
1. MongoDB running on `mongodb://localhost:27017`
2. Server running on `http://localhost:5000`
3. Client running on `http://localhost:5173`

## Start the Application

### Terminal 1 - Start Server
```bash
cd server
npm run dev
```

### Terminal 2 - Start Client
```bash
cd client
npm run dev
```

## Test Registration

### 1. Open Browser
Navigate to: `http://localhost:5173/register`

### 2. Fill Registration Form
- **Full Name**: John Doe
- **Email**: john@example.com
- **Password**: password123
- **Phone Number**: 1234567890 (optional)
- **Avatar**: Upload an image (optional)

### 3. Expected Result
- Success toast: "John Doe, you are registered successfully. Please login."
- Redirected to `/login` page

### 4. Check Server Console
Should see the registration request being processed

## Test Login

### 1. Fill Login Form
- **Email**: john@example.com
- **Password**: password123

### 2. Expected Result
- Success toast: "Login successful!"
- Redirected to `/todos` page
- User name displayed in header: "Welcome, John Doe"

### 3. Check Browser DevTools
**Application > Cookies > http://localhost:5173**
- Should see `accessToken` cookie
- Should see `refreshToken` cookie
- Both should be HttpOnly

**Console**
- No errors should appear

**Network Tab**
- POST `/api/v1/todo/auth/login` - Status 200
- Response should contain user data

## Test Protected Route

### 1. Access Todos Page
Navigate to: `http://localhost:5173/todos`

### 2. Expected Result (Logged In)
- Todo Dashboard displayed
- Can create, update, delete todos

### 3. Expected Result (Not Logged In)
- Automatically redirected to `/login`

## Test Logout

### 1. Click Logout Button
On the todos page, click the red "Logout" button

### 2. Expected Result
- Success toast: "Logged out successfully"
- Redirected to `/login` page
- Cookies cleared
- Cannot access `/todos` anymore

## Common Issues & Solutions

### Issue: "Network Error" or "Failed to fetch"
**Solution**:
- Ensure server is running on port 5000
- Check MongoDB is running
- Verify CORS_ORIGIN in server/.env matches client URL

### Issue: "User already exists"
**Solution**:
- Use a different email
- Or delete the user from MongoDB:
```bash
mongosh
use test
db.users.deleteOne({email: "john@example.com"})
```

### Issue: Cookies not being set
**Solution**:
- Check browser console for CORS errors
- Verify `withCredentials: true` in client axios config
- Ensure server CORS allows credentials

### Issue: "Unauthorized request" on protected routes
**Solution**:
- Check if cookies are being sent (Network tab > Request Headers)
- Verify `withCredentials: true` in axios config
- Check if cookies are HttpOnly and not expired

### Issue: Registration with avatar fails
**Solution**:
- Check if `public/avatar` folder exists in server
- Verify Cloudinary credentials in server/.env
- Try registering without avatar first

## Manual API Testing (Optional)

### Using cURL or Postman

#### Register
```bash
POST http://localhost:5000/api/v1/todo/auth/register
Content-Type: multipart/form-data

fullName: John Doe
email: john@example.com
password: password123
phoneNumber: 1234567890
```

#### Login
```bash
POST http://localhost:5000/api/v1/todo/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User (requires cookies from login)
```bash
GET http://localhost:5000/api/v1/todo/auth/get-me
Cookie: accessToken=<token_from_login>
```

## Verification Checklist

- [ ] Server starts without errors
- [ ] Client starts without errors
- [ ] Can register new user
- [ ] Can login with registered user
- [ ] Cookies are set after login
- [ ] Can access protected `/todos` route
- [ ] User data displays correctly
- [ ] Can logout successfully
- [ ] Cannot access `/todos` after logout
- [ ] Redirected to login when accessing protected routes while logged out
