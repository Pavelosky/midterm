
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

CREATE TABLE IF NOT EXISTS Drafts (
    draft_id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    content TEXT NOT NULL,
    publication_date CURRENT_TIMESTAMP,
    user_id  INT, --the user that the record belongs to
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE IF NOT EXISTS Comments (
    comment_id INTEGER PRIMARY KEY AUTOINCREMENT,
    article_id INTEGER NOT NULL,
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
INSERT INTO Articles ('title','subtitle','content','publication_date', 'user_id') VALUES('How to make a CRUD website', 'In this post you will find information on how to create a site where you can create, read, update and delete stuff', 'To develop a CRUD website, you will need to select a technology stack, such as Node.js for the backend and Express.js as the framework, along with a database system like MongoDB. Create RESTful API routes in the backend for handling Create, Read, Update, and Delete operations. Design and build frontend templates using HTML, CSS, and JavaScript, offering user interfaces for listing, adding, editing, and deleting data. Implement frontend JavaScript code to interact with the backend API, using fetch or Axios to send requests and update data on the server. Finally, establish the connection between the frontend and backend to enable users to seamlessly perform CRUD operations. Thoroughly test the functionality and ensure security measures are in place to protect against potential vulnerabilities.', DATE('now'), 1);
INSERT INTO Comments ('article_id','author_name','email','comment','comment_date','user_id') VALUES
                    (1, 'Pablito', 'pablito@pablo.com', 'This makes a lot of sense, best article ever', DATE('now'), 1)
INSERT INTO Drafts ('title','subtitle','content','publication_date', 'user_id') VALUES('This is a draft article', 'Test draft article', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, ', DATE('now'), 1);

COMMIT;



