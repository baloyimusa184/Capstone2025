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
        if (response.ok) {
            alert(result.message);
        } else {
            alert(result.error);
        }
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

// AI Recommendations
if (window.location.pathname === '/ai.html') {
    fetch('/api/recommendations')
        .then((response) => response.json())
        .then((data) => {
            const recommendations = document.getElementById('recommendations');
            recommendations.innerHTML = data.meals.map((meal) => `<li>${meal}</li>`).join('');
        })
        .catch((err) => console.error('Error fetching recommendations:', err));
}
