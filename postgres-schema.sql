-- Wander-Mate PostgreSQL Database Schema
-- Converted from MySQL for Supabase
-- Run this in Supabase SQL Editor

-- Create custom types for ENUMs
CREATE TYPE travel_style_enum AS ENUM ('adventure', 'relaxation', 'cultural', 'budget', 'luxury', 'solo', 'group');
CREATE TYPE verification_status_enum AS ENUM ('unverified', 'email_verified', 'id_verified', 'fully_verified');
CREATE TYPE proficiency_enum AS ENUM ('basic', 'intermediate', 'fluent', 'native');
CREATE TYPE cost_enum AS ENUM ('budget', 'moderate', 'expensive', 'luxury');
CREATE TYPE trip_status_enum AS ENUM ('planning', 'open', 'full', 'in_progress', 'completed', 'cancelled');
CREATE TYPE companion_status_enum AS ENUM ('pending', 'active', 'left', 'removed');
CREATE TYPE itinerary_type_enum AS ENUM ('accommodation', 'activity', 'transport', 'meal', 'other');
CREATE TYPE match_status_enum AS ENUM ('pending', 'accepted', 'declined', 'connected');
CREATE TYPE conversation_type_enum AS ENUM ('direct', 'group', 'trip');
CREATE TYPE message_type_enum AS ENUM ('text', 'image', 'location', 'trip_invite');
CREATE TYPE message_status_enum AS ENUM ('sending', 'sent', 'delivered', 'read');
CREATE TYPE attachment_type_enum AS ENUM ('image', 'video', 'document', 'audio');
CREATE TYPE payment_status_enum AS ENUM ('pending', 'processing', 'completed', 'failed', 'refunded');
CREATE TYPE payment_type_enum AS ENUM ('trip_booking', 'activity', 'split_expense', 'community_event');
CREATE TYPE payment_method_enum AS ENUM ('card', 'nfc', 'wallet');
CREATE TYPE refund_status_enum AS ENUM ('pending', 'processing', 'completed', 'failed');

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    location VARCHAR(255),
    travel_style travel_style_enum,
    verification_status verification_status_enum DEFAULT 'unverified',
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    trips_completed INT DEFAULT 0,
    rating DECIMAL(3, 2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_verification_status ON users(verification_status);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Interests table
CREATE TABLE interests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(50)
);

-- User interests (many-to-many)
CREATE TABLE user_interests (
    user_id UUID,
    interest_id UUID,
    PRIMARY KEY (user_id, interest_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (interest_id) REFERENCES interests(id) ON DELETE CASCADE
);

-- Languages table
CREATE TABLE languages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL
);

-- User languages (many-to-many)
CREATE TABLE user_languages (
    user_id UUID,
    language_id UUID,
    proficiency proficiency_enum,
    PRIMARY KEY (user_id, language_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (language_id) REFERENCES languages(id) ON DELETE CASCADE
);

-- Emergency contacts
CREATE TABLE emergency_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    relationship VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Destinations table
CREATE TABLE destinations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    country VARCHAR(100) NOT NULL,
    image_url TEXT,
    description TEXT,
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL,
    rating DECIMAL(3, 2) DEFAULT 0.00,
    best_time_to_visit VARCHAR(255),
    average_cost cost_enum,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (name, country)
);

CREATE INDEX idx_destinations_country ON destinations(country);
CREATE INDEX idx_destinations_location ON destinations(latitude, longitude);

CREATE TRIGGER update_destinations_updated_at BEFORE UPDATE ON destinations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Activities table
CREATE TABLE activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) UNIQUE NOT NULL,
    category VARCHAR(100)
);

-- Destination activities (many-to-many)
CREATE TABLE destination_activities (
    destination_id UUID,
    activity_id UUID,
    popularity_score INT DEFAULT 0,
    PRIMARY KEY (destination_id, activity_id),
    FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE CASCADE,
    FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE
);

-- Destination tags
CREATE TABLE destination_tags (
    destination_id UUID,
    tag VARCHAR(100) NOT NULL,
    PRIMARY KEY (destination_id, tag),
    FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE CASCADE
);

-- Trips table
CREATE TABLE trips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    destination_id UUID,
    organizer_id UUID,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    budget_min DECIMAL(10, 2),
    budget_max DECIMAL(10, 2),
    currency VARCHAR(3) DEFAULT 'USD',
    max_companions INT NOT NULL,
    description TEXT,
    status trip_status_enum DEFAULT 'planning',
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE RESTRICT,
    FOREIGN KEY (organizer_id) REFERENCES users(id) ON DELETE CASCADE,
    CHECK (end_date >= start_date),
    CHECK (budget_max >= budget_min)
);

