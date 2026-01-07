-- Seed data for Wander-Mate database
-- Based on mock data from frontend

-- Insert common interests
INSERT INTO interests (id, name, category) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'hiking', 'outdoor'),
    ('550e8400-e29b-41d4-a716-446655440002', 'photography', 'creative'),
    ('550e8400-e29b-41d4-a716-446655440003', 'food', 'culinary'),
    ('550e8400-e29b-41d4-a716-446655440004', 'history', 'cultural'),
    ('550e8400-e29b-41d4-a716-446655440005', 'beaches', 'relaxation'),
    ('550e8400-e29b-41d4-a716-446655440006', 'nightlife', 'entertainment'),
    ('550e8400-e29b-41d4-a716-446655440007', 'adventure', 'outdoor'),
    ('550e8400-e29b-41d4-a716-446655440008', 'culture', 'cultural'),
    ('550e8400-e29b-41d4-a716-446655440009', 'nature', 'outdoor'),
    ('550e8400-e29b-41d4-a716-446655440010', 'art', 'creative'),
    ('550e8400-e29b-41d4-a716-446655440011', 'music', 'entertainment'),
    ('550e8400-e29b-41d4-a716-446655440012', 'shopping', 'leisure'),
    ('550e8400-e29b-41d4-a716-446655440013', 'sports', 'activity'),
    ('550e8400-e29b-41d4-a716-446655440014', 'wellness', 'health'),
    ('550e8400-e29b-41d4-a716-446655440015', 'wildlife', 'outdoor')
ON CONFLICT (name) DO NOTHING;

-- Insert languages
INSERT INTO languages (id, code, name) VALUES
    ('650e8400-e29b-41d4-a716-446655440001', 'en', 'English'),
    ('650e8400-e29b-41d4-a716-446655440002', 'es', 'Spanish'),
    ('650e8400-e29b-41d4-a716-446655440003', 'fr', 'French'),
    ('650e8400-e29b-41d4-a716-446655440004', 'de', 'German'),
    ('650e8400-e29b-41d4-a716-446655440005', 'it', 'Italian'),
    ('650e8400-e29b-41d4-a716-446655440006', 'pt', 'Portuguese'),
    ('650e8400-e29b-41d4-a716-446655440007', 'ja', 'Japanese'),
    ('650e8400-e29b-41d4-a716-446655440008', 'zh', 'Chinese'),
    ('650e8400-e29b-41d4-a716-446655440009', 'ar', 'Arabic'),
    ('650e8400-e29b-41d4-a716-446655440010', 'hi', 'Hindi')
ON CONFLICT (code) DO NOTHING;

-- Insert activities
INSERT INTO activities (id, name, category) VALUES
    ('750e8400-e29b-41d4-a716-446655440001', 'Sightseeing', 'tour'),
    ('750e8400-e29b-41d4-a716-446655440002', 'Beach activities', 'outdoor'),
    ('750e8400-e29b-41d4-a716-446655440003', 'Mountain hiking', 'outdoor'),
    ('750e8400-e29b-41d4-a716-446655440004', 'Cultural tours', 'cultural'),
    ('750e8400-e29b-41d4-a716-446655440005', 'Food tours', 'culinary'),
    ('750e8400-e29b-41d4-a716-446655440006', 'Water sports', 'sport'),
    ('750e8400-e29b-41d4-a716-446655440007', 'Safari', 'adventure'),
    ('750e8400-e29b-41d4-a716-446655440008', 'Photography', 'creative'),
    ('750e8400-e29b-41d4-a716-446655440009', 'Shopping', 'leisure'),
    ('750e8400-e29b-41d4-a716-446655440010', 'Nightlife', 'entertainment'),
    ('750e8400-e29b-41d4-a716-446655440011', 'Museum visits', 'cultural'),
    ('750e8400-e29b-41d4-a716-446655440012', 'Local cuisine', 'culinary'),
    ('750e8400-e29b-41d4-a716-446655440013', 'Scuba diving', 'sport'),
    ('750e8400-e29b-41d4-a716-446655440014', 'Surfing', 'sport'),
    ('750e8400-e29b-41d4-a716-446655440015', 'Skiing', 'sport')
ON CONFLICT (name) DO NOTHING;

