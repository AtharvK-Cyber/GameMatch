document.getElementById("partnerForm").addEventListener("submit", function(event) {
  event.preventDefault();

  const game = document.getElementById('game').value;
  const rank = document.getElementById('rank').value;
  const userGender = document.getElementById('gender').value;

  // Redirect to the chat page immediately 
  window.location.href = `/chat.html?game=${game}&rank=${rank}&gender=${userGender}`; 
});