# Wander-Mate Backend API

Node.js + Express + MySQL backend for the Wander-Mate travel companion app.

## ✅ What's Been Created

### Core Files
- **MySQL Schema**: `mysql-schema.sql` (25+ tables)
- **Seed Data**: `mysql-seed-data.sql` (8 destinations + activities)
- **Server**: Express API with TypeScript
- **Authentication**: JWT-based auth (signup/login)
- **Database**: MySQL connection pool

### API Endpoints

#### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout

#### Users
- `GET /api/users/profile` - Get current user (protected)
- `PUT /api/users/profile` - Update profile (protected)
- `GET /api/users/:userId` - Get user by ID (protected)

#### Destinations
- `GET /api/destinations` - List all destinations
- `GET /api/destinations/:id` - Get destination details
- `GET /api/destinations/search?query=` - Search destinations

#### Coming Soon
- Trips (create, join, manage)
- Matches (find compatible travelers)
- Payments (Stripe integration)
- Messages (chat system)

## 🚀 Quick Start

### 1. Install MySQL & Create Database

Follow `MYSQL-SETUP.md` to:
1. Install MySQL
2. Run `mysql-schema.sql`
3. Run `mysql-seed-data.sql`

### 2. Configure Environment

Create `.env` file:

```bash
cp .env.example .env
```

Edit `.env`:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=wandermate

JWT_SECRET=change_this_to_random_string
PORT=3001
FRONTEND_URL=http://localhost:5173
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

Server starts at: **http://localhost:3001**

## 🧪 Test the API

### Health Check
```bash
curl http://localhost:3001/health
```

### Signup
```bash
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

### Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Get Destinations
```bash
curl http://localhost:3001/api/destinations
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── server.ts              # Express app entry point
│   ├── config/
│   │   └── database.ts        # MySQL connection
│   ├── middleware/
│   │   └── auth.middleware.ts # JWT authentication
│   ├── routes/
│   │   ├── auth.routes.ts     # Auth endpoints
│   │   ├── user.routes.ts     # User endpoints
│   │   └── destination.routes.ts
│   └── controllers/
│       ├── auth.controller.ts  # Auth logic
│       ├── user.controller.ts  # User logic
│       └── destination.controller.ts
├── mysql-schema.sql           # Database structure
├── mysql-seed-data.sql        # Sample data
└── package.json
```

## 🔐 Authentication Flow

1. **Signup**: Creates user → Returns JWT token
2. **Login**: Validates credentials → Returns JWT token
3. **Protected Routes**: Send token in header:
   ```
   Authorization: Bearer <your_token>
   ```

## 🌐 CORS Configuration

Currently allows requests from: `http://localhost:5173` (Vite dev server)

Change in `.env`:
```env
FRONTEND_URL=http://localhost:5173
```

## 📊 Database Connection

Uses `mysql2` with connection pooling:
- Max connections: 10
- Auto-reconnect enabled
- UTF-8 support

## 🔧 Development

### Watch Mode
```bash
npm run dev
```

### Build for Production
```bash
npm run build
npm start
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_HOST` | MySQL host | localhost |
| `DB_PORT` | MySQL port | 3306 |
| `DB_USER` | MySQL username | root |
| `DB_PASSWORD` | MySQL password | - |
| `DB_NAME` | Database name | wandermate |
| `JWT_SECRET` | Secret for JWT signing | - |
| `JWT_EXPIRES_IN` | Token expiration | 7d |
| `PORT` | Server port | 3001 |
| `FRONTEND_URL` | Frontend URL (CORS) | http://localhost:5173 |

## 🐛 Troubleshooting

### MySQL Connection Failed
- Check MySQL is running
- Verify credentials in `.env`
- Ensure `wandermate` database exists

### Port Already in Use
Change port in `.env`:
```env
PORT=3002
```

### CORS Errors
Update `FRONTEND_URL` in `.env` to match your frontend URL

## 📝 Next Steps

1. ✅ MySQL database setup
2. ✅ Basic auth endpoints
3. ✅ Destinations API
4. ⏳ Complete trips endpoints
5. ⏳ Implement matching algorithm
6. ⏳ Add chat/messages
7. ⏳ Integrate Stripe payments
8. ⏳ Deploy to production

## 🚢 Deployment

Backend can be deployed to:
- **Railway** (recommended, easy MySQL hosting)
- **Heroku** (with JawsDB MySQL addon)
- **DigitalOcean** (droplet + managed MySQL)
- **AWS** (EC2 + RDS)

Will provide deployment guide when ready!
