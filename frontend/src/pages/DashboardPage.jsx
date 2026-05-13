import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Header from '../components/Header';
import CostSummary from '../components/CostSummary';
import SubscriptionList from '../components/SubscriptionList';
import LoadingSpinner from '../components/LoadingSpinner';
import { useSubscriptions } from '../hooks/useSubscriptions';

export default function DashboardPage() {
  const { subscriptions, loading, error, remove } = useSubscriptions();
  // Incrementing this key forces CostSummary to re-fetch after mutations
  const [summaryKey, setSummaryKey] = useState(0);
  const navigate = useNavigate();

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Usunąć "${name}"? Tej operacji nie można cofnąć.`)) return;
    try {
      await remove(id);
      setSummaryKey((k) => k + 1);
      toast.success(`"${name}" zostało usunięte`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Nie udało się usunąć subskrypcji');
    }
  };

  return (
    <div className="page">
      <Header />
      <div className="container">
        <CostSummary refreshKey={summaryKey} />

        <div className="page-header">
          <h2 className="page-title">Moje subskrypcje</h2>
          <button className="btn btn-primary" onClick={() => navigate('/add-subscription')}>
            + Dodaj subskrypcję
          </button>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="alert alert-error">{error}</div>
        ) : (
          <SubscriptionList subscriptions={subscriptions} onDelete={handleDelete} />
        )}
      </div>
    </div>
  );
}
