from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
from auth.auth_handler import auth_handler
from database.supabase_client import db
from models.auth import UserResponse
import asyncio

security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> UserResponse:
    """Get current authenticated user"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        # Verify token
        payload = auth_handler.verify_token(credentials.credentials)
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except Exception:
        raise credentials_exception
    
    # Get user from database
    result = await db.get_records("user_profiles", {"email": email})
    if not result["success"] or not result["data"]:
        raise credentials_exception
    
    user_data = result["data"][0]
    return UserResponse(**user_data)

async def get_current_active_user(current_user: UserResponse = Depends(get_current_user)) -> UserResponse:
    """Get current active user"""
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

async def require_role(required_role: str):
    """Dependency factory for role-based access control"""
    def role_checker(current_user: UserResponse = Depends(get_current_active_user)) -> UserResponse:
        if current_user.role != required_role and current_user.role != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not enough permissions"
            )
        return current_user
    return role_checker

# Role-specific dependencies
require_admin = require_role("admin")
require_manager = require_role("manager")
