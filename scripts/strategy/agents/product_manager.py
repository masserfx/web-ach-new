"""Product Manager Agent implementation."""

import json
import re
from typing import Any, Dict

from .base_agent import BaseAgent


class ProductManagerAgent(BaseAgent):
    """Agent specializing in product management."""

    def __init__(self):
        """Initialize Product Manager Agent."""
        super().__init__(agent_name="product_manager", agent_type="product")

    def generate_prompt(self, task_data: Dict[str, Any]) -> str:
        """Generate prompt for product descriptions."""
        title = task_data.get("title", "")
        category = task_data.get("category", "")
        description = task_data.get("description", "")

        prompt = f"""
Jsi produktový manažer pro AC Heating.

PRODUKT:
- Název: {title}
- Kategorie: {category}
- Popis: {description}

POKYNY:
1. Vytvoř profesionální popis produktu
2. Zvýrazni benefity a výhody
3. Zahrň technické specifikace
4. Vrať JSON odpověď

VÝSTUP (JSON):
{{
  "product_name": "...",
  "short_description": "...",
  "long_description": "...",
  "key_features": ["...", "..."],
  "benefits": ["...", "..."],
  "technical_specs": {{"spec": "value"}},
  "target_audience": "...",
  "quality_score": 0.9
}}
"""
        return prompt

    def process_output(self, output: str) -> Dict[str, Any]:
        """Process AI output into structured format."""
        json_match = re.search(r"\{.*\}", output, re.DOTALL)
        if json_match:
            try:
                data = json.loads(json_match.group())
                if "quality_score" not in data:
                    data["quality_score"] = 0.85
                return data
            except json.JSONDecodeError:
                pass

        return {
            "product_name": "AC Heating Produkt",
            "short_description": "Inovativní řešení pro vaši energetickou potřebu",
            "key_features": ["Efektivní", "Spolehlivé", "Ekonomické"],
            "benefits": ["Nižší náklady", "Vyšší pohodlí", "Ochrana přírody"],
            "quality_score": 0.7,
        }
