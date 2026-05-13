import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import Header from '../components/Header';
import SubscriptionForm from '../components/SubscriptionForm';
import LoadingSpinner from '../components/LoadingSpinner';
import { subs } from '../api/client';

export default function EditSubscriptionPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [subscription, setSubscription] = useState(location.state?.subscription ?? null);
  const [loading, setLoading] = useState(!subscription);
  const [error, setError] = useState(null);

  // Fallback: fetch the subscription if it wasn't passed via router state (e.g. direct URL)
  useEffect(() => {
    if (subscription) return;
    subs.list()
      .then(({ data }) => {
        const found = data.data.find((s) => s.id === parseInt(id));
        if (found) setSubscription(found);
        else setError('Subskrypcja nie została znaleziona');
      })
      .catch(() => setError('Nie udało się załadować subskrypcji'))
      .finally(() => setLoading(false));
  }, [id, subscription]);

  const handleSubmit = async (formData) => {
    await subs.update(id, formData);
    toast.success('Subskrypcja zaktualizowana!');
    navigate('/dashboard');
  };

  if (loading) return <><Header /><LoadingSpinner /></>;
  if (error)   return <><Header /><div className="container"><div className="alert alert-error">{error}</div></div></>;

  // Map snake_case DB fields → form field names
  const initial = {
    name:     subscription.name,
    cost:     subscription.cost,
    currency: subscription.currency,
    dueDay:   subscription.due_day ?? '',
    active:   subscription.active,
  };

  return (
    <div className="page">
      <Header />
      <div className="container">
        <div className="page-header">
          <h2 className="page-title">Edytuj: {subscription.name}</h2>
        </div>
        <div className="card form-page-card">
          <div className="card-body">
            <SubscriptionForm
              initial={initial}
              submitLabel="Zapisz zmiany"
              onSubmit={handleSubmit}
              onCancel={() => navigate('/dashboard')}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
