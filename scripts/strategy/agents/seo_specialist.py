"""SEO Specialist Agent implementation."""

import json
import re
from typing import Any, Dict

from .base_agent import BaseAgent


class SEOSpecialistAgent(BaseAgent):
    """Agent specializing in SEO optimization."""

    def __init__(self):
        """Initialize SEO Specialist Agent."""
        super().__init__(agent_name="seo_specialist", agent_type="seo")

    def generate_prompt(self, task_data: Dict[str, Any]) -> str:
        """Generate prompt for SEO optimization."""
        title = task_data.get("title", "")
        description = task_data.get("description", "")
        target_keywords = task_data.get("target_keywords", [])

        prompt = f"""
Jsi SEO expert. Vyoptimalizuj obsah pro AC Heating.

OBSAH:
- Titulek: {title}
- Popis: {description}
- Cílová klíčová slova: {', '.join(target_keywords)}

POKYNY:
1. Zjisti vhodná klíčová slova pro český trh
2. Vytvořit meta tagy (title, description, h1, h2)
3. Doporučit interní linky
4. Vrať strukturovaný JSON

VÝSTUP (JSON):
{{
  "meta_title": "...",
  "meta_description": "...",
  "h1": "...",
  "h2_sections": ["...", "..."],
  "keywords": {{"primary": "...", "secondary": ["...", "..."]}},
  "internal_links": [
    {{"anchor": "...", "url": "/..."}}
  ],
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
            "meta_title": "AC Heating - Tepelná čerpadla",
            "meta_description": "Profesionální řešení tepelných čerpadel a fotovoltaiky",
            "keywords": {
                "primary": "tepelná čerpadla",
                "secondary": ["fotovoltaika", "energie"],
            },
            "quality_score": 0.7,
        }
