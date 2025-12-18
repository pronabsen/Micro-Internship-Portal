// Dashboard JavaScript file for Micro-Internship Portal (User Dashboard)

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (!checkAuthStatus()) return;
    
    // Check role
    if (!requireRole('user')) return;
    
    // Load user data
    loadUserData();
    
    // Setup sidebar navigation
    setupSidebarNavigation();
    
    // Load dashboard overview
    showDashboardOverview();
    
    // Setup event listeners
    setupEventListeners();
});

// Load user data
function loadUserData() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    // Update user name in navigation
    const userNameElement = document.getElementById('userName');
    if (userNameElement) {
        userNameElement.textContent = currentUser.name;
    }
    
    const userFirstNameElement = document.getElementById('userFirstName');
    if (userFirstNameElement) {
        userFirstNameElement.textContent = currentUser.firstName || currentUser.name.split(' ')[0];
    }
}

// Setup sidebar navigation
function setupSidebarNavigation() {
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all items
            menuItems.forEach(mi => mi.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Hide all content sections
            const contentSections = document.querySelectorAll('.dashboard-content');
            contentSections.forEach(section => {
                section.style.display = 'none';
            });
        });
    });
}

// Show dashboard overview
function showDashboardOverview() {
    const overviewSection = document.getElementById('overviewSection');
    if (!overviewSection) return;
    
    overviewSection.style.display = 'block';
    
    // Load user statistics
    loadUserStats();
    
    // Load recent applications
    loadRecentApplications();
    
    // Load recommended internships
    loadRecommendedInternships();
}

// Load user statistics
function loadUserStats() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    // Update stats cards
    const applicationsSent = document.getElementById('applicationsSent');
    const applicationsAccepted = document.getElementById('applicationsAccepted');
    const averageRating = document.getElementById('averageRating');
    const totalPoints = document.getElementById('totalPoints');
    
    if (applicationsSent) applicationsSent.textContent = currentUser.applications || 0;
    if (applicationsAccepted) applicationsAccepted.textContent = currentUser.completed || 0;
    if (averageRating) averageRating.textContent = (currentUser.rating || 0).toFixed(1);
    if (totalPoints) totalPoints.textContent = currentUser.points || 0;
    
    // Update badges
    const applicationsCount = document.getElementById('applicationsCount');
    if (applicationsCount) applicationsCount.textContent = currentUser.applications || 0;
}

// Load recent applications
function loadRecentApplications() {
    const recentApplicationsElement = document.getElementById('recentApplications');
    if (!recentApplicationsElement) return;
    
    const currentUser = getCurrentUser();
    const applications = getApplications();
    const internships = getInternships();
    
    // Get user's applications
    const userApplications = applications.filter(app => app.userId === currentUser.id)
        .sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate))
        .slice(0, 5);
    
    if (userApplications.length === 0) {
        recentApplicationsElement.innerHTML = '<p>No applications yet. Start applying for internships!</p>';
        return;
    }
    
    recentApplicationsElement.innerHTML = '';
    userApplications.forEach(application => {
        const internship = internships.find(i => i.id === application.internshipId);
        if (!internship) return;
        
        const applicationCard = document.createElement('div');
        applicationCard.className = 'application-card';
        applicationCard.innerHTML = `
            <div class="application-header">
                <h4>${internship.title}</h4>
                <span class="application-status ${application.status}">${formatStatus(application.status)}</span>
            </div>
            <p class="application-company">${internship.company}</p>
            <p class="application-date">Applied: ${formatDate(application.appliedDate)}</p>
        `;
        recentApplicationsElement.appendChild(applicationCard);
    });
}

// Load recommended internships
function loadRecommendedInternships() {
    const recommendedInternshipsElement = document.getElementById('recommendedInternships');
    if (!recommendedInternshipsElement) return;
    
    const currentUser = getCurrentUser();
    const internships = getInternships();
    const applications = getApplications();
    
    // Get internships user hasn't applied for
    const userApplicationIds = applications
        .filter(app => app.userId === currentUser.id)
        .map(app => app.internshipId);
    
    const recommendedInternships = internships
        .filter(internship => !userApplicationIds.includes(internship.id))
        .slice(0, 3);
    
    if (recommendedInternships.length === 0) {
        recommendedInternshipsElement.innerHTML = '<p>No new recommendations at the moment.</p>';
        return;
    }
    
    recommendedInternshipsElement.innerHTML = '';
    recommendedInternships.forEach(internship => {
        const internshipCard = document.createElement('div');
        internshipCard.className = 'internship-card';
        internshipCard.innerHTML = `
            <h4>${internship.title}</h4>
            <p class="internship-company">${internship.company}</p>
            <p class="internship-category">${formatCategory(internship.category)}</p>
            <div class="internship-meta">
                <span><i class="fas fa-clock"></i> ${formatDuration(internship.duration)}</span>
                <span><i class="fas fa-dollar-sign"></i> ${internship.stipend || 'Unpaid'}</span>
            </div>
            <button class="btn btn-primary btn-sm" onclick="viewInternshipDetails(${internship.id})">
                View Details
            </button>
        `;
        recommendedInternshipsElement.appendChild(internshipCard);
    });
}

