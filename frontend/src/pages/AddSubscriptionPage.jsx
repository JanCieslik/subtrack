import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Header from '../components/Header';
import SubscriptionForm from '../components/SubscriptionForm';
import { subs } from '../api/client';

export default function AddSubscriptionPage() {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    await subs.create(formData);
    toast.success('Subscription added!');
    navigate('/dashboard');
  };

  return (
    <div className="page">
      <Header />
      <div className="container">
        <div className="page-header">
          <h2 className="page-title">Dodaj subskrypcję</h2>
        </div>
        <div className="card form-page-card">
          <div className="card-body">
            <SubscriptionForm
              submitLabel="Dodaj subskrypcję"
              onSubmit={handleSubmit}
              onCancel={() => navigate('/dashboard')}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