-- Insert sample destinations
INSERT INTO destinations (id, name, country, image_url, description, latitude, longitude, rating, best_time_to_visit, average_cost) VALUES
    ('850e8400-e29b-41d4-a716-446655440001', 'Bali', 'Indonesia', 'https://images.unsplash.com/photo-1537996194471-e657df975ab4', 'Tropical paradise with stunning beaches, ancient temples, and vibrant culture', -8.3405, 115.0920, 4.8, 'April to October', 'moderate'),
    ('850e8400-e29b-41d4-a716-446655440002', 'Paris', 'France', 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34', 'City of lights with iconic landmarks, world-class museums, and romantic atmosphere', 48.8566, 2.3522, 4.7, 'April to June, September to October', 'expensive'),
    ('850e8400-e29b-41d4-a716-446655440003', 'Tokyo', 'Japan', 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf', 'Blend of traditional and modern culture with incredible food and technology', 35.6762, 139.6503, 4.9, 'March to May, September to November', 'expensive'),
    ('850e8400-e29b-41d4-a716-446655440004', 'Santorini', 'Greece', 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e', 'Stunning island with white-washed buildings, blue-domed churches, and breathtaking sunsets', 36.3932, 25.4615, 4.8, 'April to November', 'expensive'),
    ('850e8400-e29b-41d4-a716-446655440005', 'New York', 'United States', 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9', 'The city that never sleeps with world-famous landmarks and diverse culture', 40.7128, -74.0060, 4.6, 'April to June, September to November', 'expensive'),
    ('850e8400-e29b-41d4-a716-446655440006', 'Maldives', 'Maldives', 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8', 'Luxury island paradise with crystal-clear waters and overwater bungalows', 3.2028, 73.2207, 4.9, 'November to April', 'luxury'),
    ('850e8400-e29b-41d4-a716-446655440007', 'Barcelona', 'Spain', 'https://images.unsplash.com/photo-1583422409516-2895a77efded', 'Vibrant city with unique architecture, beaches, and Mediterranean culture', 41.3874, 2.1686, 4.7, 'May to June, September to October', 'moderate'),
    ('850e8400-e29b-41d4-a716-446655440008', 'Iceland', 'Iceland', 'https://images.unsplash.com/photo-1504829857797-ddff29c27927', 'Land of fire and ice with geysers, waterfalls, and northern lights', 64.9631, -19.0208, 4.8, 'June to August', 'expensive')
ON CONFLICT (name, country) DO NOTHING;

-- Link destinations with activities
INSERT INTO destination_activities (destination_id, activity_id, popularity_score) VALUES
    ('850e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440002', 95),
    ('850e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440004', 85),
    ('850e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440014', 90),
    ('850e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440001', 100),
    ('850e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440011', 95),
    ('850e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440005', 90),
    ('850e8400-e29b-41d4-a716-446655440003', '750e8400-e29b-41d4-a716-446655440004', 90),
    ('850e8400-e29b-41d4-a716-446655440003', '750e8400-e29b-41d4-a716-446655440012', 100),
    ('850e8400-e29b-41d4-a716-446655440004', '750e8400-e29b-41d4-a716-446655440002', 100),
    ('850e8400-e29b-41d4-a716-446655440004', '750e8400-e29b-41d4-a716-446655440001', 85),
    ('850e8400-e29b-41d4-a716-446655440006', '750e8400-e29b-41d4-a716-446655440013', 95),
    ('850e8400-e29b-41d4-a716-446655440006', '750e8400-e29b-41d4-a716-446655440002', 100),
    ('850e8400-e29b-41d4-a716-446655440008', '750e8400-e29b-41d4-a716-446655440003', 90),
    ('850e8400-e29b-41d4-a716-446655440008', '750e8400-e29b-41d4-a716-446655440008', 95)
ON CONFLICT DO NOTHING;

-- Add destination tags
INSERT INTO destination_tags (destination_id, tag) VALUES
    ('850e8400-e29b-41d4-a716-446655440001', 'beach'),
    ('850e8400-e29b-41d4-a716-446655440001', 'culture'),
    ('850e8400-e29b-41d4-a716-446655440001', 'adventure'),
    ('850e8400-e29b-41d4-a716-446655440002', 'romantic'),
    ('850e8400-e29b-41d4-a716-446655440002', 'culture'),
    ('850e8400-e29b-41d4-a716-446655440002', 'art'),
    ('850e8400-e29b-41d4-a716-446655440003', 'culture'),
    ('850e8400-e29b-41d4-a716-446655440003', 'food'),
    ('850e8400-e29b-41d4-a716-446655440003', 'technology'),
    ('850e8400-e29b-41d4-a716-446655440004', 'romantic'),
    ('850e8400-e29b-41d4-a716-446655440004', 'beach'),
    ('850e8400-e29b-41d4-a716-446655440004', 'luxury'),
    ('850e8400-e29b-41d4-a716-446655440005', 'urban'),
    ('850e8400-e29b-41d4-a716-446655440005', 'culture'),
    ('850e8400-e29b-41d4-a716-446655440005', 'shopping'),
    ('850e8400-e29b-41d4-a716-446655440006', 'luxury'),
    ('850e8400-e29b-41d4-a716-446655440006', 'beach'),
    ('850e8400-e29b-41d4-a716-446655440006', 'romantic'),
    ('850e8400-e29b-41d4-a716-446655440007', 'beach'),
    ('850e8400-e29b-41d4-a716-446655440007', 'culture'),
    ('850e8400-e29b-41d4-a716-446655440007', 'nightlife'),
    ('850e8400-e29b-41d4-a716-446655440008', 'nature'),
    ('850e8400-e29b-41d4-a716-446655440008', 'adventure'),
    ('850e8400-e29b-41d4-a716-446655440008', 'photography')
ON CONFLICT DO NOTHING;

-- Note: User accounts should be created via signup endpoint (for password hashing)
-- This is just a demo user for testing (password: 'testpass123')
INSERT INTO users (id, email, password_hash, name, avatar_url, bio, location, travel_style, verification_status, trips_completed, rating) VALUES
    ('950e8400-e29b-41d4-a716-446655440001', 'demo@wandermate.com', '$2b$10$placeholder_hash_will_be_generated_at_signup', 'Demo User', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Demo', 'Passionate traveler exploring the world one destination at a time', 'San Francisco, USA', 'adventure', 'email_verified', 5, 4.5)
ON CONFLICT (email) DO NOTHING;