// Show my applications
function showMyApplications() {
    const applicationsSection = document.getElementById('applicationsSection');
    if (!applicationsSection) return;
    
    applicationsSection.style.display = 'block';
    
    const currentUser = getCurrentUser();
    const applications = getApplications();
    const internships = getInternships();
    
    // Get user's applications
    const userApplications = applications.filter(app => app.userId === currentUser.id)
        .sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate));
    
    const applicationsList = document.getElementById('applicationsList');
    if (!applicationsList) return;
    
    if (userApplications.length === 0) {
        applicationsList.innerHTML = '<p>You haven\'t applied for any internships yet.</p>';
        return;
    }
    
    applicationsList.innerHTML = '';
    userApplications.forEach(application => {
        const internship = internships.find(i => i.id === application.internshipId);
        if (!internship) return;
        
        const applicationCard = document.createElement('div');
        applicationCard.className = 'application-card';
        applicationCard.innerHTML = `
            <div class="application-header">
                <div>
                    <h3>${internship.title}</h3>
                    <p class="application-company">${internship.company}</p>
                </div>
                <span class="application-status ${application.status}">${formatStatus(application.status)}</span>
            </div>
            <div class="application-details">
                <p><strong>Applied:</strong> ${formatDate(application.appliedDate)}</p>
                <p><strong>Category:</strong> ${formatCategory(internship.category)}</p>
                <p><strong>Duration:</strong> ${formatDuration(internship.duration)}</p>
                <p><strong>Stipend:</strong> ${internship.stipend ? `$${internship.stipend}/month` : 'Unpaid'}</p>
                <p><strong>Cover Letter:</strong> ${application.coverLetter}</p>
                <p><strong>Availability:</strong> ${application.availability}</p>
            </div>
            <div class="application-actions">
                <button class="btn btn-outline btn-sm" onclick="viewInternshipDetails(${internship.id})">
                    View Internship
                </button>
                ${application.status === 'pending' ? `
                    <button class="btn btn-outline btn-sm" onclick="withdrawApplication(${application.id})">
                        Withdraw
                    </button>
                ` : ''}
            </div>
        `;
        applicationsList.appendChild(applicationCard);
    });
}

// Show my profile
function showMyProfile() {
    const profileSection = document.getElementById('profileSection');
    if (!profileSection) return;
    
    profileSection.style.display = 'block';
    
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    // Update profile information
    const profileName = document.getElementById('profileName');
    const profileEmail = document.getElementById('profileEmail');
    const profilePhone = document.getElementById('profilePhone');
    const profileApplications = document.getElementById('profileApplications');
    const profileCompleted = document.getElementById('profileCompleted');
    const profileRating = document.getElementById('profileRating');
    
    if (profileName) profileName.textContent = currentUser.name;
    if (profileEmail) profileEmail.textContent = currentUser.email;
    if (profilePhone) profilePhone.textContent = currentUser.phone || 'Not provided';
    if (profileApplications) profileApplications.textContent = currentUser.applications || 0;
    if (profileCompleted) profileCompleted.textContent = currentUser.completed || 0;
    if (profileRating) profileRating.textContent = (currentUser.rating || 0).toFixed(1);
    
    // Load profile form data
    const bioField = document.getElementById('bio');
    const skillsField = document.getElementById('skills');
    const educationField = document.getElementById('education');
    const experienceField = document.getElementById('experience');
    
    if (bioField) bioField.value = currentUser.bio || '';
    if (skillsField) skillsField.value = currentUser.skills || '';
    if (educationField) educationField.value = currentUser.education || '';
    if (experienceField) experienceField.value = currentUser.experience || '';
}

