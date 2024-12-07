-- Users

CREATE TABLE IF NOT EXISTS users
(
    uuid          TEXT PRIMARY KEY,
    email         TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    username      TEXT UNIQUE,
    creation_date TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users (username);


-- Sessions

CREATE TABLE IF NOT EXISTS sessions
(
    id         TEXT PRIMARY KEY,
    user_uuid  TEXT NOT NULL,
    expires_on TEXT NOT NULL DEFAULT (datetime('now+0000-00-30')),
    FOREIGN KEY (user_uuid) REFERENCES users (uuid)
);

CREATE INDEX IF NOT EXISTS idx_sessions_user_uuid ON sessions (user_uuid);


-- Public Export

CREATE TABLE IF NOT EXISTS public_export_index
(
    filename             TEXT UNIQUE NOT NULL,
    language             TEXT        NOT NULL DEFAULT ('en'),
    language_independent BOOLEAN     NOT NULL DEFAULT (false),
    patch_version        TEXT        NOT NULL DEFAULT ('00'),
    hash                 TEXT        NOT NULL,
    date_fetched         TEXT        NOT NULL DEFAULT (datetime('now'))
);


-- Relics

CREATE TABLE IF NOT EXISTS relics
(
    id           TEXT NOT NULL PRIMARY KEY,
    era          TEXT NOT NULL CHECK (era IN ('Lith', 'Meso', 'Neo', 'Axi', 'Requiem')),
    name         TEXT NOT NULL,
    release_date TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS relic_rewards
(
    item_id  TEXT NOT NULL,
    name_en  TEXT NOT NULL,
    rarity   TEXT NOT NULL CHECK (rarity IN ('Common', 'Uncommon', 'Rare')),
    relic_id TEXT NOT NULL,
    FOREIGN KEY (relic_id) REFERENCES relics (id)
);