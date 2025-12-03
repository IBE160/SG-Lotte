import { useEffect, useState } from 'react';
import { getBackendHealth } from '../lib/api';
import { HealthCheckResponse } from '../lib/types';

export default function HealthCheck() {
  const [health, setHealth] = useState<HealthCheckResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getBackendHealth()
      .then(data => setHealth(data))
      .catch(err => setError('Failed to fetch backend health. Is the backend running?'));
  }, []);

  return (
    <div>
      <h2>Backend Health Check</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {health && <pre>{JSON.stringify(health, null, 2)}</pre>}
    </div>
  );
}
