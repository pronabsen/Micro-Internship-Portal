// Authentication JavaScript file for Micro-Internship Portal

// User registration
document.addEventListener('DOMContentLoaded', function() {
    // Handle user registration form
    const userRegisterForm = document.getElementById('userRegisterForm');
    if (userRegisterForm) {
        userRegisterForm.addEventListener('submit', handleUserRegistration);
    }
    
    // Handle employer registration form
    const employerRegisterForm = document.getElementById('employerRegisterForm');
    if (employerRegisterForm) {
        employerRegisterForm.addEventListener('submit', handleEmployerRegistration);
    }
    
    // Handle login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Handle user type selection
    setupUserTypeSelection();
    
    // Check for hash in URL for employer registration
    if (window.location.hash === '#employer') {
        selectUserType('employer');
    }
});

// Setup user type selection
function setupUserTypeSelection() {
    const userTypeBtns = document.querySelectorAll('.user-type-btn');
    userTypeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const type = this.getAttribute('data-type');
            selectUserType(type);
        });
    });
}

// Select user type
function selectUserType(type) {
    const userTypeBtns = document.querySelectorAll('.user-type-btn');
    const userForm = document.getElementById('userRegisterForm');
    const employerForm = document.getElementById('employerRegisterForm');
    
    userTypeBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-type') === type) {
            btn.classList.add('active');
        }
    });
    
    if (type === 'user') {
        userForm.style.display = 'block';
        employerForm.style.display = 'none';
    } else {
        userForm.style.display = 'none';
        employerForm.style.display = 'block';
    }
}

// Handle user registration
function handleUserRegistration(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const userData = {
        id: generateId(),
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        name: `${formData.get('firstName')} ${formData.get('lastName')}`,
        email: formData.get('email'),
        phone: formData.get('phone'),
        password: formData.get('password'),
        role: 'user',
        bio: '',
        skills: '',
        education: '',
        experience: '',
        resume: '',
        applications: 0,
        completed: 0,
        rating: 0,
        points: 0,
        joinedDate: new Date().toISOString().split('T')[0],
        status: 'active'
    };
    
    // Validate form data
    if (!validateRegistrationData(userData)) {
        return;
    }
    
    // Check if user already exists
    if (userExists(userData.email)) {
        alert('A user with this email already exists. Please use a different email or login.');
        return;
    }
    
    // Save user to localStorage
    saveUser(userData);
    
    // Show success message
    alert('Registration successful! You can now login.');
    
    // Redirect to login page
    window.location.href = 'login.html';
}

// Handle employer registration
function handleEmployerRegistration(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const employerData = {
        id: generateId(),
        companyName: formData.get('companyName'),
        website: formData.get('companyWebsite'),
        industry: formData.get('industry'),
        companySize: formData.get('companySize'),
        contactPerson: formData.get('contactPerson'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        password: formData.get('password'),
        role: 'employer',
        verified: false,
        description: '',
        location: '',
        culture: '',
        internshipsPosted: 0,
        internsHired: 0,
        rating: 0,
        joinedDate: new Date().toISOString().split('T')[0],
        status: 'pending_verification'
    };
    
    // Validate form data
    if (!validateEmployerRegistrationData(employerData)) {
        return;
    }
    
    // Check if employer already exists
    if (userExists(employerData.email)) {
        alert('A company with this email already exists. Please use a different email or login.');
        return;
    }
    
    // Save employer to localStorage
    saveUser(employerData);
    
    // Show success message
    alert('Registration successful! Your account is pending verification. You will be notified once verified.');
    
    // Redirect to login page
    window.location.href = 'login.html';
}

// Handle login
function handleLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    
    // Validate input
    if (!email || !password) {
        alert('Please enter both email and password.');
        return;
    }
    
    // Find user in localStorage
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
        alert('Invalid email or password. Please try again.');
        return;
    }
    
    // Check if employer is verified
    if (user.role === 'employer' && !user.verified) {
        alert('Your employer account is pending verification. Please wait for admin approval.');
        return;
    }
    
    // Check if user is active
    if (user.status === 'suspended') {
        alert('Your account has been suspended. Please contact support.');
        return;
    }
    
    // Set current user
    setCurrentUser(user);
    
    // Redirect based on role
    if (user.role === 'admin') {
        window.location.href = 'admin-dashboard.html';
    } else if (user.role === 'employer') {
        window.location.href = 'employer-dashboard.html';
    } else {
        window.location.href = 'dashboard.html';
    }
}

