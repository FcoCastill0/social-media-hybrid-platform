-- mysql_setup.sql
-- Creates and initializes the relational database with social media schema

DROP DATABASE IF EXISTS social_hybrid;
CREATE DATABASE social_hybrid;
USE social_hybrid;

-- Users table with privacy settings
CREATE TABLE User (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  privacy ENUM('public','private') NOT NULL DEFAULT 'public'
);

-- Follower-following relationships
CREATE TABLE Follow (
  follower_id BIGINT NOT NULL,
  followee_id BIGINT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (follower_id, followee_id),
  FOREIGN KEY (follower_id) REFERENCES User(id) ON DELETE CASCADE,
  FOREIGN KEY (followee_id) REFERENCES User(id) ON DELETE CASCADE
);

-- Posts with full-text search capability
CREATE TABLE Post (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FULLTEXT (content),
  FOREIGN KEY (user_id) REFERENCES User(id) ON DELETE CASCADE
);

-- Likes system
CREATE TABLE PostLike (
  user_id BIGINT NOT NULL,
  post_id BIGINT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, post_id),
  FOREIGN KEY (user_id) REFERENCES User(id) ON DELETE CASCADE,
  FOREIGN KEY (post_id) REFERENCES Post(id) ON DELETE CASCADE
);

-- User metrics and statistics
CREATE TABLE UserMetrics (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  metric_type VARCHAR(30) NOT NULL,
  metric_value INT NOT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES User(id) ON DELETE CASCADE,
  INDEX idx_user_metric (user_id, metric_type)
);

-- Sample data for testing
INSERT INTO User (name, email, privacy) VALUES
  ('Ana Perez','ana@example.com','public'),
  ('Luis Gomez','luis@example.com','private');

INSERT INTO Follow (follower_id, followee_id) VALUES (1,2), (2,1);

INSERT INTO Post (user_id, content) VALUES
  (1,'Hello world! This is my first post.'),
  (2,'Welcome to my social media profile.');

INSERT INTO PostLike (user_id, post_id) VALUES (2,1);

INSERT INTO UserMetrics (user_id, metric_type, metric_value) VALUES
  (1,'followers',1),
  (1,'following',1),
  (2,'followers',1),
  (2,'following',1);
