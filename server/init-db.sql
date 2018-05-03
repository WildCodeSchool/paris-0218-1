DROP DATABASE IF EXISTS test;
CREATE DATABASE test;
USE test;

CREATE TABLE users (
  userId INT NOT NULL AUTO_INCREMENT,
  userName VARCHAR(64),
  firstName VARCHAR(64),
  lastName VARCHAR(64),
  avatar MEDIUMBLOB,
  wildSide VARCHAR(64),
  campus VARCHAR(64),
  createdAT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  email VARCHAR(254),
  password VARCHAR(254),
  bestScore INT,
  PRIMARY KEY (userId)
) ENGINE=INNODB;

CREATE TABLE scores (
  scoreId INT NOT NULL AUTO_INCREMENT,
  userId INT NOT NULL,
  score INT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (scoreId),
  FOREIGN KEY (userId)
  REFERENCES users(userId)
) ENGINE=INNODB;

INSERT INTO users (userName, email, password, bestScore) VALUES ('demo1', 'demo@demo.fr', 'demo1', 450);
INSERT INTO users (userName, email, password, bestScore) VALUES ('demo2', 'demo@demo.fr', 'demo2', 150);
INSERT INTO users (userName, email, password) VALUES ('demo3', 'demo@demo.fr', 'demo3');
INSERT INTO users (userName, email, password, bestScore) VALUES ('demo4', 'demo@demo.fr', 'demo4', 800);
INSERT INTO users (userName, email, password) VALUES ('demo5', 'demo@demo.fr', 'demo5');
INSERT INTO users (userName, email, password) VALUES ('demo6', 'demo@demo.fr', 'demo6');

INSERT INTO scores(userId, score) VALUES (1, 150);
INSERT INTO scores(userId, score) VALUES (1, 450);
INSERT INTO scores(userId, score) VALUES (1, 275);
INSERT INTO scores(userId, score) VALUES (2, 150);
INSERT INTO scores(userId, score) VALUES (4, 150);
INSERT INTO scores(userId, score) VALUES (4, 800);


