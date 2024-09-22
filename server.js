const express = require('express');
const app = express();
const port = 3001;
const { Pool } = require('pg');

app.use(express.json()); 

app.post('/api/find-match', async (req, res) => {
  const { game, rank, userGender } = req.body;

  try {
    // 1. Establish Database Connection (only when a request is made)
    const pool = new Pool({
      connectionString: "postgresql://postgres.arpfturarbmnxocszauw::Wez48k7HapmdiwU6@aws-0-ap-south-1.pooler.supabase.com:6543/postgres"
    });

    // 2. Test the Connection 
    const connectionResult = await pool.query('SELECT NOW()');
    console.log('Database connected! Current time:', connectionResult.rows[0].now);

    // 3. Store Match Request Data 
    const insertRequestResult = await pool.query(
      'INSERT INTO match_requests (game, rank, gender) VALUES ($1, $2, $3) RETURNING id',
      [game, rank, userGender]
    );
    const matchRequesterId = insertRequestResult.rows[0].id;
    console.log('Match request inserted with ID:', matchRequesterId); 

    // 4. Find a Match (call your matching function - we'll update this later)
    const matchedUser = await findMatchingUser(game, rank, userGender, matchRequesterId, pool); // Pass the pool to the function

    // 5. Send Response
    if (matchedUser) {
      res.json({
        message: 'Match found!',
        matchData: matchedUser
      });
    } else {
      res.status(404).json({ message: 'No match found.' });
    }

    // 6. Release the Database Connection (important!)
    await pool.end();

  } catch (error) {
    console.error('Error in /api/find-match:', error);
    res.status(500).json({ message: 'Failed to find a match' });
  }
});

// ... (your findMatchingUser function - we'll work on this next) 

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
