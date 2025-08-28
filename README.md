# QMS Platform - Quotation Management System & Import/Export Operations

A comprehensive business management platform built with Next.js frontend and Python FastAPI backend, designed for managing quotations, orders, inventory, and import/export operations.

## Features

### Core Modules
- **Authentication & User Management** - Role-based access control with JWT tokens
- **Master Data Management** - Customers, vendors, and products with full CRUD operations
- **Quotation Engine** - Create, manage, and track quotations with PDF generation
- **Orders & Procurement** - Order management and purchase order workflows
- **Inventory Tracking** - Real-time stock management with movement tracking
- **Delivery & Invoicing** - Delivery challan and invoice management
- **Import/Export Operations** - International trade and shipment tracking
- **Reports & Analytics** - Business intelligence dashboards and insights
- **Settings & Configuration** - System and user preference management

### Technical Features
- Modern responsive UI with Odoo-inspired design
- Real-time data synchronization
- PDF generation for quotations and documents
- Export functionality (CSV, Excel)
- Search and filtering across all modules
- Role-based navigation and permissions
- Professional dashboard with analytics

## Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern UI component library
- **Recharts** - Data visualization
- **Lucide React** - Icon library

### Backend
- **FastAPI** - Modern Python web framework
- **Supabase** - PostgreSQL database with real-time features
- **Pydantic** - Data validation and serialization
- **JWT** - Authentication and authorization
- **ReportLab** - PDF generation
- **Python 3.9+** - Programming language

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **Python** (v3.9 or higher)
- **pip** (Python package manager)
- **Git** (version control)
- **Supabase Account** (for database)

## Quick Start

### 1. Clone the Repository

\`\`\`bash
git clone <repository-url>
cd qms-platform
\`\`\`

### 2. Database Setup (Supabase)

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Go to SQL Editor and run the database schema:

\`\`\`sql
-- Run the schema from backend/database/schema.sql
-- This will create all necessary tables and relationships
\`\`\`

### 3. Backend Setup

\`\`\`bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env

# Edit .env with your Supabase credentials
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
JWT_SECRET_KEY=your_jwt_secret_key_here
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30

# Run the backend server
python main.py
\`\`\`

The backend will be available at `http://localhost:8000`

### 4. Frontend Setup

\`\`\`bash
# Navigate to frontend directory (from project root)
cd .

# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local

# Edit .env.local with your configuration
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

# Run the development server
npm run dev
\`\`\`

The frontend will be available at `http://localhost:3000`

## Detailed Setup Instructions

### Backend Configuration

#### Environment Variables

Create a `.env` file in the `backend` directory:

