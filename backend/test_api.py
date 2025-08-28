"""
Simple API test script to verify all endpoints are working
"""
import requests
import json

BASE_URL = "http://localhost:8000/api/v1"

def test_health():
    """Test health endpoint"""
    try:
        response = requests.get("http://localhost:8000/health")
        print(f"Health Check: {response.status_code} - {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"Health Check Failed: {e}")
        return False

def test_auth():
    """Test authentication endpoints"""
    try:
        # Test registration
        register_data = {
            "email": "test@example.com",
            "password": "testpassword123",
            "full_name": "Test User",
            "role": "user"
        }
        
        response = requests.post(f"{BASE_URL}/auth/register", json=register_data)
        print(f"Registration: {response.status_code}")
        
        if response.status_code == 200:
            token = response.json()["access_token"]
            
            # Test getting current user
            headers = {"Authorization": f"Bearer {token}"}
            response = requests.get(f"{BASE_URL}/auth/me", headers=headers)
            print(f"Get Current User: {response.status_code}")
            
            return True
        
        return False
        
    except Exception as e:
        print(f"Auth Test Failed: {e}")
        return False

def test_customers():
    """Test customer endpoints"""
    try:
        response = requests.get(f"{BASE_URL}/customers")
        print(f"Get Customers: {response.status_code}")
        
        if response.status_code == 200:
            customers = response.json()
            print(f"Found {len(customers)} customers")
            return True
        
        return False
        
    except Exception as e:
        print(f"Customers Test Failed: {e}")
        return False

def test_products():
    """Test product endpoints"""
    try:
        response = requests.get(f"{BASE_URL}/products")
        print(f"Get Products: {response.status_code}")
        
        if response.status_code == 200:
            products = response.json()
            print(f"Found {len(products)} products")
            return True
        
        return False
        
    except Exception as e:
        print(f"Products Test Failed: {e}")
        return False

def main():
    """Run all tests"""
    print("🧪 Starting API Tests...")
    print("=" * 50)
    
    tests = [
        ("Health Check", test_health),
        ("Authentication", test_auth),
        ("Customers API", test_customers),
        ("Products API", test_products),
    ]
    
    results = []
    for test_name, test_func in tests:
        print(f"\n🔍 Testing {test_name}...")
        try:
            result = test_func()
            results.append((test_name, result))
            print(f"{'✅' if result else '❌'} {test_name}: {'PASSED' if result else 'FAILED'}")
        except Exception as e:
            results.append((test_name, False))
            print(f"❌ {test_name}: FAILED - {e}")
    
    print("\n" + "=" * 50)
    print("📊 Test Results Summary:")
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for test_name, result in results:
        status = "✅ PASSED" if result else "❌ FAILED"
        print(f"  {test_name}: {status}")
    
    print(f"\n🎯 Overall: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! API is working correctly.")
    else:
        print("⚠️  Some tests failed. Please check the API configuration.")

if __name__ == "__main__":
    main()
