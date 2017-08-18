DROP DATABASE IF EXISTS stackleDb;
CREATE DATABASE stackleDb;

\c stackleDb

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  password TEXT,
  username TEXT
);

CREATE TABLE questions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users (id),
  title TEXT,
  body TEXT
);

CREATE TABLE answers (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  question_id INTEGER REFERENCES questions(id),
  accepted BOOLEAN,
  body TEXT
);
