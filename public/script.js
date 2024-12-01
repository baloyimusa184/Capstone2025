// Register
document.getElementById('registerForm')?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const username = document.getElementById('registerUsername').value;
  const pass = document.getElementById('registerPassword').value;

  try {
      const response = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, pass }),
      });

      const result = await response.json();
      alert(response.ok ? result.message : result.error);
  } catch (err) {
      console.error(err);
  }
});

// Login
document.getElementById('loginForm')?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const username = document.getElementById('loginUsername').value;
  const pass = document.getElementById('loginPassword').value;

  try {
      const response = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, pass }),
      });

      const result = await response.json();
      if (response.ok) {
          sessionStorage.setItem('userId', result.userId);
          sessionStorage.setItem('username', username);
          window.location.href = '/home.html';
      } else {
          alert(result.error);
      }
  } catch (err) {
      console.error(err);
  }
});

// Logout
document.getElementById('logoutButton')?.addEventListener('click', () => {
  sessionStorage.clear();
  window.location.href = '/index.html';
});

// Delete Account
document.getElementById('deleteAccountButton')?.addEventListener('click', async () => {
  const userId = sessionStorage.getItem('userId');

  if (confirm('Are you sure you want to delete your account?')) {
      try {
          const response = await fetch(`/api/users/${userId}`, { method: 'DELETE' });
          const result = await response.json();
          if (response.ok) {
              alert(result.message);
              sessionStorage.clear();
              window.location.href = '/index.html';
          } else {
              alert(result.error);
          }
      } catch (err) {
          console.error(err);
      }
  }
});

//get AI recommendations:
document.addEventListener('DOMContentLoaded', () => {
    const recommendButton = document.getElementById('recommend-btn');
    const mealTypeSelect = document.getElementById('meal-type');
    const recommendationList = document.getElementById('recommendation-list');

    recommendButton.addEventListener('click', () => {
        const mealType = mealTypeSelect.value;

        fetch('/api/recommend', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ meal_type: mealType }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log("Received recommendations:", data.recommendations);
                displayRecommendations(data.recommendations);
            })
            .catch(err => console.error("Error fetching recommendations:", err));
    });

    function displayRecommendations(recommendations) {
        recommendationList.innerHTML = ''; // Clear old recommendations
        if (recommendations.length === 0) {
            recommendationList.innerHTML = '<li>No recommendations available.</li>';
            return;
        }
        recommendations.forEach(meal => {
            const listItem = document.createElement('li');
            listItem.textContent = meal;
            recommendationList.appendChild(listItem);
        });
    }
    
});