// Show my reviews
function showMyReviews() {
    const reviewsSection = document.getElementById('reviewsSection');
    if (!reviewsSection) return;
    
    reviewsSection.style.display = 'block';
    
    const currentUser = getCurrentUser();
    const reviews = getReviews();
    const internships = getInternships();
    
    // Get user's reviews
    const userReviews = reviews.filter(review => review.userId === currentUser.id);
    
    const reviewsList = document.getElementById('reviewsList');
    if (!reviewsList) return;
    
    if (userReviews.length === 0) {
        reviewsList.innerHTML = '<p>You haven\'t received any reviews yet.</p>';
        return;
    }
    
    reviewsList.innerHTML = '';
    userReviews.forEach(review => {
        const internship = internships.find(i => i.id === review.internshipId);
        if (!internship) return;
        
        const reviewCard = document.createElement('div');
        reviewCard.className = 'review-card';
        reviewCard.innerHTML = `
            <div class="review-header">
                <div>
                    <h4>${internship.title}</h4>
                    <p class="review-company">${internship.company}</p>
                </div>
                <div class="review-rating">
                    ${generateStarRating(review.rating)}
                </div>
            </div>
            <p class="review-date">${formatDate(review.date)}</p>
            <p class="review-feedback">${review.feedback}</p>
        `;
        reviewsList.appendChild(reviewCard);
    });
}

// Show leaderboard
function showLeaderboard() {
    const leaderboardSection = document.getElementById('leaderboardSection');
    if (!leaderboardSection) return;
    
    leaderboardSection.style.display = 'block';
    
    const users = getUsers();
    const currentUser = getCurrentUser();
    
    // Filter only users (not employers or admins) and sort by points
    const leaderboardUsers = users
        .filter(user => user.role === 'user')
        .sort((a, b) => (b.points || 0) - (a.points || 0))
        .slice(0, 20);
    
    const leaderboardList = document.getElementById('leaderboardList');
    if (!leaderboardList) return;
    
    leaderboardList.innerHTML = '';
    leaderboardUsers.forEach((user, index) => {
        const leaderboardItem = document.createElement('div');
        leaderboardItem.className = 'leaderboard-item';
        if (user.id === currentUser.id) {
            leaderboardItem.classList.add('current-user');
        }
        
        let rankIcon = '';
        if (index === 0) rankIcon = '🥇';
        else if (index === 1) rankIcon = '🥈';
        else if (index === 2) rankIcon = '🥉';
        else rankIcon = `${index + 1}`;
        
        leaderboardItem.innerHTML = `
            <div class="leaderboard-rank">
                <span class="rank-number">${rankIcon}</span>
            </div>
            <div class="leaderboard-user">
                <h4>${user.name}</h4>
                <p>Completed: ${user.completed || 0} internships</p>
            </div>
            <div class="leaderboard-stats">
                <div class="leaderboard-points">
                    <strong>${user.points || 0}</strong>
                    <span>Points</span>
                </div>
                <div class="leaderboard-rating">
                    <strong>${(user.rating || 0).toFixed(1)}</strong>
                    <span>Rating</span>
                </div>
            </div>
        `;
        leaderboardList.appendChild(leaderboardItem);
    });
}

// Show settings
function showSettings() {
    const settingsSection = document.getElementById('settingsSection');
    if (!settingsSection) return;
    
    settingsSection.style.display = 'block';
}

// Filter applications
function filterApplications(status) {
    const filterBtns = document.querySelectorAll('.applications-filters .filter-btn');
    filterBtns.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    const applicationCards = document.querySelectorAll('.application-card');
    applicationCards.forEach(card => {
        if (status === 'all') {
            card.style.display = 'block';
        } else {
            const cardStatus = card.querySelector('.application-status').classList.contains(status);
            card.style.display = cardStatus ? 'block' : 'none';
        }
    });
}

// Filter leaderboard
function filterLeaderboard(period) {
    const filterBtns = document.querySelectorAll('.leaderboard-filters .filter-btn');
    filterBtns.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // In a real application, this would filter based on the time period
    // For now, we'll just show the same data
    showLeaderboard();
}

// Handle profile form submission
function setupEventListeners() {
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', handleProfileUpdate);
    }
    
    const accountSettingsForm = document.getElementById('accountSettingsForm');
    if (accountSettingsForm) {
        accountSettingsForm.addEventListener('submit', handleAccountSettingsUpdate);
    }
    
    const notificationSettingsForm = document.getElementById('notificationSettingsForm');
    if (notificationSettingsForm) {
        notificationSettingsForm.addEventListener('submit', handleNotificationSettingsUpdate);
    }
}

// Handle profile update
function handleProfileUpdate(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const currentUser = getCurrentUser();
    
    const updatedUser = {
        ...currentUser,
        bio: formData.get('bio'),
        skills: formData.get('skills'),
        education: formData.get('education'),
        experience: formData.get('experience')
    };
    
    // Update user in localStorage
    updateUser(updatedUser);
    
    // Update current user
    setCurrentUser(updatedUser);
    
    alert('Profile updated successfully!');
}