CREATE INDEX idx_trips_status ON trips(status);
CREATE INDEX idx_trips_destination ON trips(destination_id);
CREATE INDEX idx_trips_organizer ON trips(organizer_id);
CREATE INDEX idx_trips_dates ON trips(start_date, end_date);

CREATE TRIGGER update_trips_updated_at BEFORE UPDATE ON trips
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trip activities
CREATE TABLE trip_activities (
    trip_id UUID,
    activity_id UUID,
    PRIMARY KEY (trip_id, activity_id),
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
    FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE
);

-- Trip companions (many-to-many)
CREATE TABLE trip_companions (
    trip_id UUID,
    user_id UUID,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status companion_status_enum DEFAULT 'active',
    PRIMARY KEY (trip_id, user_id),
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Itinerary items
CREATE TABLE itinerary_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id UUID,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    location VARCHAR(255),
    latitude DECIMAL(10, 7),
    longitude DECIMAL(10, 7),
    type itinerary_type_enum,
    cost DECIMAL(10, 2),
    booking_reference VARCHAR(255),
    notes TEXT,
    display_order INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
);

CREATE TRIGGER update_itinerary_items_updated_at BEFORE UPDATE ON itinerary_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Matches table
CREATE TABLE matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_a_id UUID,
    user_b_id UUID,
    compatibility_score INT CHECK (compatibility_score >= 0 AND compatibility_score <= 100),
    status match_status_enum DEFAULT 'pending',
    matched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    responded_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_a_id, user_b_id),
    FOREIGN KEY (user_a_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (user_b_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_matches_users ON matches(user_a_id, user_b_id);
CREATE INDEX idx_matches_status ON matches(status);

-- Match shared interests
CREATE TABLE match_shared_interests (
    match_id UUID,
    interest_id UUID,
    PRIMARY KEY (match_id, interest_id),
    FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE,
    FOREIGN KEY (interest_id) REFERENCES interests(id) ON DELETE CASCADE
);

-- Match shared destinations
CREATE TABLE match_shared_destinations (
    match_id UUID,
    destination_id UUID,
    PRIMARY KEY (match_id, destination_id),
    FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE,
    FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE CASCADE
);

-- Match related trips
CREATE TABLE match_trips (
    match_id UUID,
    trip_id UUID,
    PRIMARY KEY (match_id, trip_id),
    FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE,
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
);

-- Conversations
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type conversation_type_enum,
    trip_id UUID NULL,
    name VARCHAR(255),
    avatar_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE SET NULL
);

CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Conversation participants
CREATE TABLE conversation_participants (
    conversation_id UUID,
    user_id UUID,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_read_at TIMESTAMP NULL,
    is_muted BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (conversation_id, user_id),
    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Messages
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID,
    sender_id UUID,
    content TEXT NOT NULL,
    type message_type_enum DEFAULT 'text',
    status message_status_enum DEFAULT 'sent',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_created ON messages(created_at DESC);

CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON messages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Message attachments
CREATE TABLE message_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID,
    type attachment_type_enum,
    url TEXT NOT NULL,
    thumbnail_url TEXT,
    file_name VARCHAR(255),
    file_size BIGINT,
    mime_type VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE
);

-- Payments
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    status payment_status_enum DEFAULT 'pending',
    type payment_type_enum,
    trip_id UUID NULL,
    payer_id UUID,
    receiver_id UUID NULL,
    description TEXT,
    method payment_method_enum,
    provider_payment_id VARCHAR(255),
    provider_name VARCHAR(50) DEFAULT 'stripe',
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE SET NULL,
    FOREIGN KEY (payer_id) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE RESTRICT
);

CREATE INDEX idx_payments_payer ON payments(payer_id);
CREATE INDEX idx_payments_status ON payments(status);

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Payment refunds
CREATE TABLE payment_refunds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_id UUID,
    amount DECIMAL(10, 2) NOT NULL,
    reason TEXT,
    status refund_status_enum DEFAULT 'pending',
    provider_refund_id VARCHAR(255),
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE RESTRICT
);

-- Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSONB,
    is_read BOOLEAN DEFAULT FALSE,
    action_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read, created_at DESC);

-- Reviews
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id UUID,
    reviewer_id UUID,
    reviewee_id UUID,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (trip_id, reviewer_id, reviewee_id),
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewee_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_reviews_trip ON reviews(trip_id);
CREATE INDEX idx_reviews_reviewee ON reviews(reviewee_id);

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
