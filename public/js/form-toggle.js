document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('showLoginBtn');
    const registerBtn = document.getElementById('showRegisterBtn');
    const loginSection = document.getElementById('loginSection');
    const registerSection = document.getElementById('registerSection');

    loginBtn.addEventListener('click', () => {
        loginSection.style.display = 'block';
        registerSection.style.display = 'none';
    });

    registerBtn.addEventListener('click', () => {
        registerSection.style.display = 'block';
        loginSection.style.display = 'none';
    });
});
