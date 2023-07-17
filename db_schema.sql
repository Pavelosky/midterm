
-- This makes sure that foreign_key constraints are observed and that errors will be thrown for violations
PRAGMA foreign_keys=ON;

BEGIN TRANSACTION;

--create your tables with SQL commands here (watch out for slight syntactical differences with SQLite)


CREATE TABLE IF NOT EXISTS Users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    is_author INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS Articles (
    article_id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    content TEXT NOT NULL,
    publication_date CURRENT_TIMESTAMP,
    user_id  INT, --the user that the record belongs to
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE IF NOT EXISTS Comments (
    comment_id INTEGER PRIMARY KEY AUTOINCREMENT,
    author_name VARCHAR(255),
    email VARCHAR(255),
    comment TEXT NOT NULL,
    comment_date CURRENT_TIMESTAMP,
    user_id  INT, --the user that the record belongs to
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

--insert default data (if necessary here)

INSERT INTO Users ('name','password') VALUES ('Admin','dupa1234');
INSERT INTO UserRecords ('record_value', 'user_id') VALUES('Lorem ipsum dolor sit amet', 1); --try changing the user_id to a different number and you will get an error

COMMIT;

