-- SubTrack database schema

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS subscriptions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  cost DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'PLN',
  due_day INTEGER,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS rates (
  id SERIAL PRIMARY KEY,
  currency VARCHAR(3) UNIQUE NOT NULL,
  rate DECIMAL(10, 4) NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Fallback rates (stale timestamp forces NBP fetch on first request)
INSERT INTO rates (currency, rate, updated_at) VALUES ('USD', 4.0000, '2000-01-01') ON CONFLICT (currency) DO NOTHING;
INSERT INTO rates (currency, rate, updated_at) VALUES ('EUR', 4.3000, '2000-01-01') ON CONFLICT (currency) DO NOTHING;
