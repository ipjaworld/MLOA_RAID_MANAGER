-- DB 스키마 설계 (PostgreSQL 기반)

-- 유저 테이블
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  nickname VARCHAR(50) NOT NULL,
  password VARCHAR(255),
  login_type VARCHAR(20) DEFAULT 'default',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 캐릭터 테이블
CREATE TABLE characters (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(50) NOT NULL,
  job VARCHAR(50),
  item_level NUMERIC(5, 2),
  is_representative BOOLEAN DEFAULT FALSE
);

-- 공격대 테이블
CREATE TABLE raid_groups (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  leader_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 공격대 가입 테이블 (다대다 관계)
CREATE TABLE raid_memberships (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  raid_group_id INTEGER REFERENCES raid_groups(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'member', -- 공대원, 관리자, 공대장 등
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, raid_group_id)
);

-- 개인 일정 테이블
CREATE TABLE schedules (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(100),
  memo TEXT,
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 공대 일정 테이블
CREATE TABLE raid_schedules (
  id SERIAL PRIMARY KEY,
  raid_group_id INTEGER REFERENCES raid_groups(id) ON DELETE CASCADE,
  title VARCHAR(100),
  memo TEXT,
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 채팅 로그 테이블
CREATE TABLE ai_chat_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  message TEXT,
  response TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
