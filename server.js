const express = require('express');
const app = express();
const port = 3001;
const { Pool } = require('pg');
const { v4: uuidv4 } = require('uuid'); // For generating unique IDs

app.use(express.json());

// Supabase Connection String (Replace [YOUR-PASSWORD])
const connectionString = "postgresql://postgres.arpfturarbmnxocszauw:@aws-0-ap-south-1.pooler.supabase.com:6543/postgres";

app.post('/api/find-match', async (req, res) => {
  const { game, rank, userGender } = req.body;

  try {
    // 1. Database Connection
    const pool = new Pool({ connectionString });

    // 2. Generate Unique Match Request ID
    const matchRequestId = uuidv4();

    // 3. Store Match Request Data (directly in the 'users' table for now)
    const insertUserResult = await pool.query(
      'INSERT INTO users (id, game, rank, gender) VALUES ($1, $2, $3, $4)',
      [matchRequestId, game, rank, userGender]
    );
    console.log('User data inserted with ID:', matchRequestId);

    // 4. Find a Match
    const matchedUser = await findMatchingUser(game, rank, userGender, matchRequestId, pool);

    // 5. Send Response
    if (matchedUser) {
      res.json({
        message: 'Match found!',
        matchData: matchedUser
      });
    } else {
      res.status(404).json({ message: 'No match found.' });
    }

    // 6. Release Connection
    await pool.end();

  } catch (error) {
    console.error('Error in /api/find-match:', error);
    res.status(500).json({ message: 'Failed to find a match' });
  }
});

// MATCHMAKING FUNCTION (with text-based rank comparison)
async function findMatchingUser(game, rank, userGender, matchRequestId, pool) {
  try {
    const rankOrder = [
      "Iron 1", "Iron 2", "Iron 3", "Bronze", "Silver 1", "Silver 2", "Silver 3",
      "Gold 1", "Gold 2", "Gold 3", "Platinum 1", "Platinum 2", "Platinum 3",
      "Diamond 1", "Diamond 2", "Diamond 3", "Immortal 1", "Immortal 2", "Immortal 3",
      "Conqueror"
    ];

    const currentRankIndex = rankOrder.indexOf(rank);

    const allowedRanks = [rank];
    if (currentRankIndex > 0) {
      allowedRanks.push(rankOrder[currentRankIndex - 1]);
    }
    if (currentRankIndex < rankOrder.length - 1) {
      allowedRanks.push(rankOrder[currentRankIndex + 1]);
    }

    const queryResult = await pool.query(`
      SELECT * 
      FROM users 
      WHERE 
        game = $1 AND   
        gender != $2   
        AND id != $3    
        AND rank = ANY($4) 
      LIMIT 1         
    `, [game, userGender, matchRequestId, allowedRanks]);

    if (queryResult.rows.length > 0) {
      return queryResult.rows[0];
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error finding matching user:", error);
    throw error;
  }
}

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
