"""
Tools for Data Analyst Agent
"""
import os
import json
import pandas as pd
import numpy as np
import matplotlib
matplotlib.use('Agg')  # Non-interactive backend
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime
from supabase import create_client, Client
from typing import Dict, Any

# Supabase client
def get_supabase() -> Client:
    url = os.getenv('SUPABASE_URL')
    key = os.getenv('SUPABASE_SERVICE_ROLE_KEY') or os.getenv('SUPABASE_SERVICE_KEY')
    
    if not url or not key:
        raise ValueError("Supabase credentials not configured")
    
    return create_client(url, key)

async def execute_sql(query: str) -> Dict[str, Any]:
    """
    Execute SQL query on Supabase
    Returns: {success, rows, data, preview}
    """
    try:
        supabase = get_supabase()
        
        # Use PostgREST for SELECT queries
        if query.strip().upper().startswith('SELECT'):
            # Extract table name (basic parsing)
            table_name = query.split('FROM')[1].split()[0].strip()
            
            result = supabase.table(table_name).select('*').execute()
            
            df = pd.DataFrame(result.data) if result.data else pd.DataFrame()
            
            return {
                "success": True,
                "rows": len(df),
                "columns": list(df.columns) if not df.empty else [],
                "data": df.to_dict('records') if not df.empty else [],
                "preview": df.head(10).to_dict('records') if not df.empty else []
            }
        else:
            return {
                "success": False,
                "error": "Only SELECT queries supported via this method"
            }
    
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

async def execute_python(code: str) -> Dict[str, Any]:
    """
    Execute Python code safely
    Has access to: pandas (pd), numpy (np), supabase data
    """
    try:
        # Prepare safe execution environment
        supabase = get_supabase()
        
        safe_globals = {
            'pd': pd,
            'np': np,
            'json': json,
            'supabase': supabase,
            '__builtins__': {
                'len': len,
                'str': str,
                'int': int,
                'float': float,
                'list': list,
                'dict': dict,
                'sum': sum,
                'max': max,
                'min': min,
                'range': range,
                'print': print,
            }
        }
        
        # Execute code
        exec(code, safe_globals)
        
        # Extract result variable if exists
        result_output = {}
        if 'result' in safe_globals:
            result_value = safe_globals['result']
            if isinstance(result_value, pd.DataFrame):
                result_output = result_value.to_dict('records')
            elif isinstance(result_value, (list, dict)):
                result_output = result_value
            else:
                result_output = str(result_value)
        
        return {
            "success": True,
            "output": result_output
        }
    
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "traceback": str(e)
        }

async def create_chart(
    data: str,
    chart_type: str,
    title: str
) -> str:
    """
    Create chart and save to file
    Returns: path to chart file
    """
    try:
        # Parse data
        data_dict = json.loads(data)
        df = pd.DataFrame(data_dict)
        
        if df.empty:
            return "Error: No data provided"
        
        # Set style
        sns.set_style("whitegrid")
        plt.figure(figsize=(12, 7))
        
        # Create chart based on type
        if chart_type == "bar":
            if len(df.columns) >= 2:
                plt.bar(df.iloc[:, 0], df.iloc[:, 1], color='#DC2626')
                plt.xlabel(df.columns[0])
                plt.ylabel(df.columns[1])
        
        elif chart_type == "line":
            if len(df.columns) >= 2:
                plt.plot(df.iloc[:, 0], df.iloc[:, 1], marker='o', linewidth=2, color='#DC2626')
                plt.xlabel(df.columns[0])
                plt.ylabel(df.columns[1])
        
        elif chart_type == "pie":
            if len(df.columns) >= 2:
                colors = ['#DC2626', '#EA580C', '#F59E0B', '#10B981', '#3B82F6']
                plt.pie(df.iloc[:, 1], labels=df.iloc[:, 0], autopct='%1.1f%%', colors=colors)
        
        plt.title(title, fontsize=16, fontweight='bold', pad=20)
        plt.tight_layout()
        
        # Save chart
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"chart_{timestamp}.png"
        filepath = f"analytics/outputs/charts/{filename}"
        
        # Ensure directory exists
        os.makedirs('analytics/outputs/charts', exist_ok=True)
        
        plt.savefig(filepath, dpi=150, bbox_inches='tight', facecolor='white')
        plt.close()
        
        return filepath
    
    except Exception as e:
        plt.close()
        return f"Error creating chart: {str(e)}"
