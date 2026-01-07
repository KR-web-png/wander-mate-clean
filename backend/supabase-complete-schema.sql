-- Complete Supabase Schema for WanderMate
-- Run this in Supabase SQL Editor

-- Enable UUIDs
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- ENUMS
DO $$ BEGIN
  CREATE TYPE travel_style_enum AS ENUM ('adventure','relaxation','cultural','budget','luxury','solo','group');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE verification_status_enum AS ENUM ('unverified','email_verified','id_verified','fully_verified');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE proficiency_enum AS ENUM ('basic','intermediate','fluent','native');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE average_cost_enum AS ENUM ('budget','moderate','expensive','luxury');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE trip_status_enum AS ENUM ('planning','open','full','in_progress','completed','cancelled');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE companion_status_enum AS ENUM ('pending','active','left','removed');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE itinerary_type_enum AS ENUM ('accommodation','activity','transport','meal','other');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE conversation_type_enum AS ENUM ('direct','group','trip');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE message_type_enum AS ENUM ('text','image','location','trip_invite');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE message_status_enum AS ENUM ('sending','sent','delivered','read');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_status_enum AS ENUM ('pending','processing','completed','failed','refunded');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_method_enum AS ENUM ('card','nfc','wallet');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_type_enum AS ENUM ('trip_booking','activity','split_expense','community_event');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE match_status_enum AS ENUM ('pending','accepted','declined','connected');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- USERS (if not exists)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  location TEXT,
  travel_style travel_style_enum,
  verification_status verification_status_enum DEFAULT 'unverified',
  joined_at TIMESTAMP DEFAULT NOW(),
  trips_completed INT DEFAULT 0,
  rating NUMERIC(3,2) DEFAULT 0.00,
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
DROP TRIGGER IF EXISTS trg_users_updated_at ON users;
CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- INTERESTS
CREATE TABLE IF NOT EXISTS interests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  category TEXT
);

-- USER_INTERESTS (junction table)
CREATE TABLE IF NOT EXISTS user_interests (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  interest_id UUID REFERENCES interests(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, interest_id)
);

-- LANGUAGES
CREATE TABLE IF NOT EXISTS languages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL
);

-- USER_LANGUAGES (junction table)
CREATE TABLE IF NOT EXISTS user_languages (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  language_id UUID REFERENCES languages(id) ON DELETE CASCADE,
  proficiency proficiency_enum,
  PRIMARY KEY (user_id, language_id)
);

-- EMERGENCY_CONTACTS
CREATE TABLE IF NOT EXISTS emergency_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  relationship TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ACTIVITIES
CREATE TABLE IF NOT EXISTS activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  category TEXT
);

-- DESTINATIONS
CREATE TABLE IF NOT EXISTS destinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  image_url TEXT,
  description TEXT,
  latitude NUMERIC(10,7),
  longitude NUMERIC(10,7),
  rating NUMERIC(3,2) DEFAULT 0.00,
  best_time_to_visit TEXT,
  average_cost average_cost_enum,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE (name, country)
);
DROP TRIGGER IF EXISTS trg_destinations_updated_at ON destinations;
CREATE TRIGGER trg_destinations_updated_at BEFORE UPDATE ON destinations FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- DESTINATION_ACTIVITIES (junction table)
CREATE TABLE IF NOT EXISTS destination_activities (
  destination_id UUID REFERENCES destinations(id) ON DELETE CASCADE,
  activity_id UUID REFERENCES activities(id) ON DELETE CASCADE,
  popularity_score INT DEFAULT 0,
  PRIMARY KEY (destination_id, activity_id)
);

-- DESTINATION_TAGS
CREATE TABLE IF NOT EXISTS destination_tags (
  destination_id UUID REFERENCES destinations(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  PRIMARY KEY (destination_id, tag)
);

-- TRIPS
CREATE TABLE IF NOT EXISTS trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  destination_id UUID REFERENCES destinations(id) ON DELETE RESTRICT,
  organizer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  budget_min NUMERIC(10,2),
  budget_max NUMERIC(10,2),
  currency TEXT DEFAULT 'USD',
  max_companions INT NOT NULL,
  description TEXT,
  status trip_status_enum DEFAULT 'planning',
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  CHECK (end_date >= start_date),
  CHECK (budget_max >= budget_min)
);
DROP TRIGGER IF EXISTS trg_trips_updated_at ON trips;
CREATE TRIGGER trg_trips_updated_at BEFORE UPDATE ON trips FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- TRIP_ACTIVITIES (junction table)
CREATE TABLE IF NOT EXISTS trip_activities (
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  activity_id UUID REFERENCES activities(id) ON DELETE CASCADE,
  PRIMARY KEY (trip_id, activity_id)
);

