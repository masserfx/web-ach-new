#!/bin/bash

# ============================================================================
# AC Heating Website Monitoring - Quick Run Script
# ============================================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}╔═══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║         AC Heating Website Monitoring System                  ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check dependencies
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    npm install
fi

# Check for .env file
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  No .env file found. Creating from .env.example...${NC}"
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo -e "${YELLOW}⚠️  Please edit .env and add your ANTHROPIC_API_KEY${NC}"
        exit 1
    else
        echo -e "${RED}❌ No .env.example file found${NC}"
        exit 1
    fi
fi

# Load environment variables
set -a
source .env
set +a

# Check for API key
if [ -z "$ANTHROPIC_API_KEY" ]; then
    echo -e "${RED}❌ ANTHROPIC_API_KEY is not set in .env${NC}"
    exit 1
fi

# Create reports directory
mkdir -p reports

# Run monitoring check
echo -e "${GREEN}🚀 Running website monitoring check...${NC}"
echo ""

npm run check

EXIT_CODE=$?

if [ $EXIT_CODE -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ Monitoring check completed successfully${NC}"

    # Show latest report
    LATEST_REPORT=$(ls -t reports/report-*.json 2>/dev/null | head -1)
    if [ -n "$LATEST_REPORT" ]; then
        echo ""
        echo -e "${GREEN}📊 Latest Report: $LATEST_REPORT${NC}"

        # Extract key metrics using jq if available
        if command -v jq &> /dev/null; then
            STATUS=$(jq -r '.overallStatus' "$LATEST_REPORT")

            if [ "$STATUS" = "GREEN" ]; then
                echo -e "${GREEN}Status: ✅ $STATUS${NC}"
            elif [ "$STATUS" = "YELLOW" ]; then
                echo -e "${YELLOW}Status: ⚠️  $STATUS${NC}"
            else
                echo -e "${RED}Status: ❌ $STATUS${NC}"
            fi

            echo ""
            echo "Page Scores:"
            jq -r '.pages[] | "  \(.url): Performance=\(.lighthouse.performance), SEO=\(.lighthouse.seo)"' "$LATEST_REPORT"
        fi
    fi
else
    echo ""
    echo -e "${RED}❌ Monitoring check failed with exit code $EXIT_CODE${NC}"
    exit $EXIT_CODE
fi
