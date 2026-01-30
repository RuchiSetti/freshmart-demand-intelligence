"""
Security wiring (dependency-based).

JWT-based authentication with role-based access control.
Supports both JWT tokens (primary) and API keys (backward compatibility).

Frontend should send JWT tokens in Authorization header:
    Authorization: Bearer <token>
"""

from contextvars import ContextVar
from typing import Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import APIKeyHeader, HTTPBearer, HTTPAuthorizationCredentials

from ..config import settings
from .models import User
from .jwt import decode_access_token


_current_user: ContextVar[Optional[User]] = ContextVar("current_user", default=None)

# Legacy API key support (backward compatibility)
_api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)
_role_header = APIKeyHeader(name="X-Role", auto_error=False)

# JWT Bearer token support
_bearer_scheme = HTTPBearer(auto_error=False)


def get_current_user_from_token(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(_bearer_scheme)
) -> User:
    """
    Extract and validate JWT token from Authorization header.
    
    Frontend should send: Authorization: Bearer <token>
    
    This is the primary authentication method for protected endpoints.
    """
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    token = credentials.credentials
    payload = decode_access_token(token)
    
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    email: str = payload.get("sub")
    role: str = payload.get("role", "viewer")
    
    if email is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user = User(subject=email, role=role)
    _current_user.set(user)
    return user


def require_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(_bearer_scheme),
    api_key: Optional[str] = Depends(_api_key_header),
    role: Optional[str] = Depends(_role_header),
) -> User:
    """
    Require authentication via JWT token (primary) or API key (fallback).
    
    Priority:
    1. JWT Bearer token (Authorization: Bearer <token>)
    2. API key header (X-API-Key) - backward compatibility
    
    Frontend should use JWT tokens for all new integrations.
    """
    # Try JWT token first
    if credentials:
        try:
            return get_current_user_from_token(credentials)
        except HTTPException:
            pass  # Fall through to API key check
    
    # Fallback to API key (backward compatibility)
    if api_key and api_key == settings.API_KEY:
        user = User(subject="demo-user", role=(role or "viewer"))
        _current_user.set(user)
        return user
    
    # No valid authentication found
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Not authenticated. Provide JWT token (Authorization: Bearer <token>) or API key (X-API-Key)",
        headers={"WWW-Authenticate": "Bearer"},
    )


def get_current_user() -> User:
    """
    Get current user from context (set by require_user dependency).
    
    Returns anonymous user if not set (should not happen in protected routes).
    """
    user = _current_user.get()
    return user or User(subject="anonymous", role="viewer")


def require_role(required_role: str):
    """
    Require a specific role for access.
    
    Usage:
        @router.get("/admin-only")
        def admin_endpoint(user: User = Depends(require_role("admin"))):
            ...
    """
    def _dep(user: User = Depends(require_user)) -> User:
        if user.role != required_role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Insufficient role. Required: {required_role}, Current: {user.role}"
            )
        return user

    return _dep


