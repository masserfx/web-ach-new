"""
Self-hosted Data Analyst Agent for AC Heating
Uses Claude 3.5 directly without agency-swarm
"""
from anthropic import Anthropic
import os
from typing import List, Dict, Any, Optional
import json
from datetime import datetime

class DataAnalyst:
    """AI Data Analyst using Claude with tools"""
    
    def __init__(self):
        api_key = os.getenv('ANTHROPIC_API_KEY')
        if not api_key:
            raise ValueError("ANTHROPIC_API_KEY not set")
        
        self.client = Anthropic(api_key=api_key)
        self.model = "claude-3-5-haiku-20241022"  # Fast and cost-effective
        self.conversation_history = []
        
    @property
    def system_prompt(self) -> str:
        return """Jsi data analytik pro AC Heating - českou firmu specializující se na tepelná čerpadla a fotovoltaiku.

TVOJE ROLE:
- Analyzuješ data z Supabase databáze
- Vytváříš grafy a vizualizace
- Identifikuješ patterns a trendy
- Poskytuje konkrétní actionable doporučení

DATABÁZE (Supabase PostgreSQL):
- products: 8 produktů (TČ, FVE, klimatizace, retrofit)
- leads: Všechny leady s contact info, property details, status
- analytics_events: User behavior tracking (calculator, chatbot, page views)
- blog_posts: Články

AVAILABLE TOOLS:
1. execute_sql: Spusť SQL query na Supabase
2. execute_python: Spusť Python kód (pandas, numpy, matplotlib)
3. create_chart: Vytvoř vizualizaci

PRAVIDLA:
- Odpovídej VŽDY v češtině
- Buď konkrétní a data-driven
- Uváděj čísla a procenta
- Vytváře grafy pro lepší pochopení
- Poskytni 3-5 actionable doporučení
- Formátuj odpověď v Markdown"""

    @property
    def tools(self) -> List[Dict]:
        """Tool definitions for Claude"""
        return [
            {
                "name": "execute_sql",
                "description": "Execute SQL query on Supabase PostgreSQL database",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "query": {
                            "type": "string",
                            "description": "SQL query to execute. Use PostgreSQL syntax."
                        }
                    },
                    "required": ["query"]
                }
            },
            {
                "name": "execute_python",
                "description": "Execute Python code for data analysis. Has access to pandas, numpy, matplotlib.",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "code": {
                            "type": "string",
                            "description": "Python code to execute"
                        }
                    },
                    "required": ["code"]
                }
            },
            {
                "name": "create_chart",
                "description": "Create a chart/visualization",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "data": {
                            "type": "string",
                            "description": "Data in JSON format: [{label: string, value: number}]"
                        },
                        "chart_type": {
                            "type": "string",
                            "enum": ["bar", "line", "pie"],
                            "description": "Type of chart to create"
                        },
                        "title": {
                            "type": "string",
                            "description": "Chart title in Czech"
                        }
                    },
                    "required": ["data", "chart_type", "title"]
                }
            }
        ]
    
    async def analyze(self, query: str) -> Dict[str, Any]:
        """
        Main analysis method
        Returns: {response, charts, recommendations}
        """
        
        self.conversation_history = [
            {"role": "user", "content": query}
        ]
        
        max_iterations = 10
        iteration = 0
        charts_created = []
        
        while iteration < max_iterations:
            iteration += 1
            
            response = self.client.messages.create(
                model=self.model,
                max_tokens=4096,
                system=self.system_prompt,
                tools=self.tools,
                messages=self.conversation_history
            )
            
            # Check if we're done
            if response.stop_reason == "end_turn":
                final_text = self._extract_text(response.content)
                
                return {
                    "response": final_text,
                    "charts": charts_created,
                    "recommendations": self._extract_recommendations(final_text),
                    "success": True
                }
            
            # Process tool calls
            if response.stop_reason == "tool_use":
                tool_results = await self._execute_tools(response.content)
                
                # Track charts
                for result in tool_results:
                    if "chart_path" in str(result.get("content", "")):
                        charts_created.append(result["content"])
                
                self.conversation_history.append({
                    "role": "assistant",
                    "content": response.content
                })
                self.conversation_history.append({
                    "role": "user",
                    "content": tool_results
                })
                continue
            
            # Unexpected stop reason
            break
        
        # Fallback if max iterations reached
        return {
            "response": "Analýza dokončena po maximálním počtu iterací.",
            "charts": charts_created,
            "recommendations": [],
            "success": False
        }
    
    async def _execute_tools(self, content: List) -> List[Dict]:
        """Execute tools requested by Claude"""
        from .tools import execute_sql, execute_python, create_chart
        
        results = []
        
        for block in content:
            if hasattr(block, 'type') and block.type == "tool_use":
                tool_name = block.name
                tool_input = block.input
                tool_id = block.id
                
                try:
                    if tool_name == "execute_sql":
                        result = await execute_sql(tool_input["query"])
                        results.append({
                            "type": "tool_result",
                            "tool_use_id": tool_id,
                            "content": json.dumps(result, ensure_ascii=False)
                        })
                    
                    elif tool_name == "execute_python":
                        result = await execute_python(tool_input["code"])
                        results.append({
                            "type": "tool_result",
                            "tool_use_id": tool_id,
                            "content": str(result)
                        })
                    
                    elif tool_name == "create_chart":
                        chart_path = await create_chart(
                            tool_input["data"],
                            tool_input["chart_type"],
                            tool_input["title"]
                        )
                        results.append({
                            "type": "tool_result",
                            "tool_use_id": tool_id,
                            "content": f"Chart created: {chart_path}"
                        })
                
                except Exception as e:
                    results.append({
                        "type": "tool_result",
                        "tool_use_id": tool_id,
                        "content": f"Error: {str(e)}"
                    })
        
        return results
    
    def _extract_text(self, content: List) -> str:
        """Extract text from Claude response"""
        text_parts = []
        for block in content:
            if hasattr(block, 'type') and block.type == "text":
                text_parts.append(block.text)
        return "\n\n".join(text_parts)
    
    def _extract_recommendations(self, text: str) -> List[str]:
        """Extract recommendations from markdown text"""
        recommendations = []
        lines = text.split('\n')
        
        in_recommendations = False
        for line in lines:
            line = line.strip()
            
            # Look for recommendations section
            if 'doporučení' in line.lower() or 'akce' in line.lower():
                in_recommendations = True
                continue
            
            # Extract numbered or bulleted items
            if in_recommendations and (line.startswith('-') or line.startswith('*') or line[0:2].replace('.', '').isdigit()):
                rec = line.lstrip('-*0123456789. ')
                if rec:
                    recommendations.append(rec)
        
        return recommendations[:10]  # Max 10 recommendations
