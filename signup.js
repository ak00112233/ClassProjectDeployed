let loginCaptchaExpected  = 0;
let signupCaptchaExpected = 0;

function toggleForm() {
    const loginContainer = document.getElementById('loginForm').closest('.auth-container');
    const signupContainer = document.getElementById('signupContainer');
    loginContainer.classList.toggle('hidden');
    signupContainer.classList.toggle('hidden');
}

function generateCaptcha(type) {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const sum  = num1 + num2;

    if (type === 'login') {
        loginCaptchaExpected = sum;
        document.getElementById('loginCaptchaQuestion').innerText = `What is ${num1} + ${num2}?`;
    } else {
        signupCaptchaExpected = sum;
        document.getElementById('signupCaptchaQuestion').innerText = `What is ${num1} + ${num2}?`;
    }
}

function handleLogin(event) {
    event.preventDefault();

    const username     = document.getElementById('username').value;
    const password     = document.getElementById('password').value;
    const captchaAnswer = parseInt(document.getElementById('loginCaptchaAnswer').value);

    if (captchaAnswer !== loginCaptchaExpected) {
        showAuthMessage('Incorrect Captcha!', 'error', 'loginMessage');
        generateCaptcha('login');
        return;
    }

    let users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.username === username);

    if (user && user.password === password) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        sessionStorage.removeItem('loginFormData');
        showAuthMessage('Login successful! Redirecting...', 'success', 'loginMessage');
        setTimeout(() => { window.location.href = '/index.html'; }, 2000);
    } else if (user && user.password !== password) {
        showAuthMessage('Invalid password!', 'error', 'loginMessage');
    } else {
        showAuthMessage('User not found! Please sign up first.', 'error', 'loginMessage');
    }
}

function handleSignup(event) {
    event.preventDefault();

    const name            = document.getElementById('signupName').value;
    const email           = document.getElementById('signupEmail').value;
    const roll            = document.getElementById('signupRoll').value;
    const username        = document.getElementById('signupUsername').value;
    const password        = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    const captchaAnswer   = parseInt(document.getElementById('signupCaptchaAnswer').value);

    if (captchaAnswer !== signupCaptchaExpected) {
        showAuthMessage('Incorrect Captcha!', 'error', 'signupMessage');
        generateCaptcha('signup');
        return;
    }

    if (password !== confirmPassword) {
        showAuthMessage('Passwords do not match!', 'error', 'signupMessage');
        return;
    }

    if (password.length < 4) {
        showAuthMessage('Password should be at least 4 characters!', 'error', 'signupMessage');
        return;
    }

    let users = JSON.parse(localStorage.getItem('users')) || [];

    if (users.find(u => u.username === username)) {
        showAuthMessage('Username already exists!', 'error', 'signupMessage');
        return;
    }

    const newUser = {
        name,
        email,
        rollNumber: roll,
        username,
        password,
        createdAt: new Date().toLocaleString()
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    sessionStorage.removeItem('signupFormData');
    showAuthMessage('Account created successfully! You can now login.', 'success', 'signupMessage');

    setTimeout(() => {
        document.getElementById('signupForm').reset();
        generateCaptcha('login');
        toggleForm();
    }, 2000);
}

function showAuthMessage(message, type, elementId) {
    const messageEl = document.getElementById(elementId);
    messageEl.textContent = message;
    messageEl.className = 'auth-message ' + type;
}

function saveFormData() {
    const inputs   = document.querySelectorAll('input, select');
    const formData = {};
    inputs.forEach(input => {
        if (input.type !== 'password' && !input.id.includes('Captcha')) {
            formData[input.id] = input.value;
        }
    });
    sessionStorage.setItem('authFormData', JSON.stringify(formData));
}

function loadFormData() {
    const storedData = sessionStorage.getItem('authFormData');
    if (storedData) {
        const formData = JSON.parse(storedData);
        for (const key in formData) {
            const el = document.getElementById(key);
            if (el) el.value = formData[key];
        }
    }
}

window.addEventListener('load', () => {
    document.getElementById('signupContainer').classList.add('hidden');

    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        showAuthMessage('You are already logged in. Redirecting to home...', 'success', 'loginMessage');
        setTimeout(() => { window.location.href = '/index.html'; }, 2000);
    }

    generateCaptcha('login');
    generateCaptcha('signup');
    loadFormData();

    document.querySelectorAll('input, select').forEach(input => {
        input.addEventListener('input', saveFormData);
    });
});


