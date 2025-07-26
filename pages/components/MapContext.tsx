import React, { createContext, useState } from 'react';
import { ExchangeServer, CloudRegion } from '../api';

interface MapContextType {
  mapData: { servers: ExchangeServer[]; regions: CloudRegion[] };
  setMapData: (data: { servers: ExchangeServer[]; regions: CloudRegion[] }) => void;
  timeRange: '1h' | '24h' | '7d' | '30d';
  setTimeRange: (timeRange: '1h' | '24h' | '7d' | '30d') => void;
}

export const MapContext = createContext<MapContextType>({
  mapData: { servers: [], regions: [] },
  setMapData: () => {},
  timeRange: '1h',
  setTimeRange: () => {},
});

export const MapContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mapData, setMapData] = useState<{ servers: ExchangeServer[]; regions: CloudRegion[] }>({
    servers: [],
    regions: [],
  });
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('1h');

  return (
    <MapContext.Provider value={{ mapData, setMapData, timeRange, setTimeRange }}>
      {children}
    </MapContext.Provider>
  );
};