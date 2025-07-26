export interface ExchangeServer {
  id: string;
  name: string;
  lat: number;
  lng: number;
  providers: { provider: 'AWS' | 'GCP' | 'Azure'; region: string }[];
}

export interface CloudRegion {
  id: string;
  name: string;
  lat: number;
  lng: number;
  provider: 'AWS' | 'GCP' | 'Azure';
  serverCount: number;
}

export interface LatencyData {
  from: string;
  fromProvider: 'AWS' | 'GCP' | 'Azure';
  to: string;
  toProvider: 'AWS' | 'GCP' | 'Azure';
  latency: number;
  timestamp: number;
}

export const fetchLatencyData = async (): Promise<LatencyData[]> => {
  // Mock API call with provider-specific latency
  return [
    { from: 'binance-us', fromProvider: 'AWS', to: 'okx-asia', toProvider: 'GCP', latency: 45, timestamp: Date.now() },
    { from: 'okx-asia', fromProvider: 'GCP', to: 'deribit-eu', toProvider: 'Azure', latency: 80, timestamp: Date.now() },
    { from: 'deribit-eu', fromProvider: 'Azure', to: 'binance-us', toProvider: 'AWS', latency: 120, timestamp: Date.now() },
    { from: 'binance-us', fromProvider: 'Azure', to: 'okx-asia', toProvider: 'AWS', latency: 50, timestamp: Date.now() },
    { from: 'okx-asia', fromProvider: 'Azure', to: 'deribit-eu', toProvider: 'GCP', latency: 90, timestamp: Date.now() },
  ];
};