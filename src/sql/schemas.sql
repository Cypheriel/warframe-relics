CREATE TABLE IF NOT EXISTS users
(
    uuid          STRING PRIMARY KEY,
    email         STRING NOT NULL UNIQUE,
    password_hash STRING NOT NULL,
    username      STRING UNIQUE,
    creation_date STRING NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users (username);


CREATE TABLE IF NOT EXISTS sessions
(
    id         STRING PRIMARY KEY,
    user_uuid  STRING NOT NULL,
    expires_on STRING NOT NULL DEFAULT (datetime('now+0000-00-30')),
    FOREIGN KEY (user_uuid) REFERENCES users (uuid)
);