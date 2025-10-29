"""Marketing Copy Agent implementation."""

import json
import re
from typing import Any, Dict

from .base_agent import BaseAgent


class MarketingCopyAgent(BaseAgent):
    """Agent specializing in marketing copy and CTAs."""

    def __init__(self):
        """Initialize Marketing Copy Agent."""
        super().__init__(agent_name="marketing_copy", agent_type="marketing")

    def generate_prompt(self, task_data: Dict[str, Any]) -> str:
        """Generate prompt for marketing copy."""
        title = task_data.get("title", "")
        description = task_data.get("description", "")
        target_audience = task_data.get("target_audience", "")

        prompt = f"""
Jsi conversion copywriter pro AC Heating.

ÚKOL:
- Titulek: {title}
- Popis: {description}
- Cílová audience: {target_audience}

POKYNY:
1. Napište persuasivní kopii zaměřenou na konverze
2. Zahrňte silné CTAs (Call-to-Action)
3. Zdůrazněte benefity a value proposition
4. Psát emocionálně a přesvědčivě
5. Vrať JSON odpověď

VÝSTUP (JSON):
{{
  "headline": "...",
  "subheadline": "...",
  "body_copy": "...",
  "value_propositions": ["...", "..."],
  "cta_primary": "...",
  "cta_secondary": "...",
  "social_proof": "...",
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
            "headline": "Vaše energie pro budoucnost",
            "subheadline": "Moderní řešení tepelných čerpadel a fotovoltaiky",
            "cta_primary": "Získat bezplatnou konzultaci",
            "cta_secondary": "Zjistit více",
            "quality_score": 0.7,
        }
