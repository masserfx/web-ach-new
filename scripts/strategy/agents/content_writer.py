"""Content Writer Agent implementation."""

import json
import re
from typing import Any, Dict

from .base_agent import BaseAgent


class ContentWriterAgent(BaseAgent):
    """Agent specializing in content creation."""

    def __init__(self):
        """Initialize Content Writer Agent."""
        super().__init__(agent_name="content_writer", agent_type="content")

    def generate_prompt(self, task_data: Dict[str, Any]) -> str:
        """Generate prompt for content creation."""
        title = task_data.get("title", "")
        description = task_data.get("description", "")
        category = task_data.get("category", "")
        expected_output = task_data.get("expected_output", {})

        prompt = f"""
Tvůj úkol je vytvořit obsah pro AC Heating.

METADATA:
- Titulek: {title}
- Kategorie: {category}
- Popis: {description}

OČEKÁVANÝ VÝSTUP:
{json.dumps(expected_output, ensure_ascii=False, indent=2)}

POKYNY:
1. Vytvoř obsah v češtině
2. Zaměř se na AC Heating - tepelná čerpadla a fotovoltaiku
3. Zahrň SEO best practices
4. Struktura: Intro -> Sekce -> Závěr
5. Vrať validní JSON odpověď

VÝSTUP (JSON):
{{
  "title": "...",
  "meta_description": "...",
  "content": {{
    "intro": "...",
    "sections": [
      {{"heading": "...", "text": "..."}}
    ],
    "conclusion": "..."
  }},
  "seo_keywords": ["..."],
  "quality_score": 0.85
}}
"""
        return prompt

    def process_output(self, output: str) -> Dict[str, Any]:
        """Process AI output into structured format."""
        # Extract JSON from output
        json_match = re.search(r"\{.*\}", output, re.DOTALL)
        if json_match:
            try:
                data = json.loads(json_match.group())
                # Ensure quality score is present
                if "quality_score" not in data:
                    data["quality_score"] = 0.8
                return data
            except json.JSONDecodeError:
                pass

        # Fallback structure
        return {
            "title": "Obsah generovaný AI",
            "meta_description": output[:160],
            "content": {
                "intro": output[:200],
                "sections": [{"heading": "Obsah", "text": output}],
                "conclusion": "Děkuji za pozornost.",
            },
            "quality_score": 0.6,
        }
