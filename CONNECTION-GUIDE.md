# WanderMate - Backend & Frontend Connection Setup Complete! 🎉

## ✅ What Was Configured:

### 1. **Backend API (Port 3001)**
- Connected to MySQL database `wandermate`
- All 26 database tables created and ready
- Authentication endpoints implemented
- CORS configured for frontend

### 2. **Frontend (Port 8081)**
- Axios HTTP client installed
- API service created with all endpoints
- Auth service updated to use real API calls
- Backend health check added to Home screen

### 3. **Files Created/Updated:**
- ✅ [`src/services/api.service.ts`](src/services/api.service.ts) - Complete API service
- ✅ [`src/lib/api-client.ts`](src/lib/api-client.ts) - Axios client with auth interceptors
- ✅ [`src/services/auth.service.ts`](src/services/auth.service.ts) - Real API integration
- ✅ [`.env`](.env) - Frontend environment variables
- ✅ [`backend/.env`](backend/.env) - Backend configuration

---

## 🚀 How to Run:

### Terminal 1 - Start Backend:
```powershell
cd backend
npm run dev
```
**Expected output:**
```
🚀 Server running on http://localhost:3001
📊 Environment: development
🌐 Frontend URL: http://localhost:5173
✓ MySQL database connected successfully
```

### Terminal 2 - Start Frontend:
```powershell
npm run dev
```
**Expected output:**
```
  ➜  Local:   http://localhost:8081/
```

### Terminal 3 - Test Connection:
```powershell
Invoke-WebRequest -Uri "http://localhost:3001/health" -UseBasicParsing | Select-Object -ExpandProperty Content
```
**Expected output:**
```json
{"status":"ok","timestamp":"2026-01-06T..."}
```

---

## 🧪 Testing the Integration:

1. **Open the app:** http://localhost:8081

2. **Check browser console** - You should see:
   ```
   ✅ Backend connected: {status: "ok", timestamp: "..."}
   ```

3. **Try to sign up:**
   - Click "Get Started" or "Sign Up"
   - Enter: Name, Email, Password (min 6 chars)
   - Data will be saved to MySQL database

4. **Try to login:**
   - Use the credentials you just created
   - Token will be stored in localStorage
   - User data fetched from database

---

## 📡 Available API Endpoints:

### Authentication:
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user  
- `GET /api/auth/me` - Get current user (requires token)
- `POST /api/auth/logout` - Logout

### Users:
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update profile

### Trips:
- `GET /api/trips` - Get all trips
- `POST /api/trips` - Create trip
- `GET /api/trips/:id` - Get trip details

### Destinations:
- `GET /api/destinations` - Get all destinations
- `GET /api/destinations/search?q=...` - Search destinations

### Matches:
- `GET /api/matches` - Get user matches
- `POST /api/matches/:id/accept` - Accept match

---

## 🔧 How It Works:

### Frontend → Backend Flow:
```
1. User clicks "Login" in UI
2. auth.service.ts calls apiService.auth.login()
3. apiService sends POST to http://localhost:3001/api/auth/login
4. api-client.ts adds JWT token from localStorage
5. Backend validates credentials against MySQL
6. Backend returns user data + JWT token
7. Token saved to localStorage
8. User redirected to home screen
```

### API Client Features:
- ✅ Automatic JWT token injection
- ✅ 401 error handling (auto-redirect to login)
- ✅ Request/response interceptors
- ✅ 10-second timeout
- ✅ CORS credentials included

---

## 📁 Database Info:

- **Host:** localhost:3306
- **Database:** wandermate
- **User:** root
- **Tables:** 26 (users, trips, destinations, matches, etc.)

---

## 🎯 Next Steps:

1. **Create a test user:** Visit http://localhost:8081 and sign up
2. **Check database:** 
   ```sql
   USE wandermate;
   SELECT * FROM users;
   ```
3. **Replace mock services:** Gradually update other services (trip.service.ts, matching.service.ts) to use API
4. **Add more endpoints:** Implement remaining backend routes as needed

---

## ⚠️ Important Notes:

- Keep both terminals running (backend + frontend)
- Don't run other commands in the backend terminal (it stops the server)
- If port 3001 is busy, change PORT in backend/.env
- Browser console will show all API requests/responses
- Check Network tab in DevTools to see API calls

---

**Everything is connected and ready to use!** 🚀

The mock data is still being used by default, but the real API is ready. Test the login/signup to see it working with MySQL.
