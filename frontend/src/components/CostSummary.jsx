import { useState, useEffect } from 'react';
import { subs as subsApi } from '../api/client';
import LoadingSpinner from './LoadingSpinner';

export default function CostSummary({ refreshKey }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    subsApi
      .stats()
      .then(({ data }) => setStats(data.data))
      .catch((err) => setError(err.response?.data?.error || 'Nie udało się załadować statystyk'))
      .finally(() => setLoading(false));
  }, [refreshKey]);

  if (loading) return <LoadingSpinner />;
  if (error)   return <div className="alert alert-error">{error}</div>;
  if (!stats)  return null;

  const { totalPLN, activeCount, rates } = stats;

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-value">{totalPLN.toFixed(2)} zł</div>
        <div className="stat-label">Łączny koszt miesięczny (PLN)</div>
      </div>

      <div className="stat-card">
        <div className="stat-value">{activeCount}</div>
        <div className="stat-label">Aktywne subskrypcje</div>
      </div>

      <div className="stat-card">
        <div className="stat-value" style={{ fontSize: '18px', paddingTop: '6px' }}>
          Kursy walut
        </div>
        <div className="rates-info">
          <span>USD: {rates.USD?.toFixed(4)} zł</span>
          <span>EUR: {rates.EUR?.toFixed(4)} zł</span>
        </div>
      </div>
    </div>
  );
}
