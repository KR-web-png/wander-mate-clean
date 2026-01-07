-- MySQL Seed Data for Wander-Mate
USE wandermate;

-- Insert common interests
INSERT INTO interests (name, category) VALUES
    ('hiking', 'outdoor'),
    ('photography', 'creative'),
    ('food', 'culinary'),
    ('history', 'cultural'),
    ('beaches', 'relaxation'),
    ('nightlife', 'entertainment'),
    ('adventure', 'outdoor'),
    ('culture', 'cultural'),
    ('nature', 'outdoor'),
    ('art', 'creative'),
    ('music', 'entertainment'),
    ('shopping', 'leisure'),
    ('sports', 'activity'),
    ('wellness', 'health'),
    ('wildlife', 'outdoor');

-- Insert languages
INSERT INTO languages (code, name) VALUES
    ('en', 'English'),
    ('es', 'Spanish'),
    ('fr', 'French'),
    ('de', 'German'),
    ('it', 'Italian'),
    ('pt', 'Portuguese'),
    ('ja', 'Japanese'),
    ('zh', 'Chinese'),
    ('ar', 'Arabic'),
    ('hi', 'Hindi');

-- Insert activities
INSERT INTO activities (name, category) VALUES
    ('Sightseeing', 'tour'),
    ('Beach activities', 'outdoor'),
    ('Mountain hiking', 'outdoor'),
    ('Cultural tours', 'cultural'),
    ('Food tours', 'culinary'),
    ('Water sports', 'sport'),
    ('Safari', 'adventure'),
    ('Photography', 'creative'),
    ('Shopping', 'leisure'),
    ('Nightlife', 'entertainment'),
    ('Museum visits', 'cultural'),
    ('Local cuisine', 'culinary'),
    ('Scuba diving', 'sport'),
    ('Surfing', 'sport'),
    ('Skiing', 'sport');

-- Insert destinations
INSERT INTO destinations (name, country, image_url, description, latitude, longitude, rating, best_time_to_visit, average_cost) VALUES
    ('Bali', 'Indonesia', 'https://images.unsplash.com/photo-1537996194471-e657df975ab4', 'Tropical paradise with stunning beaches, ancient temples, and vibrant culture', -8.3405, 115.0920, 4.8, 'April to October', 'moderate'),
    ('Paris', 'France', 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34', 'City of lights with iconic landmarks, world-class museums, and romantic atmosphere', 48.8566, 2.3522, 4.7, 'April to June, September to October', 'expensive'),
    ('Tokyo', 'Japan', 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf', 'Blend of traditional and modern culture with incredible food and technology', 35.6762, 139.6503, 4.9, 'March to May, September to November', 'expensive'),
    ('Santorini', 'Greece', 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e', 'Stunning island with white-washed buildings, blue-domed churches, and breathtaking sunsets', 36.3932, 25.4615, 4.8, 'April to November', 'expensive'),
    ('New York', 'United States', 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9', 'The city that never sleeps with world-famous landmarks and diverse culture', 40.7128, -74.0060, 4.6, 'April to June, September to November', 'expensive'),
    ('Maldives', 'Maldives', 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8', 'Luxury island paradise with crystal-clear waters and overwater bungalows', 3.2028, 73.2207, 4.9, 'November to April', 'luxury'),
    ('Barcelona', 'Spain', 'https://images.unsplash.com/photo-1583422409516-2895a77efded', 'Vibrant city with unique architecture, beaches, and Mediterranean culture', 41.3874, 2.1686, 4.7, 'May to June, September to October', 'moderate'),
    ('Iceland', 'Iceland', 'https://images.unsplash.com/photo-1504829857797-ddff29c27927', 'Land of fire and ice with geysers, waterfalls, and northern lights', 64.9631, -19.0208, 4.8, 'June to August', 'expensive');

-- Link destinations with activities (get IDs first)
SET @bali_id = (SELECT id FROM destinations WHERE name = 'Bali' LIMIT 1);
SET @paris_id = (SELECT id FROM destinations WHERE name = 'Paris' LIMIT 1);
SET @tokyo_id = (SELECT id FROM destinations WHERE name = 'Tokyo' LIMIT 1);
SET @santorini_id = (SELECT id FROM destinations WHERE name = 'Santorini' LIMIT 1);
SET @maldives_id = (SELECT id FROM destinations WHERE name = 'Maldives' LIMIT 1);
SET @iceland_id = (SELECT id FROM destinations WHERE name = 'Iceland' LIMIT 1);

SET @beach_act = (SELECT id FROM activities WHERE name = 'Beach activities' LIMIT 1);
SET @cultural_act = (SELECT id FROM activities WHERE name = 'Cultural tours' LIMIT 1);
SET @sightseeing_act = (SELECT id FROM activities WHERE name = 'Sightseeing' LIMIT 1);
SET @museum_act = (SELECT id FROM activities WHERE name = 'Museum visits' LIMIT 1);
SET @food_act = (SELECT id FROM activities WHERE name = 'Food tours' LIMIT 1);
SET @cuisine_act = (SELECT id FROM activities WHERE name = 'Local cuisine' LIMIT 1);
SET @diving_act = (SELECT id FROM activities WHERE name = 'Scuba diving' LIMIT 1);
SET @hiking_act = (SELECT id FROM activities WHERE name = 'Mountain hiking' LIMIT 1);
SET @photo_act = (SELECT id FROM activities WHERE name = 'Photography' LIMIT 1);

INSERT INTO destination_activities (destination_id, activity_id, popularity_score) VALUES
    (@bali_id, @beach_act, 95),
    (@bali_id, @cultural_act, 85),
    (@paris_id, @sightseeing_act, 100),
    (@paris_id, @museum_act, 95),
    (@paris_id, @food_act, 90),
    (@tokyo_id, @cultural_act, 90),
    (@tokyo_id, @cuisine_act, 100),
    (@santorini_id, @beach_act, 100),
    (@santorini_id, @sightseeing_act, 85),
    (@maldives_id, @diving_act, 95),
    (@maldives_id, @beach_act, 100),
    (@iceland_id, @hiking_act, 90),
    (@iceland_id, @photo_act, 95);

-- Add destination tags
INSERT INTO destination_tags (destination_id, tag) VALUES
    (@bali_id, 'beach'),
    (@bali_id, 'culture'),
    (@bali_id, 'adventure'),
    (@paris_id, 'romantic'),
    (@paris_id, 'culture'),
    (@paris_id, 'art'),
    (@tokyo_id, 'culture'),
    (@tokyo_id, 'food'),
    (@tokyo_id, 'technology'),
    (@santorini_id, 'romantic'),
    (@santorini_id, 'beach'),
    (@santorini_id, 'luxury'),
    (@maldives_id, 'luxury'),
    (@maldives_id, 'beach'),
    (@maldives_id, 'romantic'),
    (@iceland_id, 'nature'),
    (@iceland_id, 'adventure'),
    (@iceland_id, 'photography');

SELECT 'Database seeded successfully!' AS message;
SELECT COUNT(*) AS destinations_count FROM destinations;
SELECT COUNT(*) AS activities_count FROM activities;
SELECT COUNT(*) AS interests_count FROM interests;