// Validate registration data
function validateRegistrationData(userData) {
    if (!userData.firstName || !userData.lastName) {
        alert('Please enter your first and last name.');
        return false;
    }
    
    if (!validateEmail(userData.email)) {
        alert('Please enter a valid email address.');
        return false;
    }
    
    if (!validatePassword(userData.password)) {
        alert('Password must be at least 8 characters long.');
        return false;
    }
    
    const confirmPassword = document.getElementById('confirmPassword').value;
    if (userData.password !== confirmPassword) {
        alert('Passwords do not match.');
        return false;
    }
    
    const termsAccepted = document.querySelector('input[name="terms"]').checked;
    if (!termsAccepted) {
        alert('Please accept the terms and conditions.');
        return false;
    }
    
    return true;
}

// Validate employer registration data
function validateEmployerRegistrationData(employerData) {
    if (!employerData.companyName) {
        alert('Please enter your company name.');
        return false;
    }
    
    if (!employerData.industry) {
        alert('Please select your industry.');
        return false;
    }
    
    if (!employerData.companySize) {
        alert('Please select your company size.');
        return false;
    }
    
    if (!employerData.contactPerson) {
        alert('Please enter the contact person name.');
        return false;
    }
    
    if (!validateEmail(employerData.email)) {
        alert('Please enter a valid email address.');
        return false;
    }
    
    if (!validatePassword(employerData.password)) {
        alert('Password must be at least 8 characters long.');
        return false;
    }
    
    const confirmPassword = document.getElementById('confirmPassword').value;
    if (employerData.password !== confirmPassword) {
        alert('Passwords do not match.');
        return false;
    }
    
    const termsAccepted = document.querySelector('input[name="terms"]').checked;
    if (!termsAccepted) {
        alert('Please accept the terms and conditions.');
        return false;
    }
    
    return true;
}
// Utility functions
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePassword(password) {
    return password.length >= 8;
}


// Check if user exists
function userExists(email) {
    const users = getUsers();
    return users.some(user => user.email === email);
}

// Get all users from localStorage
function getUsers() {
    const usersJson = localStorage.getItem('users');
    return usersJson ? JSON.parse(usersJson) : [];
}

// Save user to localStorage
function saveUser(user) {
    const users = getUsers();
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
}

// Set current user
function setCurrentUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    window.currentUser = user;
}

// Get current user
function getCurrentUser() {
    const userJson = localStorage.getItem('currentUser');
    return userJson ? JSON.parse(userJson) : null;
}

// Toggle password visibility
function togglePassword(fieldId) {
    const passwordField = document.getElementById(fieldId);
    const toggleButton = passwordField.nextElementSibling;
    const icon = toggleButton.querySelector('i');
    
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        passwordField.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Social login handlers
function handleGoogleLogin() {
    // In a real application, this would integrate with Google OAuth
    alert('Google login integration would be implemented here.');
}

function handleLinkedInLogin() {
    // In a real application, this would integrate with LinkedIn OAuth
    alert('LinkedIn login integration would be implemented here.');
}

// Forgot password handler
function handleForgotPassword() {
    const email = prompt('Enter your email address:');
    if (email && validateEmail(email)) {
        // In a real application, this would send a password reset email
        alert(`Password reset link would be sent to ${email}`);
    } else {
        alert('Please enter a valid email address.');
    }
}

// Logout function
function logout() {
    localStorage.removeItem('currentUser');
    window.currentUser = null;
    
    // Redirect to home page
    window.location.href = 'index.html';
}

// Check authentication status
function checkAuthStatus() {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        // Redirect to login if not authenticated
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Role-based access control
function requireRole(requiredRole) {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        window.location.href = 'login.html';
        return false;
    }
    
    if (currentUser.role !== requiredRole && currentUser.role !== 'admin') {
        alert('You do not have permission to access this page.');
        window.location.href = 'index.html';
        return false;
    }
    
    return true;
}

// Export functions for use in other files
window.selectUserType = selectUserType;
window.togglePassword = togglePassword;
window.handleGoogleLogin = handleGoogleLogin;
window.handleLinkedInLogin = handleLinkedInLogin;
window.handleForgotPassword = handleForgotPassword;
window.logout = logout;
window.checkAuthStatus = checkAuthStatus;
window.requireRole = requireRole;
window.getCurrentUser = getCurrentUser;