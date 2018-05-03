DROP DATABASE IF EXISTS wildeer;
CREATE DATABASE wildeer;
USE wildeer;

CREATE TABLE users (
  -- id INT NOT NULL AUTO_INCREMENT,
  -- name VARCHAR(64),
  -- email VARCHAR(254),
  -- password VARCHAR(254),
  -- createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  -- PRIMARY KEY (id)
) ENGINE=INNODB;

CREATE TABLE scores (
  -- id INT NOT NULL AUTO_INCREMENT,
  -- userId INT NOT NULL,
  -- title VARCHAR(128),
  -- description TEXT,
  -- image TEXT,
  -- createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  -- PRIMARY KEY (id),
  -- FOREIGN KEY (userId)
  --   REFERENCES user(id)
) ENGINE=INNODB;

-- INSERT INTO user (name, email, password) VALUES ('demo', 'demo@demo.fr', 'demo');
-- alter table users modify createdAt timestamp default current_timestamp;
-- alter table scores modify createdAt timestamp default current_timestamp;
