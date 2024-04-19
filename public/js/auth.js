// auth.js
class AuthManager {
    constructor(apiUrl) {
        this.apiUrl = apiUrl;
    }

    async register(name, email, password, role) {
        const response = await fetch(`${this.apiUrl}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, role })
        });
        return response.json(); // Process the JSON response
    }

    async login(email, password) {
        const response = await fetch(`${this.apiUrl}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        return response.json();
    }

    logout() {
        console.log('Logged out successfully');
        window.location.href = '/'; // Redirect to home page after logout
    }
}

const authManager = new AuthManager('http://localhost:5000/api');

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registrationForm = document.getElementById('registrationForm');
    const logoutButton = document.getElementById('logoutButton');

    if (registrationForm) {
        registrationForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const name = event.target.name.value;
            const email = event.target.email.value;
            const password = event.target.password.value;
            const role = event.target.role.value;

            const result = await authManager.register(name, email, password, role);
            console.log(result);
            if (result.success) {
                alert('Registration successful!');
                // Optionally redirect the user or clear the form
            } else {
                alert('Registration failed: ' + result.message);
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const email = event.target.email.value;
            const password = event.target.password.value;

            const result = await authManager.login(email, password);
            console.log(result);
            if (result.success) {
                alert('Login successful!');
                // Optionally redirect the user
            } else {
                alert('Login failed: ' + result.message);
            }
        });
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            authManager.logout();
        });
    }
});
