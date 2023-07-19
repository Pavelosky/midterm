
-- This makes sure that foreign_key constraints are observed and that errors will be thrown for violations
PRAGMA foreign_keys=ON;

BEGIN TRANSACTION;

--create your tables with SQL commands here (watch out for slight syntactical differences with SQLite)


CREATE TABLE IF NOT EXISTS Users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    is_author TEXT DEFAULT 'No'
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
    FOREIGN KEY (article_id) REFERENCES Articles(article_id)
);

--insert default data (if necessary here)

INSERT INTO Users ('username','email','password', 'is_author') VALUES ('Admin','admin@blog.com','password123','Yes');
INSERT INTO Articles ('title','subtitle','content','publication_date', 'user_id') VALUES('This is a title of an article', 'Some more info about the article', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', DATE('now'), 1); --try changing the user_id to a different number and you will get an error

COMMIT;



