"""
In-memory user store for authentication.

This is a simple mock storage for demo/academic use.
In production, replace with a proper database.

Users are stored with:
- email (unique identifier)
- hashed password
- role (admin, manager, viewer)
"""

from passlib.context import CryptContext
from typing import Optional, Dict
from .models import User

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class UserStore:
    """
    In-memory user storage with password hashing.
    
    Demo users are pre-populated at initialization.
    """
    
    def __init__(self):
        """Initialize user store with demo users."""
        self._users: Dict[str, Dict] = {}
        self._initialize_demo_users()
    
    def _initialize_demo_users(self):
        """Pre-populate with demo users for testing."""
        # Demo users: email -> {password_hash, role}
        demo_users = [
            {
                "email": "admin@freshmart.com",
                "password": "admin123",  # In production, never store plain passwords
                "role": "admin"
            },
            {
                "email": "manager@freshmart.com",
                "password": "manager123",
                "role": "manager"
            },
            {
                "email": "viewer@freshmart.com",
                "password": "viewer123",
                "role": "viewer"
            }
        ]
        
        for user_data in demo_users:
            self._users[user_data["email"]] = {
                "email": user_data["email"],
                "password_hash": pwd_context.hash(user_data["password"]),
                "role": user_data["role"]
            }
    
    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """Verify a password against its hash."""
        return pwd_context.verify(plain_password, hashed_password)
    
    def hash_password(self, password: str) -> str:
        """Hash a password."""
        return pwd_context.hash(password)
    
    def get_user_by_email(self, email: str) -> Optional[Dict]:
        """Get user by email."""
        return self._users.get(email)
    
    def authenticate_user(self, email: str, password: str) -> Optional[User]:
        """
        Authenticate a user by email and password.
        
        Returns:
            User object if credentials are valid, None otherwise
        """
        user_data = self.get_user_by_email(email)
        if not user_data:
            return None
        
        if not self.verify_password(password, user_data["password_hash"]):
            return None
        
        return User(subject=email, role=user_data["role"])
    
    def create_user(self, email: str, password: str, role: str = "viewer") -> Optional[User]:
        """
        Create a new user (for registration).
        
        Args:
            email: User email (must be unique)
            password: Plain text password (will be hashed)
            role: User role (admin, manager, viewer)
            
        Returns:
            User object if created successfully, None if email already exists
        """
        if email in self._users:
            return None
        
        self._users[email] = {
            "email": email,
            "password_hash": self.hash_password(password),
            "role": role
        }
        
        return User(subject=email, role=role)
    
    def get_all_users(self) -> list:
        """Get all users (for admin purposes)."""
        return list(self._users.values())


# Global singleton instance
_user_store_instance: Optional[UserStore] = None


def get_user_store() -> UserStore:
    """Get the global UserStore instance."""
    global _user_store_instance
    if _user_store_instance is None:
        _user_store_instance = UserStore()
    return _user_store_instance

