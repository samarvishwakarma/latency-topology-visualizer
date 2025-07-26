import React, { useEffect, useRef, useState, useContext } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import useSWR from 'swr';
import { MapContainer, MapContext } from './MapContext';
import LatencyChart from './LatencyChart';
import ControlPanel from './ControlPanel';
import { fetchLatencyData, ExchangeServer, CloudRegion } from '../api';

// Mock data for exchange servers with multiple providers
const exchangeServers: ExchangeServer[] = [
  {
    id: 'binance-us',
    name: 'Binance US',
    lat: 40.7128,
    lng: -74.0060,
    providers: [
      { provider: 'AWS', region: 'us-east-1' },
      { provider: 'GCP', region: 'us-central1' },
      { provider: 'Azure', region: 'eastus' },
    ],
  },
  {
    id: 'okx-asia',
    name: 'OKX Asia',
    lat: 35.6762,
    lng: 139.6503,
    providers: [
      { provider: 'AWS', region: 'ap-northeast-1' },
      { provider: 'GCP', region: 'asia-northeast1' },
      { provider: 'Azure', region: 'japaneast' },
    ],
  },
  {
    id: 'deribit-eu',
    name: 'Deribit EU',
    lat: 52.3702,
    lng: 4.8952,
    providers: [
      { provider: 'AWS', region: 'eu-west-1' },
      { provider: 'GCP', region: 'europe-west4' },
      { provider: 'Azure', region: 'westeurope' },
    ],
  },
];

const cloudRegions: CloudRegion[] = [
  { id: 'aws-us-east-1', name: 'AWS US East', lat: 38.8951, lng: -77.0364, provider: 'AWS', serverCount: 10 },
  { id: 'gcp-us-central1', name: 'GCP US Central', lat: 41.8781, lng: -93.0977, provider: 'GCP', serverCount: 8 },
  { id: 'azure-eastus', name: 'Azure East US', lat: 37.7749, lng: -77.0364, provider: 'Azure', serverCount: 12 },
  { id: 'aws-ap-northeast-1', name: 'AWS Asia Northeast', lat: 35.6762, lng: 139.6503, provider: 'AWS', serverCount: 6 },
  { id: 'gcp-asia-northeast1', name: 'GCP Asia Northeast', lat: 35.6762, lng: 139.6503, provider: 'GCP', serverCount: 8 },
  { id: 'azure-japaneast', name: 'Azure Japan East', lat: 35.6762, lng: 139.6503, provider: 'Azure', serverCount: 7 },
  { id: 'aws-eu-west-1', name: 'AWS EU West', lat: 53.3498, lng: -6.2603, provider: 'AWS', serverCount: 9 },
  { id: 'gcp-europe-west4', name: 'GCP Europe West', lat: 52.3702, lng: 4.8952, provider: 'GCP', serverCount: 10 },
  { id: 'azure-westeurope', name: 'Azure West Europe', lat: 52.3702, lng: 4.8952, provider: 'Azure', serverCount: 12 },
];

