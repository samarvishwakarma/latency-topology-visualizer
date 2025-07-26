# Latency Topology Visualizer

## Overview
This is a Next.js application that visualizes cryptocurrency exchange server locations and real-time/historical latency data on a 3D world map, built with TypeScript, Three.js, and Tailwind CSS. It includes features like interactive 3D globe, latency connections, historical trends, cloud provider regions, and responsive design.

## Features
- **3D World Map**: Interactive globe with rotation, zoom, and pan using Three.js.
- **Exchange Servers**: Markers for major exchanges (Binance, OKX, Deribit) with provider-based coloring (AWS: red, GCP: green, Azure: blue).
- **Real-time Latency**: Animated connections with color-coded latency (green: <50ms, yellow: 50-100ms, red: >100ms).
- **Historical Trends**: Time-series chart for latency trends with selectable time ranges.
- **Cloud Regions**: Visualized as ellipses with provider information.
- **Interactive Controls**: Filter by exchange/provider, time range selector, and theme toggle.
- **Responsive Design**: Optimized for desktop and mobile with touch controls.
- **Bonus Features**: Dark/light theme toggle, mock heatmap (placeholder).

## Assumptions
- Latency data is mocked due to lack of free, real-time latency APIs. In production, use Cloudflare Radar or similar.
- Earth texture (`earth-texture.jpg`) must be added to the `public` folder.
- Historical data is mocked; a real implementation would use a database or API.

## Setup Instructions
1. **Clone the Repository**:
   ```bash
   git clone git@github.com:samarvishwakarma/latency-topology-visualizer.git
   cd latency-topology-visualizer
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Add Earth Texture**:
   - Download a high-resolution Earth texture (e.g., from NASA's Visible Earth) and place it in `public/earth-texture.jpg`.

4. **Run the Project**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

## Dependencies
- Next.js: ^13.0.0
- TypeScript: ^4.9.0
- Three.js: ^0.178.0
- react-chartjs-2: ^5.0.0
- chart.js: ^4.0.0
- swr: ^2.0.0
- Tailwind CSS: ^3.0.0

## Project Structure
- `pages/index.tsx`: Entry point rendering `LatencyTopologyVisualizer`.
- `components/LatencyTopologyVisualizer.tsx`: Main component for 3D visualization.
- `components/ControlPanel.tsx`: UI for filters and controls.
- `components/LatencyChart.tsx`: Time-series chart for latency trends.
- `components/MapContext.tsx`: Context for managing map data.
- `api.ts`: Type definitions and mock API for latency data.
- `styles.css`: Tailwind CSS and custom styles.

## Video Demonstration
A video walkthrough is included in the submission, explaining the code structure, functionality, and how to run the project.

## Notes
- Replace mock `fetchLatencyData` with a real API (e.g., Cloudflare Radar) for production.
- Optimize Three.js performance by reducing geometry complexity for mobile devices.
- Add touch event listeners for mobile interactions (e.g., pinch-to-zoom).
