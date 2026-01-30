from pydantic import BaseModel


class User(BaseModel):
    """Authenticated user context (mocked but fully wired)."""

    subject: str
    role: str