\`\`\`env
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key

# JWT Configuration
JWT_SECRET_KEY=your-super-secret-jwt-key-here
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS Configuration (optional)
ALLOWED_ORIGINS=http://localhost:3000,https://your-frontend-domain.com
\`\`\`

#### Database Schema

Run the SQL schema in your Supabase SQL Editor:

\`\`\`bash
# The schema file is located at:
backend/database/schema.sql
\`\`\`

This creates all necessary tables:
- users (authentication)
- customers, vendors, products (master data)
- quotations, quotation_items (quotation management)
- orders, order_items (order management)
- purchase_orders, purchase_order_items (procurement)
- inventory, stock_movements (inventory tracking)
- shipments (import/export)

#### Running the Backend

\`\`\`bash
cd backend

# Activate virtual environment
source venv/bin/activate  # or venv\Scripts\activate on Windows

# Install dependencies (if not done already)
pip install -r requirements.txt

# Run with auto-reload for development
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Or run directly
python main.py
\`\`\`

#### API Documentation

Once the backend is running, visit:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

### Frontend Configuration

#### Environment Variables

Create a `.env.local` file in the project root:

\`\`\`env
# Backend API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

# Optional: Add other environment variables as needed
\`\`\`

#### Running the Frontend

\`\`\`bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
\`\`\`

## Project Structure

\`\`\`
qms-platform/
├── backend/                    # Python FastAPI backend
│   ├── auth/                  # Authentication utilities
│   ├── database/              # Database configuration and schema
│   ├── models/                # Pydantic models
│   ├── routers/               # API route handlers
│   ├── services/              # Business logic services
│   ├── main.py                # FastAPI application entry point
│   └── requirements.txt       # Python dependencies
├── app/                       # Next.js app directory
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page
├── components/                # React components
│   ├── ui/                   # Base UI components (shadcn/ui)
│   ├── master-data/          # Master data management
│   ├── quotations/           # Quotation management
│   ├── orders/               # Order and procurement
│   ├── inventory/            # Inventory tracking
│   ├── reports/              # Analytics and reports
│   ├── import-export/        # Import/export operations
│   ├── settings/             # Settings and configuration
│   └── dashboard.tsx         # Main dashboard component
├── lib/                      # Utility libraries
│   └── api/                  # API integration layer
├── public/                   # Static assets
├── package.json              # Node.js dependencies
└── README.md                 # This file
\`\`\`

## API Endpoints

### Authentication
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration
- `GET /api/v1/auth/me` - Get current user
- `PUT /api/v1/auth/profile` - Update user profile

### Master Data
- `GET /api/v1/customers` - List customers
- `POST /api/v1/customers` - Create customer
- `PUT /api/v1/customers/{id}` - Update customer
- `DELETE /api/v1/customers/{id}` - Delete customer

### Quotations
- `GET /api/v1/quotations` - List quotations
- `POST /api/v1/quotations` - Create quotation
- `GET /api/v1/quotations/{id}` - Get quotation details
- `PUT /api/v1/quotations/{id}` - Update quotation
- `POST /api/v1/quotations/{id}/pdf` - Generate PDF

### Orders & Procurement
- `GET /api/v1/orders` - List orders
- `POST /api/v1/orders` - Create order
- `GET /api/v1/orders/purchase-orders` - List purchase orders
- `POST /api/v1/orders/purchase-orders` - Create purchase order

### Inventory
- `GET /api/v1/inventory` - List inventory items
- `PUT /api/v1/inventory/{id}` - Update inventory item
- `POST /api/v1/inventory/movements` - Create stock movement
- `GET /api/v1/inventory/analytics` - Get inventory analytics

### Reports
- `GET /api/v1/reports/dashboard` - Dashboard metrics
- `GET /api/v1/reports/sales` - Sales reports
- `GET /api/v1/reports/quotations` - Quotation reports

### Import/Export
- `GET /api/v1/import-export/shipments` - List shipments
- `POST /api/v1/import-export/shipments` - Create shipment
- `GET /api/v1/import-export/export-data` - Export data

## User Roles and Permissions

### Admin
- Full access to all modules
- User management and system settings
- All CRUD operations

### Manager
- Access to most business modules
- Cannot manage users or system settings
- Can view reports and analytics

### User
- Limited access to quotations and basic operations
- Cannot access procurement or advanced features
- Read-only access to most data

## Development

### Adding New Features

1. **Backend**: Add new models in `backend/models/`, create routers in `backend/routers/`
2. **Frontend**: Create components in `components/`, add API services in `lib/api/`
3. **Database**: Update schema in `backend/database/schema.sql`

### Code Style

- **Backend**: Follow PEP 8 Python style guide
- **Frontend**: Use Prettier and ESLint for consistent formatting
- **TypeScript**: Enable strict mode for type safety

### Testing

\`\`\`bash
# Backend testing (add pytest)
cd backend
pytest

# Frontend testing
npm test
\`\`\`

## Deployment

### Backend Deployment

1. **Railway/Render/Heroku**:
   \`\`\`bash
   # Add Procfile
   web: uvicorn main:app --host 0.0.0.0 --port $PORT
   \`\`\`

2. **Docker**:
   \`\`\`dockerfile
   FROM python:3.9
   WORKDIR /app
   COPY requirements.txt .
   RUN pip install -r requirements.txt
   COPY . .
   CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
   \`\`\`

### Frontend Deployment

1. **Vercel** (Recommended):
   \`\`\`bash
   npm install -g vercel
   vercel
   \`\`\`

2. **Netlify**:
   \`\`\`bash
   npm run build
   # Upload dist folder
   \`\`\`

## Troubleshooting

### Common Issues

1. **Backend won't start**:
   - Check Python version (3.9+)
   - Verify virtual environment is activated
   - Ensure all dependencies are installed
   - Check Supabase credentials in .env

2. **Frontend API errors**:
   - Verify backend is running on port 8000
   - Check CORS configuration
   - Ensure API URL is correct in .env.local

3. **Database connection issues**:
   - Verify Supabase URL and key
   - Check if database schema is properly created
   - Ensure network connectivity

4. **Authentication not working**:
   - Check JWT secret key configuration
   - Verify token expiration settings
   - Clear browser localStorage if needed

### Getting Help

1. Check the API documentation at `http://localhost:8000/docs`
2. Review browser console for frontend errors
3. Check backend logs for API errors
4. Verify environment variables are correctly set

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the API documentation
