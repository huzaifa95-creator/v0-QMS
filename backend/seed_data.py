"""
Seed script to populate the database with sample data for testing
"""
import asyncio
import uuid
from datetime import datetime, timedelta
from supabase import create_client
import os
from dotenv import load_dotenv

load_dotenv()

# Initialize Supabase client
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_ANON_KEY")
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

async def seed_database():
    """Seed the database with sample data"""
    
    print("🌱 Starting database seeding...")
    
    try:
        # Sample customers
        customers = [
            {
                "id": str(uuid.uuid4()),
                "name": "Acme Corporation",
                "email": "contact@acme.com",
                "phone": "+1-555-0101",
                "address": "123 Business St",
                "city": "New York",
                "country": "USA",
                "tax_number": "TAX123456",
                "created_at": datetime.now().isoformat(),
                "updated_at": datetime.now().isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Global Tech Solutions",
                "email": "info@globaltech.com",
                "phone": "+1-555-0102",
                "address": "456 Tech Ave",
                "city": "San Francisco",
                "country": "USA",
                "tax_number": "TAX789012",
                "created_at": datetime.now().isoformat(),
                "updated_at": datetime.now().isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "European Imports Ltd",
                "email": "orders@euroimports.eu",
                "phone": "+44-20-7946-0958",
                "address": "789 Import Blvd",
                "city": "London",
                "country": "UK",
                "tax_number": "GB123456789",
                "created_at": datetime.now().isoformat(),
                "updated_at": datetime.now().isoformat()
            }
        ]
        
        # Sample vendors
        vendors = [
            {
                "id": str(uuid.uuid4()),
                "name": "Premium Suppliers Inc",
                "email": "sales@premiumsuppliers.com",
                "phone": "+1-555-0201",
                "address": "321 Supply Chain Dr",
                "city": "Chicago",
                "country": "USA",
                "tax_number": "TAX345678",
                "payment_terms": "Net 30",
                "created_at": datetime.now().isoformat(),
                "updated_at": datetime.now().isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Asian Manufacturing Co",
                "email": "procurement@asianmfg.com",
                "phone": "+86-21-1234-5678",
                "address": "555 Manufacturing Rd",
                "city": "Shanghai",
                "country": "China",
                "tax_number": "CN987654321",
                "payment_terms": "Net 45",
                "created_at": datetime.now().isoformat(),
                "updated_at": datetime.now().isoformat()
            }
        ]
        
        # Sample products
        products = [
            {
                "id": str(uuid.uuid4()),
                "name": "Premium Widget A",
                "sku": "PWA-001",
                "description": "High-quality widget for industrial applications",
                "category": "Widgets",
                "unit_price": 25.99,
                "unit": "piece",
                "is_active": True,
                "created_at": datetime.now().isoformat(),
                "updated_at": datetime.now().isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Standard Component B",
                "sku": "SCB-002",
                "description": "Standard component for general use",
                "category": "Components",
                "unit_price": 15.50,
                "unit": "piece",
                "is_active": True,
                "created_at": datetime.now().isoformat(),
                "updated_at": datetime.now().isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Deluxe Assembly C",
                "sku": "DAC-003",
                "description": "Complete assembly with premium features",
                "category": "Assemblies",
                "unit_price": 89.99,
                "unit": "set",
                "is_active": True,
                "created_at": datetime.now().isoformat(),
                "updated_at": datetime.now().isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Basic Tool D",
                "sku": "BTD-004",
                "description": "Essential tool for maintenance",
                "category": "Tools",
                "unit_price": 12.75,
                "unit": "piece",
                "is_active": True,
                "created_at": datetime.now().isoformat(),
                "updated_at": datetime.now().isoformat()
            }
        ]
        
        # Insert customers
        print("👥 Inserting customers...")
        result = supabase.table("customers").insert(customers).execute()
        print(f"✅ Inserted {len(result.data)} customers")
        
        # Insert vendors
        print("🏭 Inserting vendors...")
        result = supabase.table("vendors").insert(vendors).execute()
        print(f"✅ Inserted {len(result.data)} vendors")
        
        # Insert products
        print("📦 Inserting products...")
        result = supabase.table("products").insert(products).execute()
        print(f"✅ Inserted {len(result.data)} products")
        
        # Create inventory entries for products
        print("📊 Creating inventory entries...")
        inventory_items = []
        for product in products:
            inventory_items.append({
                "id": str(uuid.uuid4()),
                "product_id": product["id"],
                "current_stock": 100,  # Starting stock
                "minimum_stock": 10,
                "maximum_stock": 500,
                "reorder_point": 25,
                "unit_cost": product["unit_price"] * 0.7,  # 30% markup
                "last_updated": datetime.now().isoformat()
            })
        
        result = supabase.table("inventory").insert(inventory_items).execute()
        print(f"✅ Created {len(result.data)} inventory entries")
        
        # Create sample quotations
        print("📋 Creating sample quotations...")
        quotations = []
        for i, customer in enumerate(customers[:2]):  # Create 2 sample quotations
            quotation_id = str(uuid.uuid4())
            quotations.append({
                "id": quotation_id,
                "quotation_number": f"QUO-{datetime.now().strftime('%Y%m%d')}-{str(uuid.uuid4())[:8].upper()}",
                "customer_id": customer["id"],
                "status": "sent" if i == 0 else "draft",
                "total_amount": 150.00 if i == 0 else 89.99,
                "valid_until": (datetime.now() + timedelta(days=30)).isoformat(),
                "notes": f"Sample quotation for {customer['name']}",
                "created_at": datetime.now().isoformat(),
                "updated_at": datetime.now().isoformat()
            })
        
        result = supabase.table("quotations").insert(quotations).execute()
        print(f"✅ Created {len(result.data)} quotations")
        
        print("🎉 Database seeding completed successfully!")
        
    except Exception as e:
        print(f"❌ Error seeding database: {str(e)}")
        raise

if __name__ == "__main__":
    asyncio.run(seed_database())
