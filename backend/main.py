from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import os
from dotenv import load_dotenv
from supabase import create_client, Client
import uvicorn
from routers import auth, customers, vendors, products, quotations, orders, inventory, reports, import_export  # Import auth router, master data routers, and quotations router

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="QMS Platform API",
    description="Quotation Management System & Import/Export Operations Platform",
    version="1.0.0"
)

# CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://your-frontend-domain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Supabase configuration
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_ANON_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("SUPABASE_URL and SUPABASE_ANON_KEY must be set in environment variables")

# Initialize Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Security
security = HTTPBearer()

# Dependency to get Supabase client
def get_supabase() -> Client:
    return supabase

# Health check endpoint
@app.get("/")
async def root():
    return {"message": "QMS Platform API is running", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    try:
        # Test database connection
        result = supabase.table('users').select('count').execute()
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        return {"status": "unhealthy", "error": str(e)}

app.include_router(auth.router, prefix="/api/v1")
app.include_router(customers.router, prefix="/api/v1")
app.include_router(vendors.router, prefix="/api/v1")
app.include_router(products.router, prefix="/api/v1")
app.include_router(quotations.router, prefix="/api/v1")  # Added quotations router
app.include_router(orders.router, prefix="/api/v1")  # Added orders router
app.include_router(inventory.router, prefix="/api/v1")  # Added inventory router
app.include_router(reports.router, prefix="/api/v1")  # Added reports router
app.include_router(import_export.router, prefix="/api/v1")  # Added import_export router

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
