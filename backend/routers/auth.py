from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import HTTPAuthorizationCredentials
from datetime import timedelta
from typing import Dict, Any
from models.auth import (
    UserCreate, UserLogin, UserResponse, Token, 
    PasswordChange, PasswordReset, UserUpdate
)
from models.base import BaseResponse
from auth.auth_handler import auth_handler
from auth.dependencies import get_current_active_user, security
from database.supabase_client import db
import uuid
from datetime import datetime

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=BaseResponse)
async def register_user(user_data: UserCreate):
    """Register a new user"""
    try:
        # Check if user already exists
        existing_user = await db.get_records("user_profiles", {"email": user_data.email})
        if existing_user["success"] and existing_user["data"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Hash password
        hashed_password = auth_handler.get_password_hash(user_data.password)
        
        # Create user profile
        user_profile = {
            "id": str(uuid.uuid4()),
            "email": user_data.email,
            "password_hash": hashed_password,
            "full_name": user_data.full_name,
            "role": user_data.role,
            "department": user_data.department,
            "phone": user_data.phone,
            "is_active": True,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        }
        
        result = await db.create_record("user_profiles", user_profile)
        if not result["success"]:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create user"
            )
        
        return BaseResponse(
            success=True,
            message="User registered successfully",
            data={"user_id": user_profile["id"]}
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration failed: {str(e)}"
        )

@router.post("/login", response_model=Token)
async def login_user(login_data: UserLogin):
    """Authenticate user and return access token"""
    try:
        # Get user from database
        result = await db.get_records("user_profiles", {"email": login_data.email})
        if not result["success"] or not result["data"]:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        user = result["data"][0]
        
        # Verify password
        if not auth_handler.verify_password(login_data.password, user["password_hash"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        # Check if user is active
        if not user["is_active"]:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Account is deactivated"
            )
        
        # Create access token
        access_token_expires = timedelta(minutes=auth_handler.access_token_expire_minutes)
        access_token = auth_handler.create_access_token(
            data={"sub": user["email"], "role": user["role"]},
            expires_delta=access_token_expires
        )
        
        # Remove password hash from user data
        user_response = {k: v for k, v in user.items() if k != "password_hash"}
        
        return Token(
            access_token=access_token,
            token_type="bearer",
            expires_in=auth_handler.access_token_expire_minutes * 60,
            user=UserResponse(**user_response)
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Login failed: {str(e)}"
        )

@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(current_user: UserResponse = Depends(get_current_active_user)):
    """Get current user profile"""
    return current_user

@router.put("/me", response_model=BaseResponse)
async def update_current_user_profile(
    user_update: UserUpdate,
    current_user: UserResponse = Depends(get_current_active_user)
):
    """Update current user profile"""
    try:
        update_data = user_update.dict(exclude_unset=True)
        update_data["updated_at"] = datetime.utcnow().isoformat()
        
        result = await db.update_record("user_profiles", current_user.id, update_data)
        if not result["success"]:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to update profile"
            )
        
        return BaseResponse(
            success=True,
            message="Profile updated successfully",
            data=result["data"]
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Profile update failed: {str(e)}"
        )

@router.post("/change-password", response_model=BaseResponse)
async def change_password(
    password_data: PasswordChange,
    current_user: UserResponse = Depends(get_current_active_user)
):
    """Change user password"""
    try:
        # Get current user with password hash
        result = await db.get_records("user_profiles", {"id": current_user.id})
        if not result["success"] or not result["data"]:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        user = result["data"][0]
        
        # Verify current password
        if not auth_handler.verify_password(password_data.current_password, user["password_hash"]):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Current password is incorrect"
            )
        
        # Hash new password
        new_password_hash = auth_handler.get_password_hash(password_data.new_password)
        
        # Update password
        update_result = await db.update_record(
            "user_profiles", 
            current_user.id, 
            {
                "password_hash": new_password_hash,
                "updated_at": datetime.utcnow().isoformat()
            }
        )
        
        if not update_result["success"]:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to update password"
            )
        
        return BaseResponse(
            success=True,
            message="Password changed successfully"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Password change failed: {str(e)}"
        )

@router.post("/logout", response_model=BaseResponse)
async def logout_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Logout user (client-side token removal)"""
    # In a real application, you might want to blacklist the token
    # For now, we'll just return a success response
    return BaseResponse(
        success=True,
        message="Logged out successfully"
    )
