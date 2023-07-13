
-- This makes sure that foreign_key constraints are observed and that errors will be thrown for violations
PRAGMA foreign_keys=ON;

BEGIN TRANSACTION;

--create your tables with SQL commands here (watch out for slight syntactical differences with SQLite)

CREATE TABLE IF NOT EXISTS testUsers (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS testUserRecords (
    record_id INTEGER PRIMARY KEY AUTOINCREMENT,
    record_value TEXT NOT NULL,
    user_id  INT, --the user that the record belongs to
    FOREIGN KEY (user_id) REFERENCES testUsers(user_id)
);

--insert default data (if necessary here)

INSERT INTO testUsers ('name') VALUES ('Simon Star');
INSERT INTO testUserRecords ('record_value', 'user_id') VALUES( 'Lorem ipsum dolor sit amet', 1); --try changing the user_id to a different number and you will get an error

COMMIT;

