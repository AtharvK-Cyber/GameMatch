const express = require('express');
const app = express();
const port = 3001;
const { Pool } = require('pg');
const { v4: uuidv4 } = require('uuid'); // Import the 'uuid' package

app.use(express.json()); 

app.post('/api/find-match', async (req, res) => {
  const { game, rank, userGender } = req.body;

  try {
    // 1. Database Connection
    const pool = new Pool({
      connectionString: "postgresql://postgres.arpfturarbmnxocszauw:Wez48k7HapmdiwU6@aws-0-ap-south-1.pooler.supabase.com:6543/postgres"
    });

    // 2. Test Connection (optional)
    // ...

    // 3. Generate a Unique Match Request ID
    const matchRequestId = uuidv4(); 

    // 4. Store Match Request Data with the ID
    const insertRequestResult = await pool.query(
      'INSERT INTO match_requests (id, game, rank, gender) VALUES ($1, $2, $3, $4) RETURNING id',
      [matchRequestId, game, rank, userGender]
    );
    console.log('Match request inserted with ID:', matchRequestId);

    // 5. Find a Match
    const matchedUser = await findMatchingUser(game, rank, userGender, matchRequestId, pool); 

    // 6. Send Response
    // ... (same as before)

    // 7. Release Connection
    await pool.end(); 

  } catch (error) {
    // ... (error handling)
  }
});

// MATCHMAKING FUNCTION (updated to exclude match requester)
async function findMatchingUser(game, rank, userGender, matchRequestId, pool) { 
  try {
    // ... (You'll add rank comparison logic here later)

    const queryResult = await pool.query(`
      SELECT * 
      FROM users 
      WHERE 
        game = $1 AND   
        gender != $2   
        AND id != $3   -- Exclude the match requester's ID
      LIMIT 1         
    `, [game, userGender, matchRequestId]);

    // ... (rest of the function - same as before)

  } catch (error) {
    // ... (error handling)
  }
}

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