// Handle account settings update
function handleAccountSettingsUpdate(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const currentPassword = formData.get('currentPassword');
    const newPassword = formData.get('newPassword');
    const confirmNewPassword = formData.get('confirmNewPassword');
    
    const currentUser = getCurrentUser();
    
    // Verify current password
    if (currentPassword !== currentUser.password) {
        alert('Current password is incorrect.');
        return;
    }
    
    // Validate new password
    if (!validatePassword(newPassword)) {
        alert('New password must be at least 8 characters long.');
        return;
    }
    
    if (newPassword !== confirmNewPassword) {
        alert('New passwords do not match.');
        return;
    }
    
    // Update password
    const updatedUser = {
        ...currentUser,
        password: newPassword
    };
    
    updateUser(updatedUser);
    setCurrentUser(updatedUser);
    
    alert('Password updated successfully!');
    
    // Clear form
    e.target.reset();
}

// Handle notification settings update
function handleNotificationSettingsUpdate(e) {
    e.preventDefault();
    
    // In a real application, this would save notification preferences
    alert('Notification settings updated successfully!');
}

// Withdraw application
function withdrawApplication(applicationId) {
    if (!confirm('Are you sure you want to withdraw this application?')) {
        return;
    }
    
    const applications = getApplications();
    const applicationIndex = applications.findIndex(app => app.id === applicationId);
    
    if (applicationIndex !== -1) {
        applications.splice(applicationIndex, 1);
        localStorage.setItem('applications', JSON.stringify(applications));
        
        alert('Application withdrawn successfully.');
        showMyApplications(); // Refresh the applications list
    }
}

// Change avatar
function changeAvatar() {
    // In a real application, this would open a file picker
    alert('Avatar upload would be implemented here.');
}

// Utility functions
function formatStatus(status) {
    const statusMap = {
        'pending': 'Pending',
        'accepted': 'Accepted',
        'rejected': 'Rejected',
        'completed': 'Completed'
    };
    return statusMap[status] || status;
}

function generateStarRating(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<i class="fas fa-star"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    return stars;
}
function formatDate(dateString) {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

function formatCategory(category) {
    return category.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

function formatDuration(duration) {
    const durationMap = {
        '1-week': '1 Week',
        '2-weeks': '2 Weeks',
        '1-month': '1 Month',
        '2-months': '2 Months',
        '3-months': '3 Months',
        '6-weeks': '6 Weeks'
    };
    return durationMap[duration] || duration;
}

function formatWorkType(workType) {
    const workTypeMap = {
        'remote': 'Remote',
        'onsite': 'On-site',
        'hybrid': 'Hybrid'
    };
    return workTypeMap[workType] || workType;
}

function formatStatus(status) {
    const statusMap = {
        'pending': 'Pending',
        'accepted': 'Accepted',
        'rejected': 'Rejected',
        'completed': 'Completed'
    };
    return statusMap[status] || status;
}

function generateStarRating(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<i class="fas fa-star"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    return stars;
}

// Check if user exists
function userExists(email) {
    const users = getUsers();
    return users.some(user => user.email === email);
}

// Data access functions
function getApplications() {
    const applicationsJson = localStorage.getItem('applications');
    return applicationsJson ? JSON.parse(applicationsJson) : [];
}

function getInternships() {
    const internshipsJson = localStorage.getItem('internships');
    return internshipsJson ? JSON.parse(internshipsJson) : [];
}

function getUsers() {
    const usersJson = localStorage.getItem('users');
    return usersJson ? JSON.parse(usersJson) : [];
}

function getReviews() {
    const reviewsJson = localStorage.getItem('reviews');
    return reviewsJson ? JSON.parse(reviewsJson) : [];
}

function updateUser(user) {
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === user.id);
    
    if (userIndex !== -1) {
        users[userIndex] = user;
        localStorage.setItem('users', JSON.stringify(users));
    }
}

// Export functions for use in other files
window.showDashboardOverview = showDashboardOverview;
window.showMyApplications = showMyApplications;
window.showMyProfile = showMyProfile;
window.showMyReviews = showMyReviews;
window.showLeaderboard = showLeaderboard;
window.showSettings = showSettings;
window.filterApplications = filterApplications;
window.filterLeaderboard = filterLeaderboard;
window.withdrawApplication = withdrawApplication;
window.changeAvatar = changeAvatar;