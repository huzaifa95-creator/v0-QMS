#!/bin/bash
# Database setup script
# Make sure you have Supabase CLI installed: npm install -g supabase

echo "Setting up QMS Database..."

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "Supabase CLI not found. Please install it first:"
    echo "npm install -g supabase"
    exit 1
fi

# Login to Supabase (if not already logged in)
echo "Please make sure you're logged in to Supabase CLI"
echo "Run: supabase login"

# Link to your project
echo "Linking to Supabase project..."
supabase link --project-ref pyklckewplmuufynjikw

# Run migrations
echo "Creating database schema..."
supabase db push

echo "Database setup complete!"
echo ""
echo "Next steps:"
echo "1. Go to your Supabase dashboard"
echo "2. Navigate to SQL Editor"
echo "3. Run the contents of database/schema.sql"
echo "4. Run the contents of database/rls_policies.sql"
echo "5. Optionally run database/seed_data.sql for sample data"
