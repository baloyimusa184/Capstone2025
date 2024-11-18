document.addEventListener('DOMContentLoaded', () => {
    // Check if the user is logged in based on sessionStorage
    const userId = sessionStorage.getItem('userId');
    if (userId) {
        // If logged in, redirect to home page
        window.location.href = '/home.html';
    }

    // Register a new user
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const username = document.getElementById('registerUsername').value;
            const pass = document.getElementById('registerPassword').value;

            try {
                const response = await fetch('/api/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, pass }),
                });

                const result = await response.json();

                if (result.message) {
                    alert(result.message);
                    // No automatic login after registration
                    alert('Please log in using your credentials');
                } else {
                    alert(result.error);
                }
            } catch (err) {
                console.error('Error registering user:', err);
            }
        });
    }

    // Login user
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const username = document.getElementById('loginUsername').value;
            const pass = document.getElementById('loginPassword').value;

            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, pass }),
                });

                const result = await response.json();

                if (result.userId) {
                    alert(result.message);
                    sessionStorage.setItem('userId', result.userId);
                    window.location.href = '/home.html';  // Redirect to home page after successful login
                } else {
                    alert(result.error);
                }
            } catch (err) {
                console.error('Error logging in user:', err);
            }
        });
    }

    // Delete user
    const deleteAccountButton = document.getElementById('deleteAccountButton');
    if (deleteAccountButton) {
        deleteAccountButton.addEventListener('click', async () => {
            const userId = sessionStorage.getItem('userId');
            if (!userId) {
                alert('You need to be logged in to delete your account!');
                return;
            }

            const confirmDelete = confirm('Are you sure you want to delete your account?');
            if (confirmDelete) {
                try {
                    const response = await fetch(`/api/users/${userId}`, {
                        method: 'DELETE',
                    });

                    const result = await response.json();
                    alert(result.message || result.error);

                    // Clear sessionStorage and redirect to login page
                    sessionStorage.clear();
                    window.location.href = '/index.html';  // Redirect to login page after deletion
                } catch (err) {
                    console.error('Error deleting user:', err);
                }
            }
        });
    }

    // Log out
    const logoutLink = document.querySelector('a[href="/logout"]');
    if (logoutLink) {
        logoutLink.addEventListener('click', (event) => {
            event.preventDefault();
            // Clear sessionStorage
            sessionStorage.clear();
            // Redirect to login page
            window.location.href = '/index.html';
        });
    }
});
