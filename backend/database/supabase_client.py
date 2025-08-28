from supabase import create_client, Client
from typing import Optional, Dict, Any, List
import os
from dotenv import load_dotenv

load_dotenv()

class SupabaseClient:
    def __init__(self):
        self.url = os.getenv("SUPABASE_URL")
        self.key = os.getenv("SUPABASE_ANON_KEY")
        self.service_key = os.getenv("SUPABASE_SERVICE_KEY")
        
        if not self.url or not self.key:
            raise ValueError("Supabase URL and key must be provided")
        
        self.client: Client = create_client(self.url, self.key)
        self.admin_client: Client = create_client(self.url, self.service_key) if self.service_key else None

    async def create_record(self, table: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new record in the specified table"""
        try:
            result = self.client.table(table).insert(data).execute()
            return {"success": True, "data": result.data[0] if result.data else None}
        except Exception as e:
            return {"success": False, "error": str(e)}

    async def get_records(self, table: str, filters: Optional[Dict[str, Any]] = None, 
                         limit: Optional[int] = None, offset: Optional[int] = None) -> Dict[str, Any]:
        """Get records from the specified table with optional filters"""
        try:
            query = self.client.table(table).select("*")
            
            if filters:
                for key, value in filters.items():
                    query = query.eq(key, value)
            
            if limit:
                query = query.limit(limit)
            
            if offset:
                query = query.offset(offset)
            
            result = query.execute()
            return {"success": True, "data": result.data, "count": len(result.data)}
        except Exception as e:
            return {"success": False, "error": str(e)}

    async def update_record(self, table: str, record_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Update a record in the specified table"""
        try:
            result = self.client.table(table).update(data).eq("id", record_id).execute()
            return {"success": True, "data": result.data[0] if result.data else None}
        except Exception as e:
            return {"success": False, "error": str(e)}

    async def delete_record(self, table: str, record_id: str) -> Dict[str, Any]:
        """Delete a record from the specified table"""
        try:
            result = self.client.table(table).delete().eq("id", record_id).execute()
            return {"success": True, "data": result.data}
        except Exception as e:
            return {"success": False, "error": str(e)}

    async def search_records(self, table: str, search_column: str, search_term: str) -> Dict[str, Any]:
        """Search records in the specified table"""
        try:
            result = self.client.table(table).select("*").ilike(search_column, f"%{search_term}%").execute()
            return {"success": True, "data": result.data, "count": len(result.data)}
        except Exception as e:
            return {"success": False, "error": str(e)}

# Global instance
db = SupabaseClient()