-- TRIP_COMPANIONS (junction table)
CREATE TABLE IF NOT EXISTS trip_companions (
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP DEFAULT NOW(),
  status companion_status_enum DEFAULT 'active',
  PRIMARY KEY (trip_id, user_id)
);

-- ITINERARY_ITEMS
CREATE TABLE IF NOT EXISTS itinerary_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  location TEXT,
  latitude NUMERIC(10,7),
  longitude NUMERIC(10,7),
  type itinerary_type_enum,
  cost NUMERIC(10,2),
  booking_reference TEXT,
  notes TEXT,
  display_order INT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
DROP TRIGGER IF EXISTS trg_itinerary_items_updated_at ON itinerary_items;
CREATE TRIGGER trg_itinerary_items_updated_at BEFORE UPDATE ON itinerary_items FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- MATCHES
CREATE TABLE IF NOT EXISTS matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_a_id UUID REFERENCES users(id) ON DELETE CASCADE,
  user_b_id UUID REFERENCES users(id) ON DELETE CASCADE,
  compatibility_score INT CHECK (compatibility_score BETWEEN 0 AND 100),
  status match_status_enum DEFAULT 'pending',
  matched_at TIMESTAMP DEFAULT NOW(),
  responded_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE (user_a_id, user_b_id)
);

-- MATCH_SHARED_INTERESTS (junction table)
CREATE TABLE IF NOT EXISTS match_shared_interests (
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
  interest_id UUID REFERENCES interests(id) ON DELETE CASCADE,
  PRIMARY KEY (match_id, interest_id)
);

-- MATCH_SHARED_DESTINATIONS (junction table)
CREATE TABLE IF NOT EXISTS match_shared_destinations (
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
  destination_id UUID REFERENCES destinations(id) ON DELETE CASCADE,
  PRIMARY KEY (match_id, destination_id)
);

-- MATCH_TRIPS (junction table)
CREATE TABLE IF NOT EXISTS match_trips (
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  PRIMARY KEY (match_id, trip_id)
);

-- CONVERSATIONS
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type conversation_type_enum,
  trip_id UUID REFERENCES trips(id) ON DELETE SET NULL,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
DROP TRIGGER IF EXISTS trg_conversations_updated_at ON conversations;
CREATE TRIGGER trg_conversations_updated_at BEFORE UPDATE ON conversations FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- CONVERSATION_PARTICIPANTS (junction table)
CREATE TABLE IF NOT EXISTS conversation_participants (
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP DEFAULT NOW(),
  last_read_at TIMESTAMP,
  is_muted BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (conversation_id, user_id)
);

-- MESSAGES
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  type message_type_enum DEFAULT 'text',
  status message_status_enum DEFAULT 'sent',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
DROP TRIGGER IF EXISTS trg_messages_updated_at ON messages;
CREATE TRIGGER trg_messages_updated_at BEFORE UPDATE ON messages FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- MESSAGE_ATTACHMENTS
CREATE TABLE IF NOT EXISTS message_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
  type TEXT,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  file_name TEXT,
  file_size BIGINT,
  mime_type TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- PAYMENTS
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  amount NUMERIC(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  status payment_status_enum DEFAULT 'pending',
  type payment_type_enum,
  trip_id UUID REFERENCES trips(id) ON DELETE SET NULL,
  payer_id UUID REFERENCES users(id) ON DELETE RESTRICT,
  receiver_id UUID REFERENCES users(id) ON DELETE RESTRICT,
  description TEXT,
  method payment_method_enum,
  provider_payment_id TEXT,
  provider_name TEXT DEFAULT 'stripe',
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
DROP TRIGGER IF EXISTS trg_payments_updated_at ON payments;
CREATE TRIGGER trg_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- PAYMENT_REFUNDS
CREATE TABLE IF NOT EXISTS payment_refunds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id UUID REFERENCES payments(id) ON DELETE RESTRICT,
  amount NUMERIC(10,2) NOT NULL,
  reason TEXT,
  status payment_status_enum DEFAULT 'pending',
  provider_refund_id TEXT,
  requested_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

-- NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  is_read BOOLEAN DEFAULT FALSE,
  action_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- REVIEWS
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  reviewee_id UUID REFERENCES users(id) ON DELETE CASCADE,
  rating INT CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE (trip_id, reviewer_id, reviewee_id)
);
DROP TRIGGER IF EXISTS trg_reviews_updated_at ON reviews;
CREATE TRIGGER trg_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Schema created successfully!';
END $$;
