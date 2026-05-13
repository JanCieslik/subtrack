import { useState } from 'react';
import { CURRENCIES } from '../api/client';

const empty = { name: '', cost: '', currency: 'PLN', dueDay: '', active: true };

function validate(form) {
  const errs = {};
  if (!form.name.trim() || form.name.trim().length < 2) errs.name = 'Nazwa musi mieć co najmniej 2 znaki';
  if (!form.cost || parseFloat(form.cost) <= 0)         errs.cost = 'Koszt musi być większy od 0';
  if (form.dueDay !== '' && (parseInt(form.dueDay) < 1 || parseInt(form.dueDay) > 31)) {
    errs.dueDay = 'Dzień płatności musi być między 1 a 31';
  }
  return errs;
}

export default function SubscriptionForm({ initial = {}, onSubmit, onCancel, submitLabel = 'Save' }) {
  const [form, setForm] = useState({ ...empty, ...initial, cost: initial.cost ?? '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const set = (field) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [field]: val }));
    if (errors[field]) setErrors((er) => { const n = { ...er }; delete n[field]; return n; });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      await onSubmit({
        name:     form.name.trim(),
        cost:     parseFloat(form.cost),
        currency: form.currency,
        dueDay:   form.dueDay !== '' ? parseInt(form.dueDay) : null,
        active:   form.active,
      });
    } catch (err) {
      setApiError(err.response?.data?.error || 'Coś poszło nie tak. Spróbuj ponownie.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {apiError && <div className="alert alert-error">{apiError}</div>}

      <div className="form-group">
        <label className="form-label" htmlFor="sub-name">Nazwa</label>
        <input
          id="sub-name"
          type="text"
          className={`form-input${errors.name ? ' field-error' : ''}`}
          placeholder="np. Netflix, Spotify"
          value={form.name}
          onChange={set('name')}
        />
        {errors.name && <span className="field-error-msg">{errors.name}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label" htmlFor="sub-cost">Miesięczny koszt</label>
          <input
            id="sub-cost"
            type="number"
            min="0"
            step="0.01"
            className={`form-input${errors.cost ? ' field-error' : ''}`}
            placeholder="0.00"
            value={form.cost}
            onChange={set('cost')}
          />
          {errors.cost && <span className="field-error-msg">{errors.cost}</span>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="sub-currency">Waluta</label>
          <select id="sub-currency" className="form-select" value={form.currency} onChange={set('currency')}>
            {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="sub-due">
          Dzień płatności <span className="optional">(opcjonalnie, 1–31)</span>
        </label>
        <input
          id="sub-due"
          type="number"
          min="1"
          max="31"
          className={`form-input${errors.dueDay ? ' field-error' : ''}`}
          placeholder="np. 15"
          value={form.dueDay}
          onChange={set('dueDay')}
        />
        {errors.dueDay && <span className="field-error-msg">{errors.dueDay}</span>}
      </div>

      <div className="form-group">
        <label className="form-check">
          <input type="checkbox" checked={form.active} onChange={set('active')} />
          <span className="form-check-label">Aktywna subskrypcja</span>
        </label>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Zapisuję…' : submitLabel}
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={loading}>
          Anuluj
        </button>
      </div>
    </form>
  );
}
