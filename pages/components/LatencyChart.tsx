import React, { useContext } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { MapContext } from './MapContext';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface LatencyChartProps {
  pair: { from: string; fromProvider: string; to: string; toProvider: string };
}

const LatencyChart: React.FC<LatencyChartProps> = ({ pair }) => {
  const { timeRange } = useContext(MapContext);

  // Generate labels and data based on timeRange
  const generateChartData = () => {
    let labels: string[] = [];
    let data: number[] = [];

    switch (timeRange) {
      case '1h':
        labels = Array.from({ length: 12 }, (_, i) => `${5 * (i + 1)}m`);
        data = Array.from({ length: 12 }, () => Math.random() * 50 + 20); // Mock data: 20-70ms
        break;
      case '24h':
        labels = Array.from({ length: 24 }, (_, i) => `${i + 1}h`);
        data = Array.from({ length: 24 }, () => Math.random() * 60 + 30); // Mock data: 30-90ms
        break;
      case '7d':
        labels = Array.from({ length: 7 }, (_, i) => `Day ${i + 1}`);
        data = Array.from({ length: 7 }, () => Math.random() * 80 + 40); // Mock data: 40-120ms
        break;
      case '30d':
        labels = Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`);
        data = Array.from({ length: 30 }, () => Math.random() * 100 + 50); // Mock data: 50-150ms
        break;
    }

    return {
      labels,
      datasets: [
        {
          label: `Latency ${pair.from} (${pair.fromProvider}) to ${pair.to} (${pair.toProvider})`,
          data,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
        },
      ],
    };
  };

  return (
    <div className="latency-chart">
      <h2>Latency Trends ({timeRange})</h2>
      <Line data={generateChartData()} />
    </div>
  );
};

export default LatencyChart;