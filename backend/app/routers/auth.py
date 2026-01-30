"""
Authentication router - handles login and registration.

Endpoints:
    POST /api/v1/auth/login - Authenticate user and return JWT token
    POST /api/v1/auth/register - Register new user (optional, for demo)

These endpoints are PUBLIC (no authentication required).

Frontend Integration Guide:
    1. Login: POST /api/v1/auth/login with {email, password}
    2. Store token from response.access_token
    3. Send token in all API requests: Authorization: Bearer <token>
    4. Token expires after 30 minutes (configurable in settings)
"""

from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from ..schemas import LoginRequestSchema, RegisterRequestSchema, TokenResponseSchema
from ..security.jwt import create_access_token
from ..security.user_store import get_user_store
from ..security.auth import get_current_user_from_token

router = APIRouter(prefix="/auth", tags=["Authentication"])

# Security scheme for OpenAPI docs
security = HTTPBearer()


@router.post("/login", response_model=TokenResponseSchema)
async def login(credentials: LoginRequestSchema):
    """
    Authenticate user and return JWT access token.
    
    Request Body:
        {
            "email": "admin@freshmart.com",
            "password": "admin123"
        }
    
    Response:
        {
            "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
            "token_type": "bearer",
            "user": {
                "email": "admin@freshmart.com",
                "role": "admin"
            }
        }
    
    Frontend Usage:
        1. Call this endpoint on login form submit
        2. Store access_token in localStorage/sessionStorage
        3. Include in all API requests: headers: { "Authorization": "Bearer <token>" }
        4. Handle 401 errors (token expired) by redirecting to login
    """
    user_store = get_user_store()
    
    # Authenticate user
    user = user_store.authenticate_user(credentials.email, credentials.password)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token = create_access_token(
        data={"sub": credentials.email, "role": user.role}
    )
    
    return TokenResponseSchema(
        access_token=access_token,
        token_type="bearer",
        user={"email": credentials.email, "role": user.role}
    )


@router.post("/register", response_model=TokenResponseSchema)
async def register(user_data: RegisterRequestSchema):
    """
    Register a new user (optional, for demo purposes).
    
    Request Body:
        {
            "email": "newuser@freshmart.com",
            "password": "password123",
            "role": "viewer"  # Optional, defaults to "viewer"
        }
    
    Response:
        Same as /login - returns access token and user info
    
    Note:
        - Email must be unique
        - Password must be at least 6 characters
        - Role defaults to "viewer" if not specified
    """
    user_store = get_user_store()
    
    # Validate role
    valid_roles = ["admin", "manager", "viewer"]
    if user_data.role not in valid_roles:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid role. Must be one of: {', '.join(valid_roles)}"
        )
    
    # Create user
    user = user_store.create_user(
        email=user_data.email,
        password=user_data.password,
        role=user_data.role
    )
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create access token
    access_token = create_access_token(
        data={"sub": user_data.email, "role": user.role}
    )
    
    return TokenResponseSchema(
        access_token=access_token,
        token_type="bearer",
        user={"email": user_data.email, "role": user.role}
    )


@router.get("/me")
async def get_current_user_info(current_user=Depends(get_current_user_from_token)):
    """
    Get current authenticated user information.
    
    Requires: Authorization header with Bearer token
    
    Use this endpoint to:
        - Verify token is still valid
        - Get current user info for UI display
        - Check user role for conditional UI rendering
    """
    return {
        "email": current_user.subject,
        "role": current_user.role
    }

