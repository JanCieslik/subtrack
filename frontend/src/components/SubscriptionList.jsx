import { useNavigate } from 'react-router-dom';
import { formatCost } from '../api/client';

export default function SubscriptionList({ subscriptions, onDelete }) {
  const navigate = useNavigate();

  if (subscriptions.length === 0) {
    return (
      <div className="card">
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <p className="empty-title">Brak subskrypcji</p>
          <p className="empty-sub">Dodaj swoją pierwszą subskrypcję, aby śledzić koszty.</p>
          <button className="btn btn-primary" onClick={() => navigate('/add-subscription')}>
            + Dodaj subskrypcję
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Nazwa</th>
              <th>Koszt</th>
              <th>Waluta</th>
              <th>Dzień płatności</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Akcje</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((sub) => (
              <tr key={sub.id}>
                <td className="sub-name">{sub.name}</td>
                <td>{formatCost(sub.cost, sub.currency)}</td>
                <td>{sub.currency}</td>
                <td>{sub.due_day ?? '—'}</td>
                <td>
                  <span className={`badge badge-${sub.active ? 'active' : 'inactive'}`}>
                    {sub.active ? 'Aktywna' : 'Nieaktywna'}
                  </span>
                </td>
                <td>
                  <div className="table-actions">
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => navigate(`/edit/${sub.id}`, { state: { subscription: sub } })}
                    >
                      Edytuj
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => onDelete(sub.id, sub.name)}
                    >
                      Usuń
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
