-- Install the uuid-ossp module
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Creation of users table
CREATE TABLE IF NOT EXISTS users (
    user_id uuid DEFAULT uuid_generate_v4 (),
    username TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT UNIQUE,
    created TIMESTAMPTZ DEFAULT NOW(),
    modified TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id)
);