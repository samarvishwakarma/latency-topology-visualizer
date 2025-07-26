import React, { useContext, useState } from 'react';
import { MapContext } from './MapContext';
import { ExchangeServer, CloudRegion } from '../api';

interface ControlPanelProps {
  exchangeServers: ExchangeServer[];
  cloudRegions: CloudRegion[];
  setSelectedPair: (pair: { from: string; fromProvider: string; to: string; toProvider: string }) => void;
  toggleTheme: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ exchangeServers, setSelectedPair, toggleTheme }) => {
  const { timeRange, setTimeRange } = useContext(MapContext);
  const [selectedExchange, setSelectedExchange] = useState<string>('');
  const [selectedProvider, setSelectedProvider] = useState<string>('all');

  return (
    <div className="control-panel">
      <strong>Control Panel</strong>
      <div className='mt-2'>
        <label>Exchange:  </label>
        <select className='select rounded-xl px-2' onChange={e => setSelectedExchange(e.target.value)}>
          <option className='option' value="">All Exchanges</option>
          {exchangeServers.map(server => (
            <option className='option' key={server.id} value={server.id}>{server.name}</option>
          ))}
        </select>
      </div>
      <div className='mt-2'>
        <label>Cloud Provider:  </label>
        <select className='select rounded-xl px-2' onChange={e => setSelectedProvider(e.target.value)}>
          <option className='option' value="all">All Providers</option>
          <option className='option' value="AWS">AWS</option>
          <option className='option' value="GCP">GCP</option>
          <option className='option' value="Azure">Azure</option>
        </select>
      </div>
      <div className='mt-2'>
        <label>Time Range:  </label>
        <select
          className='select rounded-xl px-2'
          value={timeRange}
          onChange={e => setTimeRange(e.target.value as '1h' | '24h' | '7d' | '30d')}
        >
          <option className='option' value="1h">1 Hour</option>
          <option className='option' value="24h">24 Hours</option>
          <option className='option' value="7d">7 Days</option>
          <option className='option' value="30d">30 Days</option>
        </select>
      </div>
      <div className="mt-4">
        <p><strong>Legend:</strong></p>
        <p><span className="inline-block w-4 h-4 bg-red-500 mr-2"></span>AWS</p>
        <p><span className="inline-block w-4 h-4 bg-green-500 mr-2"></span>GCP</p>
        <p><span className="inline-block w-4 h-4 bg-blue-500 mr-2"></span>Azure</p>
      </div>
      <div className='flex flex-col'>
        <button onClick={toggleTheme} className="mt-2 border-2 rounded-2xl">Toggle Theme</button>
        <button
            onClick={() => selectedExchange && setSelectedPair({ from: selectedExchange, fromProvider: selectedProvider === 'all' ? 'AWS' : selectedProvider, to: selectedExchange, toProvider: selectedProvider === 'all' ? 'AWS' : selectedProvider })}
            className="mt-2 border-2 rounded-2xl"
        >
            View Latency
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;