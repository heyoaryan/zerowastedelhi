# Zero Waste Delhi - Backend API

A comprehensive backend API for the Zero Waste Delhi application built with Node.js, Express, and MongoDB.

## Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **User Management**: Registration, login, profile management
- **Waste Tracking**: Add waste entries, track statistics
- **Bin Management**: Smart waste bin tracking and monitoring
- **Leaderboard System**: Global and monthly rankings
- **Security**: Rate limiting, input validation, password hashing
- **Database**: MongoDB with optimized indexes

## Database Schemas

### Users Schema
- User authentication and profile information
- Points, levels, and achievements tracking
- Preferences and settings

### WasteBin Schema
- Smart bin locations and capacity tracking
- Real-time status monitoring
- Maintenance history

### WasteEntry Schema
- Individual waste submissions
- Points calculation and carbon footprint tracking
- Verification system

### Leaderboard Schema
- User rankings and statistics
- Monthly performance tracking
- Achievement system

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Waste Management
- `POST /api/waste` - Add waste entry
- `GET /api/waste/my-entries` - Get user's waste entries
- `GET /api/waste/stats` - Get waste statistics

### Bin Management
- `GET /api/bins` - Get all bins
- `GET /api/bins/nearby` - Get nearby bins
- `GET /api/bins/:binId` - Get specific bin
- `POST /api/bins` - Create bin (Admin)
- `PUT /api/bins/:binId/status` - Update bin status (Admin)

### Leaderboard
- `GET /api/leaderboard` - Global leaderboard
- `GET /api/leaderboard/monthly` - Monthly leaderboard
- `GET /api/leaderboard/my-rank` - User's rank
- `GET /api/leaderboard/stats` - Leaderboard statistics

## Setup Instructions

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Setup Environment Variables**
   ```bash
   cp .env.example .env
   # Edit .env with your MongoDB URI and JWT secret
   ```

3. **Start MongoDB**
   - Make sure MongoDB is running on your system
   - Default connection: `mongodb://localhost:27017/zero-waste-delhi`

4. **Run the Server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

5. **Test the API**
   ```bash
   curl http://localhost:5000/api/health
   ```

## Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Rate Limiting**: Prevents API abuse
- **Input Validation**: Express-validator for data validation
- **CORS Protection**: Configured for frontend domains
- **Helmet**: Security headers
- **Environment Variables**: Sensitive data protection

## Database Indexes

Optimized indexes for:
- User email uniqueness
- Geospatial queries for nearby bins
- Efficient leaderboard sorting
- Fast waste entry lookups

## Error Handling

- Comprehensive error responses
- Validation error details
- Development vs production error modes
- Centralized error handling middleware

## Development

The API is designed to work seamlessly with the React frontend without requiring any changes to the existing frontend code.