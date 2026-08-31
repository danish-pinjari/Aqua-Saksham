# AquaSaksham: Smart Community Health Monitoring & Early Warning System

AquaSaksham is a production-ready IoT water quality monitoring dashboard that interfaces directly with ESP32-based LoRa sensor nodes to provide real-time water health indicators, automated anomaly calculation, and diagnostic insights.

## Features
- **Accurate Wireframe Translation:** Preserves layout from the conceptual sketch (Overview, Risk, pH, TDS, Turbidity, AI Recommendation, Solution, Trends, and Disease Risk).
- **Sub-GHz LoRa Interface:** Formatted to receive packets with pH, TDS, Turbidity, Battery, and calculated Risk from remote field nodes.
- **Rule-Based Diagnostic Engine:** Configurable thresholds with automatic alert generation and disease probability scoring.
- **Dark Mode Support:** Light and dark UI modes.

## Quickstart

### 1. Backend Setup
```bash
cd backend
npm install
npm run dev