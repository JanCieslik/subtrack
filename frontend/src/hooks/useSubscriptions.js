import { useState, useEffect, useCallback } from 'react';
import { subs as subsApi } from '../api/client';

export function useSubscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await subsApi.list();
      setSubscriptions(data.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load subscriptions');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const remove = async (id) => {
    await subsApi.remove(id);
    setSubscriptions((prev) => prev.filter((s) => s.id !== id));
  };

  return { subscriptions, loading, error, refresh, remove };
}
