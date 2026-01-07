-- Wander-Mate MySQL Database Schema
-- Run this in MySQL Workbench after creating the database

-- Create database
CREATE DATABASE IF NOT EXISTS wandermate CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE wandermate;

-- Users table
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    location VARCHAR(255),
    travel_style ENUM('adventure', 'relaxation', 'cultural', 'budget', 'luxury', 'solo', 'group'),
    verification_status ENUM('unverified', 'email_verified', 'id_verified', 'fully_verified') DEFAULT 'unverified',
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    trips_completed INT DEFAULT 0,
    rating DECIMAL(3, 2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_verification_status (verification_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Interests table
CREATE TABLE interests (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(50)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- User interests (many-to-many)
CREATE TABLE user_interests (
    user_id VARCHAR(36),
    interest_id VARCHAR(36),
    PRIMARY KEY (user_id, interest_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (interest_id) REFERENCES interests(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Languages table
CREATE TABLE languages (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- User languages (many-to-many)
CREATE TABLE user_languages (
    user_id VARCHAR(36),
    language_id VARCHAR(36),
    proficiency ENUM('basic', 'intermediate', 'fluent', 'native'),
    PRIMARY KEY (user_id, language_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (language_id) REFERENCES languages(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Emergency contacts
CREATE TABLE emergency_contacts (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) UNIQUE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    relationship VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Destinations table
CREATE TABLE destinations (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    country VARCHAR(100) NOT NULL,
    image_url TEXT,
    description TEXT,
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL,
    rating DECIMAL(3, 2) DEFAULT 0.00,
    best_time_to_visit VARCHAR(255),
    average_cost ENUM('budget', 'moderate', 'expensive', 'luxury'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_destination (name, country),
    INDEX idx_country (country),
    INDEX idx_location (latitude, longitude)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Activities table
CREATE TABLE activities (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) UNIQUE NOT NULL,
    category VARCHAR(100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Destination activities (many-to-many)
CREATE TABLE destination_activities (
    destination_id VARCHAR(36),
    activity_id VARCHAR(36),
    popularity_score INT DEFAULT 0,
    PRIMARY KEY (destination_id, activity_id),
    FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE CASCADE,
    FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Destination tags
CREATE TABLE destination_tags (
    destination_id VARCHAR(36),
    tag VARCHAR(100) NOT NULL,
    PRIMARY KEY (destination_id, tag),
    FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Trips table
CREATE TABLE trips (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    title VARCHAR(255) NOT NULL,
    destination_id VARCHAR(36),
    organizer_id VARCHAR(36),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    budget_min DECIMAL(10, 2),
    budget_max DECIMAL(10, 2),
    currency VARCHAR(3) DEFAULT 'USD',
    max_companions INT NOT NULL,
    description TEXT,
    status ENUM('planning', 'open', 'full', 'in_progress', 'completed', 'cancelled') DEFAULT 'planning',
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE RESTRICT,
    FOREIGN KEY (organizer_id) REFERENCES users(id) ON DELETE CASCADE,
    CHECK (end_date >= start_date),
    CHECK (budget_max >= budget_min),
    INDEX idx_status (status),
    INDEX idx_destination (destination_id),
    INDEX idx_organizer (organizer_id),
    INDEX idx_dates (start_date, end_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Trip activities
CREATE TABLE trip_activities (
    trip_id VARCHAR(36),
    activity_id VARCHAR(36),
    PRIMARY KEY (trip_id, activity_id),
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
    FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Trip companions (many-to-many)
CREATE TABLE trip_companions (
    trip_id VARCHAR(36),
    user_id VARCHAR(36),
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'active', 'left', 'removed') DEFAULT 'active',
    PRIMARY KEY (trip_id, user_id),
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Itinerary items
CREATE TABLE itinerary_items (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    trip_id VARCHAR(36),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    location VARCHAR(255),
    latitude DECIMAL(10, 7),
    longitude DECIMAL(10, 7),
    type ENUM('accommodation', 'activity', 'transport', 'meal', 'other'),
    cost DECIMAL(10, 2),
    booking_reference VARCHAR(255),
    notes TEXT,
    display_order INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Matches table
CREATE TABLE matches (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_a_id VARCHAR(36),
    user_b_id VARCHAR(36),
    compatibility_score INT CHECK (compatibility_score >= 0 AND compatibility_score <= 100),
    status ENUM('pending', 'accepted', 'declined', 'connected') DEFAULT 'pending',
    matched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    responded_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_match (user_a_id, user_b_id),
    FOREIGN KEY (user_a_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (user_b_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_users (user_a_id, user_b_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Match shared interests
CREATE TABLE match_shared_interests (
    match_id VARCHAR(36),
    interest_id VARCHAR(36),
    PRIMARY KEY (match_id, interest_id),
    FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE,
    FOREIGN KEY (interest_id) REFERENCES interests(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Match shared destinations
CREATE TABLE match_shared_destinations (
    match_id VARCHAR(36),
    destination_id VARCHAR(36),
    PRIMARY KEY (match_id, destination_id),
    FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE,
    FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Match related trips
CREATE TABLE match_trips (
    match_id VARCHAR(36),
    trip_id VARCHAR(36),
    PRIMARY KEY (match_id, trip_id),
    FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE,
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Conversations
CREATE TABLE conversations (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    type ENUM('direct', 'group', 'trip'),
    trip_id VARCHAR(36) NULL,
    name VARCHAR(255),
    avatar_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Conversation participants
CREATE TABLE conversation_participants (
    conversation_id VARCHAR(36),
    user_id VARCHAR(36),
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_read_at TIMESTAMP NULL,
    is_muted BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (conversation_id, user_id),
    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Messages
CREATE TABLE messages (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    conversation_id VARCHAR(36),
    sender_id VARCHAR(36),
    content TEXT NOT NULL,
    type ENUM('text', 'image', 'location', 'trip_invite') DEFAULT 'text',
    status ENUM('sending', 'sent', 'delivered', 'read') DEFAULT 'sent',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_conversation (conversation_id),
    INDEX idx_sender (sender_id),
    INDEX idx_created (created_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Message attachments
CREATE TABLE message_attachments (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    message_id VARCHAR(36),
    type ENUM('image', 'video', 'document', 'audio'),
    url TEXT NOT NULL,
    thumbnail_url TEXT,
    file_name VARCHAR(255),
    file_size BIGINT,
    mime_type VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Payments
CREATE TABLE payments (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    status ENUM('pending', 'processing', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    type ENUM('trip_booking', 'activity', 'split_expense', 'community_event'),
    trip_id VARCHAR(36) NULL,
    payer_id VARCHAR(36),
    receiver_id VARCHAR(36) NULL,
    description TEXT,
    method ENUM('card', 'nfc', 'wallet'),
    provider_payment_id VARCHAR(255),
    provider_name VARCHAR(50) DEFAULT 'stripe',
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE SET NULL,
    FOREIGN KEY (payer_id) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE RESTRICT,
    INDEX idx_payer (payer_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Payment refunds
CREATE TABLE payment_refunds (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    payment_id VARCHAR(36),
    amount DECIMAL(10, 2) NOT NULL,
    reason TEXT,
    status ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending',
    provider_refund_id VARCHAR(255),
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Notifications
CREATE TABLE notifications (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36),
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSON,
    is_read BOOLEAN DEFAULT FALSE,
    action_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_read (user_id, is_read, created_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Reviews
CREATE TABLE reviews (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    trip_id VARCHAR(36),
    reviewer_id VARCHAR(36),
    reviewee_id VARCHAR(36),
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_review (trip_id, reviewer_id, reviewee_id),
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewee_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_trip (trip_id),
    INDEX idx_reviewee (reviewee_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
