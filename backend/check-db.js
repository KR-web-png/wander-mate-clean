const mysql = require('mysql2/promise');

async function checkDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'wandermate'
    });

    console.log('\n=== Checking Users Table ===\n');
    
    const [users] = await connection.query(
      `SELECT id, email, name, avatar_url, bio, location, travel_style, 
              verification_status, joined_at, trips_completed, rating 
       FROM users LIMIT 2`
    );

    console.log('Users found:', users.length);
    users.forEach((user, index) => {
      console.log(`\nUser ${index + 1}:`);
      console.log('  ID:', user.id);
      console.log('  Email:', user.email);
      console.log('  Name:', user.name);
      console.log('  Avatar URL:', user.avatar_url || 'NULL');
      console.log('  Bio:', user.bio || 'NULL');
      console.log('  Location:', user.location || 'NULL');
      console.log('  Travel Style:', user.travel_style || 'NULL');
      console.log('  Verification Status:', user.verification_status);
      console.log('  Joined At:', user.joined_at);
      console.log('  Trips Completed:', user.trips_completed);
      console.log('  Rating:', user.rating);
    });

    if (users.length > 0) {
      const userId = users[0].id;
      
      console.log('\n=== Checking User Interests ===\n');
      const [interests] = await connection.query(
        `SELECT i.name FROM interests i
         INNER JOIN user_interests ui ON i.id = ui.interest_id
         WHERE ui.user_id = ?`,
        [userId]
      );
      console.log('Interests for user 1:', interests.map(i => i.name).join(', ') || 'NONE');

      console.log('\n=== Checking User Languages ===\n');
      const [languages] = await connection.query(
        `SELECT l.code, l.name FROM languages l
         INNER JOIN user_languages ul ON l.id = ul.language_id
         WHERE ul.user_id = ?`,
        [userId]
      );
      console.log('Languages for user 1:', languages.map(l => l.code).join(', ') || 'NONE');
    }

    await connection.end();
  } catch (error) {
    console.error('Database check error:', error.message);
  }
}

checkDatabase();
