import { MapContainer } from './components/MapContext';
import LatencyTopologyVisualizer from './components/LatencyTopologyVisualizer';
import Head from 'next/head';

const Home: React.FC = () => {
  return (
    <>
      <Head>
        <title>Latency Topology Visualizer</title>
        <meta name="description" content="3D visualization of cryptocurrency exchange latency and cloud regions" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.0.4/dist/tailwind.min.css" rel="stylesheet"></link>
      </Head>
      <MapContainer>
        <LatencyTopologyVisualizer />
      </MapContainer>
    </>
  );
};

export default Home;