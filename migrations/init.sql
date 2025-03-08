-- Enable the uuid-ossp extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    crypto_id UUID DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email_iv TEXT NOT NULL,
    email_encrypted TEXT NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS data (
    id SERIAL PRIMARY KEY,
    owner_id INTEGER REFERENCES users(id),
    content TEXT NOT NULL,
    signature TEXT NOT NULL,
    data_signature TEXT NOT NULL,
    signed TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add a new UUID column (if it doesn't exist)
ALTER TABLE users ADD COLUMN crypto_id UUID DEFAULT uuid_generate_v4();
ALTER TABLE data ADD COLUMN data_signature TEXT;
ALTER TABLE data ADD COLUMN signed TEXT;


-- Populate UUIDs for existing rows
UPDATE users
SET crypto_id = uuid_generate_v4()
WHERE crypto_id IS NULL;