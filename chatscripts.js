document.addEventListener('DOMContentLoaded', () => {
  // ... (Your existing video and chat setup code) 

  const nextMatchButton = document.getElementById('nextMatchButton');
  const user2Label = document.getElementById('user2Label');

  // Function to simulate finding a match (reused)
  function findMatch(userGender, game, rank) {
    // ... (Your existing match-finding logic from the previous example)
  }

  // Get match data from URL parameters (used for initial connection)
  const urlParams = new URLSearchParams(window.location.search);
  let currentMatch = {
    game: urlParams.get('game'),
    rank: urlParams.get('rank'),
    gender: urlParams.get('gender')
  };

  // Simulate initial connection delay and display match info
  setTimeout(() => {
    currentMatch = findMatch(currentMatch.gender, currentMatch.game, currentMatch.rank);
    if (currentMatch) {
      user2Label.textContent = `Connected Player (${currentMatch.gender}, ${currentMatch.rank})`;
    } else {
      user2Label.textContent = "No match found. Please try again later."
    }
  }, 2000); 

  nextMatchButton.addEventListener('click', () => {
    user2Label.textContent = "Searching..."; 

    setTimeout(() => {
      currentMatch = findMatch(currentMatch.gender, currentMatch.game, currentMatch.rank);
      if (currentMatch) {
        user2Label.textContent = `Connected Player (${currentMatch.gender}, ${currentMatch.rank})`;
      } else {
        user2Label.textContent = "No match found. Please try again later." 
      }
    }, 2000); // Simulate searching delay
  });

  // ... (Rest of your existing chat functionality)
});