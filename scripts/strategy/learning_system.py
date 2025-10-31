"""Learning system for pattern recognition and feedback processing."""

import logging
import uuid
from typing import Any, Dict, List, Optional
from datetime import datetime
import json

logger = logging.getLogger(__name__)


class LearningSystem:
    """Manages feedback collection and pattern recognition."""

    def __init__(self, neo4j_conn):
        """Initialize learning system with Neo4j connection."""
        self.neo4j = neo4j_conn

    def record_feedback(
        self,
        execution_id: str,
        feedback_type: str,
        feedback_data: Dict[str, Any],
        confidence: float = 0.8
    ) -> str:
        """Record feedback from task execution."""
        learning_id = str(uuid.uuid4())
        
        # Extract pattern from feedback
        pattern_type = self._identify_pattern_type(feedback_type, feedback_data)
        
        # Calculate impact score
        impact_score = self._calculate_impact_score(feedback_data)
        
        learning_data = {
            "learning_id": learning_id,
            "execution_id": execution_id,
            "pattern_type": pattern_type,
            "feedback": json.dumps(feedback_data),
            "confidence": confidence,
            "impact_score": impact_score
        }
        
        # Store in Neo4j
        self.neo4j.create_learning_node(learning_data)
        
        # Link to existing patterns
        self._link_to_patterns(learning_id, pattern_type, feedback_data)
        
        logger.info(f"Recorded learning: {learning_id} (type: {pattern_type})")
        return learning_id

    def _identify_pattern_type(self, feedback_type: str, data: Dict[str, Any]) -> str:
        """Identify pattern type from feedback."""
        # Pattern types based on feedback
        pattern_map = {
            "quality_improvement": "quality_pattern",
            "error_resolution": "error_pattern",
            "optimization": "optimization_pattern",
            "user_feedback": "user_preference_pattern",
            "performance": "performance_pattern"
        }
        
        return pattern_map.get(feedback_type, "general_pattern")

    def _calculate_impact_score(self, feedback_data: Dict[str, Any]) -> float:
        """Calculate impact score based on feedback metrics."""
        # Base score
        score = 0.5
        
        # Quality improvement
        if "quality_delta" in feedback_data:
            score += feedback_data["quality_delta"] * 0.3
        
        # Performance improvement
        if "performance_delta" in feedback_data:
            score += feedback_data["performance_delta"] * 0.2
        
        # User satisfaction
        if "user_rating" in feedback_data:
            score += (feedback_data["user_rating"] / 5.0) * 0.3
        
        # Error reduction
        if "error_reduction" in feedback_data:
            score += feedback_data["error_reduction"] * 0.2
        
        return min(max(score, 0.0), 1.0)  # Clamp to [0, 1]

    def _link_to_patterns(
        self, 
        learning_id: str, 
        pattern_type: str, 
        feedback_data: Dict[str, Any]
    ) -> None:
        """Link learning to existing or new patterns."""
        # Find or create pattern
        pattern_desc = self._generate_pattern_description(pattern_type, feedback_data)
        
        # Check if pattern exists
        existing_patterns = self.neo4j.find_similar_patterns(pattern_type, limit=1)
        
        if existing_patterns:
            # Update existing pattern
            pattern = existing_patterns[0]
            self.neo4j.create_pattern_node({
                "description": pattern["description"],
                "pattern_type": pattern_type,
                "frequency": pattern["frequency"] + 1,
                "success_rate": pattern["success_rate"]  # Will be updated later
            })
        else:
            # Create new pattern
            self.neo4j.create_pattern_node({
                "description": pattern_desc,
                "pattern_type": pattern_type,
                "frequency": 1,
                "success_rate": 0.5  # Initial neutral score
            })
        
        # Link learning to pattern
        self.neo4j.link_learning_to_pattern(learning_id, pattern_desc)

    def _generate_pattern_description(
        self, 
        pattern_type: str, 
        feedback_data: Dict[str, Any]
    ) -> str:
        """Generate human-readable pattern description."""
        # Extract key features from feedback
        features = []
        
        if "task_category" in feedback_data:
            features.append(f"category:{feedback_data['task_category']}")
        
        if "agent_type" in feedback_data:
            features.append(f"agent:{feedback_data['agent_type']}")
        
        if "complexity" in feedback_data:
            features.append(f"complexity:{feedback_data['complexity']}")
        
        feature_str = ", ".join(features) if features else "general"
        return f"{pattern_type} - {feature_str}"

    def get_recommendations(
        self, 
        task_data: Dict[str, Any], 
        agent_name: str
    ) -> List[Dict[str, Any]]:
        """Get recommendations based on learned patterns."""
        # Find similar historical tasks
        task_category = task_data.get("category", "general")
        
        # Get patterns for this category
        patterns = self.neo4j.find_similar_patterns(f"{task_category}_pattern", limit=5)
        
        recommendations = []
        for pattern in patterns:
            if pattern["success_rate"] > 0.7:  # Only high-success patterns
                recommendations.append({
                    "pattern": pattern["description"],
                    "success_rate": pattern["success_rate"],
                    "frequency": pattern["frequency"],
                    "recommendation": self._generate_recommendation(pattern)
                })
        
        return recommendations

    def _generate_recommendation(self, pattern: Dict[str, Any]) -> str:
        """Generate actionable recommendation from pattern."""
        # Simple rule-based recommendations
        if "error_pattern" in pattern["description"]:
            return "Implement additional error handling based on past failures"
        elif "quality_pattern" in pattern["description"]:
            return "Apply quality improvement techniques from similar tasks"
        elif "optimization_pattern" in pattern["description"]:
            return "Use optimization strategies that worked before"
        else:
            return "Follow best practices from similar successful tasks"

    def analyze_agent_learning(self, agent_name: str) -> Dict[str, Any]:
        """Analyze what an agent has learned over time."""
        insights = self.neo4j.get_learning_insights(agent_name)
        
        if not insights:
            return {
                "agent_name": agent_name,
                "total_learnings": 0,
                "status": "No learning data available"
            }
        
        return {
            "agent_name": agent_name,
            "total_learnings": insights.get("total_learnings", 0),
            "unique_patterns": insights.get("unique_patterns", 0),
            "avg_confidence": round(insights.get("avg_confidence", 0.0), 2),
            "avg_impact": round(insights.get("avg_impact", 0.0), 2),
            "pattern_types": insights.get("pattern_types", []),
            "learning_velocity": self._calculate_learning_velocity(insights)
        }

    def _calculate_learning_velocity(self, insights: Dict[str, Any]) -> str:
        """Calculate how fast the agent is learning."""
        total = insights.get("total_learnings", 0)
        
        if total == 0:
            return "no_learning"
        elif total < 10:
            return "slow"
        elif total < 50:
            return "moderate"
        else:
            return "fast"

    def export_learning_report(self, output_format: str = "json") -> Dict[str, Any]:
        """Export comprehensive learning report."""
        # Get overall insights
        overall_insights = self.neo4j.get_learning_insights()
        
        # Get per-agent insights
        agent_insights = {}
        agents = ["content_writer", "seo_specialist", "product_manager", "marketing_copy"]
        for agent in agents:
            agent_insights[agent] = self.analyze_agent_learning(agent)
        
        report = {
            "timestamp": datetime.utcnow().isoformat(),
            "overall": overall_insights,
            "agents": agent_insights,
            "summary": {
                "total_learnings": overall_insights.get("total_learnings", 0),
                "total_patterns": overall_insights.get("unique_patterns", 0),
                "system_maturity": self._calculate_system_maturity(overall_insights)
            }
        }
        
        if output_format == "json":
            return report
        elif output_format == "markdown":
            return self._format_as_markdown(report)
        else:
            return report

    def _calculate_system_maturity(self, insights: Dict[str, Any]) -> str:
        """Calculate overall system learning maturity."""
        learnings = insights.get("total_learnings", 0)
        patterns = insights.get("unique_patterns", 0)
        
        if learnings == 0:
            return "nascent"
        elif learnings < 20 or patterns < 5:
            return "developing"
        elif learnings < 100 or patterns < 20:
            return "maturing"
        else:
            return "mature"

    def _format_as_markdown(self, report: Dict[str, Any]) -> str:
        """Format report as markdown."""
        md = f"# Learning System Report\n\n"
        md += f"Generated: {report['timestamp']}\n\n"
        md += f"## Summary\n\n"
        md += f"- **Total Learnings**: {report['summary']['total_learnings']}\n"
        md += f"- **Total Patterns**: {report['summary']['total_patterns']}\n"
        md += f"- **System Maturity**: {report['summary']['system_maturity']}\n\n"
        
        md += f"## Agent Performance\n\n"
        for agent, insights in report['agents'].items():
            md += f"### {agent}\n"
            md += f"- Learnings: {insights['total_learnings']}\n"
            md += f"- Patterns: {insights['unique_patterns']}\n"
            md += f"- Avg Confidence: {insights['avg_confidence']}\n"
            md += f"- Learning Velocity: {insights['learning_velocity']}\n\n"
        
        return md