const LatencyTopologyVisualizer: React.FC = () => {
  const { setMapData } = useContext(MapContext);
  const sceneRef = useRef<THREE.Scene>(new THREE.Scene());
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedPair, setSelectedPair] = useState<{ from: string; fromProvider: string; to: string; toProvider: string } | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    server: ExchangeServer | null;
    x: number;
    y: number;
  }>({ visible: false, server: null, x: 0, y: 0 });

  // Fetch latency data using SWR
  const { data: latencyData, error } = useSWR('latency-data', fetchLatencyData, {
    refreshInterval: 5000,
  });

  useEffect(() => {
    // Initialize Three.js scene
    const scene = sceneRef.current;
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    cameraRef.current = camera;
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    rendererRef.current = renderer;
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current?.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Create globe
    const geometry = new THREE.SphereGeometry(2, 64, 64);
    const texture = new THREE.TextureLoader().load('/earth-texture.jpg');
    const material = new THREE.MeshPhongMaterial({ map: texture });
    const globe = new THREE.Mesh(geometry, material);
    scene.add(globe);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);

    // Add exchange server markers with provider offsets
    exchangeServers.forEach(server => {
      server.providers.forEach((provider, index) => {
        const markerGeometry = new THREE.SphereGeometry(0.05, 16, 16);
        const color = provider.provider === 'AWS' ? 0xff0000 : provider.provider === 'GCP' ? 0x00ff00 : 0x0000ff;
        const markerMaterial = new THREE.MeshBasicMaterial({ color });
        const marker = new THREE.Mesh(markerGeometry, markerMaterial);
        const offset = 0.07 * index;
        const { x, y, z } = latLongToVector3(server.lat, server.lng, 2.05 + offset);
        marker.position.set(x, y, z);
        marker.userData = { ...server, selectedProvider: provider.provider };
        scene.add(marker);
      });
    });

    // Add cloud region boundaries
    cloudRegions.forEach(region => {
      const curve = new THREE.EllipseCurve(0, 0, 2.1, 2.1, 0, 2 * Math.PI, false, 0);
      const points = curve.getPoints(50);
      const geometry = new THREE.BufferGeometry().setFromPoints(points.map(p => new THREE.Vector3(p.x, p.y, 0)));
      const material = new THREE.LineBasicMaterial({ color: 0x888888 });
      const ellipse = new THREE.Line(geometry, material);
      ellipse.userData = { isRegion: true };
      const { x, y, z } = latLongToVector3(region.lat, region.lng, 2.1);
      ellipse.position.set(x, y, z);
      scene.add(ellipse);
    });

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Handle hover events
    const raycaster = new THREE.Raycaster();
    raycaster.params.Points = { threshold: 0.1 };
    const mouse = new THREE.Vector2();
    const onMouseMove = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children.filter(child => child.userData && 'id' in child.userData));
      if (intersects.length > 0) {
        const server = intersects[0].object.userData as ExchangeServer & { selectedProvider: string };
        setTooltip({
          visible: true,
          server: { ...server, providers: server.providers },
          x: event.clientX + 10,
          y: event.clientY + 10,
        });
      } else {
        setTooltip({ visible: false, server: null, x: 0, y: 0 });
      }
    };
    window.addEventListener('mousemove', onMouseMove);

    // Handle click for selecting pair
    const onClick = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children.filter(child => child.userData && 'id' in child.userData));
      if (intersects.length > 0) {
        const server = intersects[0].object.userData as ExchangeServer & { selectedProvider: string };
        setSelectedPair({ from: server.id, fromProvider: server.selectedProvider, to: server.id, toProvider: server.selectedProvider });
      }
    };
    window.addEventListener('click', onClick);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('click', onClick);
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  // Update latency connections
  useEffect(() => {
    if (latencyData) {
      const scene = sceneRef.current;
      // Clear previous connections
      scene.children = scene.children.filter(child => !(child instanceof THREE.Line) || child.userData?.isRegion);

      // Add latency connections
      latencyData.forEach(data => {
        const fromServer = exchangeServers.find(s => s.id === data.from);
        const toServer = exchangeServers.find(s => s.id === data.to);
        if (fromServer && toServer) {
          const fromOffset = fromServer.providers.findIndex(p => p.provider === data.fromProvider) * 0.07;
          const toOffset = toServer.providers.findIndex(p => p.provider === data.toProvider) * 0.07;
          const points = [
            latLongToVector3(fromServer.lat, fromServer.lng, 2.05 + fromOffset),
            latLongToVector3(toServer.lat, toServer.lng, 2.05 + toOffset),
          ];
          const geometry = new THREE.BufferGeometry().setFromPoints(points);
          const color = data.latency < 50 ? 0x00ff00 : data.latency < 100 ? 0xffff00 : 0xff0000;
          const material = new THREE.LineBasicMaterial({ color });
          const line = new THREE.Line(geometry, material);
          scene.add(line);
        }
      });
    }
  }, [latencyData]);

  // Utility function to convert lat/lng to 3D coordinates
  const latLongToVector3 = (lat: number, lng: number, radius: number) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    return new THREE.Vector3(
      -radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta)
    );
  };

  return (
    <div className={`container ${theme}`}>
      <div ref={mountRef} className="map-container" />
      {tooltip.visible && tooltip.server && (
        <div
          className="absolute bg-white dark:bg-gray-800 text-black dark:text-white p-2 rounded shadow-lg text-sm"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          <p><strong>{tooltip.server.name}</strong></p>
          <p>Location: {tooltip.server.lat.toFixed(2)}, {tooltip.server.lng.toFixed(2)}</p>
          <p>Providers: {tooltip.server.providers.map(p => `${p.provider} (${p.region})`).join(', ')}</p>
        </div>
      )}
      <ControlPanel
        exchangeServers={exchangeServers}
        cloudRegions={cloudRegions}
        setSelectedPair={setSelectedPair}
        toggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      />
      {selectedPair && <LatencyChart pair={selectedPair} />}
    </div>
  );
};

export default LatencyTopologyVisualizer;