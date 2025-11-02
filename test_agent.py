#!/usr/bin/env python3
"""
Test Analytics Agent
"""
import asyncio
import sys
import os

# Add paths
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'analytics'))

async def test_agent():
    print("🧪 Testing Analytics Agent...\n")
    
    try:
        from agent.analyst import DataAnalyst
        
        # Test 1: Simple query
        print("Test 1: Simple data query")
        print("-" * 50)
        
        analyst = DataAnalyst()
        
        result = await analyst.analyze("""
        Rychlý test analýzy:
        1. Kolik leadů máme v databázi celkem?
        2. Kolik produktů je published?
        
        Odpověz krátce, max 5 vět.
        """)
        
        if result["success"]:
            print("✅ Agent funguje!")
            print(f"\nOdpověď:\n{result['response']}")
            print(f"\nRecommendations: {len(result['recommendations'])}")
            print(f"Charts: {len(result['charts'])}")
        else:
            print("❌ Agent selhala")
            return False
        
        print("\n" + "="*50 + "\n")
        
        return True
    
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = asyncio.run(test_agent())
    sys.exit(0 if success else 1)
