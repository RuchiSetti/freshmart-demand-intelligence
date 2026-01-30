# Authentication Guide

## Overview

The FreshMart backend now supports JWT-based authentication with role-based access control (RBAC).

## Quick Start

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

This installs:
- `pyjwt>=2.8.0` - JWT token encoding/decoding
- `passlib[bcrypt]>=1.7.4` - Password hashing

### 2. Demo Users

The system comes with pre-configured demo users:

| Email | Password | Role |
|-------|----------|------|
| admin@freshmart.com | admin123 | admin |
| manager@freshmart.com | manager123 | manager |
| viewer@freshmart.com | viewer123 | viewer |

### 3. Frontend Integration

#### Step 1: Login

```javascript
// POST /api/v1/auth/login
const response = await fetch('http://localhost:8000/api/v1/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'admin@freshmart.com',
    password: 'admin123'
  })
});

const data = await response.json();
// Response: { access_token: "...", token_type: "bearer", user: {...} }
```

#### Step 2: Store Token

```javascript
// Store token in localStorage or sessionStorage
localStorage.setItem('access_token', data.access_token);
```

#### Step 3: Use Token in API Requests

```javascript
// Include token in all protected API requests
const token = localStorage.getItem('access_token');

const response = await fetch('http://localhost:8000/api/v1/dashboard', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  }
});
```

#### Step 4: Handle Token Expiration

```javascript
// Token expires after 30 minutes (configurable)
// Handle 401 errors by redirecting to login
if (response.status === 401) {
  localStorage.removeItem('access_token');
  window.location.href = '/login';
}
```

## API Endpoints

### Public Endpoints (No Authentication Required)

#### POST /api/v1/auth/login
Authenticate user and receive JWT token.

**Request:**
```json
{
  "email": "admin@freshmart.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "bearer",
  "user": {
    "email": "admin@freshmart.com",
    "role": "admin"
  }
}
```

#### POST /api/v1/auth/register
Register a new user (optional, for demo).

**Request:**
```json
{
  "email": "newuser@freshmart.com",
  "password": "password123",
  "role": "viewer"  // Optional: admin, manager, viewer
}
```

**Response:** Same as login

### Protected Endpoints (Require JWT Token)

All endpoints under `/api/v1/*` (except `/api/v1/auth/*`) require authentication:

- `GET /api/v1/dashboard`
- `GET /api/v1/products`
- `GET /api/v1/stores`
- `GET /api/v1/forecast`
- `GET /api/v1/alerts`
- `GET /api/v1/insights`
- `GET /api/v1/auth/me` - Get current user info

**All require:** `Authorization: Bearer <token>` header

## Role-Based Access Control

### Roles

- **admin**: Full access to all endpoints
- **manager**: Access to most endpoints (can be restricted per endpoint)
- **viewer**: Read-only access

### Using Roles in Code

```python
from app.security.auth import require_role

@router.get("/admin-only")
def admin_endpoint(user: User = Depends(require_role("admin"))):
    # Only admins can access this
    ...
```

## Configuration

JWT settings in `app/config.py` (or `.env`):

```python
JWT_SECRET_KEY: str = "your-secret-key-change-in-production"
JWT_ALGORITHM: str = "HS256"
JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
```

**Important:** Change `JWT_SECRET_KEY` in production! Use environment variables:

```bash
export JWT_SECRET_KEY="your-production-secret-key-here"
```

## Testing with /docs

1. Start the server: `uvicorn app.main:app --reload`
2. Open http://localhost:8000/docs
3. Click "Authorize" button
4. Enter: `Bearer <your-token-here>`
5. All endpoints will now use this token

## Architecture

### Files Created/Modified

- `app/security/jwt.py` - JWT encoding/decoding utilities
- `app/security/user_store.py` - In-memory user storage with password hashing
- `app/routers/auth.py` - Authentication endpoints
- `app/security/auth.py` - Updated to support JWT tokens
- `app/schemas.py` - Added login/register schemas
- `app/config.py` - Added JWT configuration
- `requirements.txt` - Added PyJWT and passlib

### Security Notes

- Passwords are hashed using bcrypt (never stored in plain text)
- JWT tokens expire after 30 minutes (configurable)
- Tokens are signed with a secret key
- User store is in-memory (for demo) - replace with database in production

## Backward Compatibility

The system still supports legacy API key authentication via `X-API-Key` header for backward compatibility, but JWT tokens are the recommended approach.

