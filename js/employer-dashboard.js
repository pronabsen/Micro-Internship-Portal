// Employer Dashboard JavaScript file for Micro-Internship Portal

// Initialize employer dashboard
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (!checkAuthStatus()) return;
    
    // Check role
    if (!requireRole('employer')) return;
    
    // Load employer data
    loadEmployerData();
    
    // Setup sidebar navigation
    setupSidebarNavigation();
    
    // Load dashboard overview
    showEmployerOverview();
    
    // Setup event listeners
    setupEventListeners();
});

// Load employer data
function loadEmployerData() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    // Update company name in navigation
    const companyNameElement = document.getElementById('companyName');
    if (companyNameElement) {
        companyNameElement.textContent = currentUser.companyName;
    }
    
    const companyNameHeaderElement = document.getElementById('companyNameHeader');
    if (companyNameHeaderElement) {
        companyNameHeaderElement.textContent = currentUser.companyName;
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

// Show employer overview
function showEmployerOverview() {
    const overviewSection = document.getElementById('employerOverviewSection');
    if (!overviewSection) return;
    
    overviewSection.style.display = 'block';
    
    // Load employer statistics
    loadEmployerStats();
    
    // Load recent applications
    loadRecentApplications();
}

// Load employer statistics
function loadEmployerStats() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    const internships = getInternships();
    const applications = getApplications();
    
    // Get employer's internships
    const employerInternships = internships.filter(internship => 
        internship.employerId === currentUser.id
    );
    
    // Get employer's applications
    const employerApplications = applications.filter(application => {
        const internship = internships.find(i => i.id === application.internshipId);
        return internship && internship.employerId === currentUser.id;
    });
    
    // Calculate stats
    const activeInternships = employerInternships.filter(i => i.status === 'active').length;
    const totalApplicants = employerApplications.length;
    const hiredInterns = employerApplications.filter(a => a.status === 'completed').length;
    const companyRating = currentUser.rating || 0;
    
    // Update stats cards
    const activeInternshipsElement = document.getElementById('activeInternships');
    const totalApplicantsElement = document.getElementById('totalApplicants');
    const hiredInternsElement = document.getElementById('hiredInterns');
    const companyRatingElement = document.getElementById('companyRating');
    
    if (activeInternshipsElement) activeInternshipsElement.textContent = activeInternships;
    if (totalApplicantsElement) totalApplicantsElement.textContent = totalApplicants;
    if (hiredInternsElement) hiredInternsElement.textContent = hiredInterns;
    if (companyRatingElement) companyRatingElement.textContent = companyRating.toFixed(1);
    
    // Update badges
    const internshipsCountElement = document.getElementById('internshipsCount');
    const applicantsCountElement = document.getElementById('applicantsCount');
    
    if (internshipsCountElement) internshipsCountElement.textContent = employerInternships.length;
    if (applicantsCountElement) applicantsCountElement.textContent = totalApplicants;
}

// Load recent applications
function loadRecentApplications() {
    const recentApplicationsElement = document.getElementById('recentApplications');
    if (!recentApplicationsElement) return;
    
    const currentUser = getCurrentUser();
    const applications = getApplications();
    const internships = getInternships();
    const users = getUsers();
    
    // Get employer's applications
    const employerApplications = applications.filter(application => {
        const internship = internships.find(i => i.id === application.internshipId);
        return internship && internship.employerId === currentUser.id;
    }).sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate)).slice(0, 5);
    
    if (employerApplications.length === 0) {
        recentApplicationsElement.innerHTML = '<p>No applications yet. Post an internship to start receiving applications!</p>';
        return;
    }
    
    recentApplicationsElement.innerHTML = '';
    employerApplications.forEach(application => {
        const internship = internships.find(i => i.id === application.internshipId);
        const user = users.find(u => u.id === application.userId);
        
        if (!internship || !user) return;
        
        const applicationCard = document.createElement('div');
        applicationCard.className = 'application-card';
        applicationCard.innerHTML = `
            <div class="application-header">
                <div>
                    <h4>${user.name}</h4>
                    <p class="application-internship">${internship.title}</p>
                </div>
                <span class="application-status ${application.status}">${formatStatus(application.status)}</span>
            </div>
            <p class="application-date">Applied: ${formatDate(application.appliedDate)}</p>
            <div class="application-actions">
                <button class="btn btn-primary btn-sm" onclick="viewApplicantProfile(${application.id})">
                    View Profile
                </button>
                ${application.status === 'pending' ? `
                    <button class="btn btn-outline btn-sm" onclick="acceptApplication(${application.id})">
                        Accept
                    </button>
                    <button class="btn btn-outline btn-sm" onclick="rejectApplication(${application.id})">
                        Reject
                    </button>
                ` : ''}
            </div>
        `;
        recentApplicationsElement.appendChild(applicationCard);
    });
}

// Show my internships
function showMyInternships() {
    const myInternshipsSection = document.getElementById('myInternshipsSection');
    if (!myInternshipsSection) return;
    
    myInternshipsSection.style.display = 'block';
    
    const currentUser = getCurrentUser();
    const internships = getInternships();
    const applications = getApplications();
    
    // Get employer's internships
    const employerInternships = internships.filter(internship => 
        internship.employerId === currentUser.id
    );
    
    const internshipsList = document.getElementById('internshipsList');
    if (!internshipsList) return;
    
    if (employerInternships.length === 0) {
        internshipsList.innerHTML = '<p>You haven\'t posted any internships yet.</p>';
        return;
    }
    
    internshipsList.innerHTML = '';
    employerInternships.forEach(internship => {
        const internshipApplications = applications.filter(app => app.internshipId === internship.id);
        
        const internshipCard = document.createElement('div');
        internshipCard.className = 'internship-card';
        internshipCard.innerHTML = `
            <div class="internship-header">
                <div>
                    <h3>${internship.title}</h3>
                    <p class="internship-category">${formatCategory(internship.category)}</p>
                </div>
                <span class="internship-status ${internship.status}">${formatInternshipStatus(internship.status)}</span>
            </div>
            <p class="internship-description">${internship.description}</p>
            <div class="internship-meta">
                <span><i class="fas fa-clock"></i> ${formatDuration(internship.duration)}</span>
                <span><i class="fas fa-dollar-sign"></i> ${internship.stipend || 'Unpaid'}</span>
                <span><i class="fas fa-users"></i> ${internshipApplications.length} Applications</span>
            </div>
            <div class="internship-actions">
                <button class="btn btn-outline btn-sm" onclick="viewInternshipDetails(${internship.id})">
                    View Details
                </button>
                <button class="btn btn-outline btn-sm" onclick="viewApplicants(${internship.id})">
                    View Applicants
                </button>
                <button class="btn btn-outline btn-sm" onclick="editInternship(${internship.id})">
                    Edit
                </button>
                ${internship.status === 'active' ? `
                    <button class="btn btn-outline btn-sm" onclick="closeInternship(${internship.id})">
                        Close
                    </button>
                ` : ''}
            </div>
        `;
        internshipsList.appendChild(internshipCard);
    });
}

// Show applicants
function showApplicants() {
    const applicantsSection = document.getElementById('applicantsSection');
    if (!applicantsSection) return;
    
    applicantsSection.style.display = 'block';
    
    const currentUser = getCurrentUser();
    const applications = getApplications();
    const internships = getInternships();
    const users = getUsers();
    
    // Get employer's applications
    const employerApplications = applications.filter(application => {
        const internship = internships.find(i => i.id === application.internshipId);
        return internship && internship.employerId === currentUser.id;
    });
    
    // Populate internship filter
    const internshipFilter = document.getElementById('internshipFilter');
    if (internshipFilter) {
        const employerInternships = internships.filter(i => i.employerId === currentUser.id);
        internshipFilter.innerHTML = '<option value="">All Internships</option>';
        employerInternships.forEach(internship => {
            internshipFilter.innerHTML += `<option value="${internship.id}">${internship.title}</option>`;
        });
    }
    
    const applicantsList = document.getElementById('applicantsList');
    if (!applicantsList) return;
    
    if (employerApplications.length === 0) {
        applicantsList.innerHTML = '<p>No applications yet.</p>';
        return;
    }
    
    displayApplicants(employerApplications);
}

// Display applicants
function displayApplicants(applications) {
    const applicantsList = document.getElementById('applicantsList');
    const internships = getInternships();
    const users = getUsers();
    
    applicantsList.innerHTML = '';
    applications.forEach(application => {
        const internship = internships.find(i => i.id === application.internshipId);
        const user = users.find(u => u.id === application.userId);
        
        if (!internship || !user) return;
        
        const applicantCard = document.createElement('div');
        applicantCard.className = 'applicant-card';
        applicantCard.innerHTML = `
            <div class="applicant-header">
                <div>
                    <h3>${user.name}</h3>
                    <p class="applicant-email">${user.email}</p>
                    <p class="applicant-internship">Applied for: ${internship.title}</p>
                </div>
                <div class="applicant-actions">
                    <span class="application-status ${application.status}">${formatStatus(application.status)}</span>
                    ${application.status === 'pending' ? `
                        <button class="btn btn-primary btn-sm" onclick="acceptApplication(${application.id})">
                            Accept
                        </button>
                        <button class="btn btn-outline btn-sm" onclick="rejectApplication(${application.id})">
                            Reject
                        </button>
                    ` : ''}
                </div>
            </div>
            <div class="applicant-details">
                <p><strong>Skills:</strong> ${user.skills || 'Not specified'}</p>
                <p><strong>Education:</strong> ${user.education || 'Not specified'}</p>
                <p><strong>Experience:</strong> ${user.experience || 'Not specified'}</p>
                <p><strong>Rating:</strong> ${generateStarRating(user.rating || 0)}</p>
                <p><strong>Cover Letter:</strong> ${application.coverLetter}</p>
                <p><strong>Availability:</strong> ${application.availability}</p>
                <p><strong>Applied:</strong> ${formatDate(application.appliedDate)}</p>
            </div>
            <div class="applicant-footer">
                <button class="btn btn-outline btn-sm" onclick="viewApplicantProfile(${application.id})">
                    View Full Profile
                </button>
                <button class="btn btn-outline btn-sm" onclick="contactApplicant(${application.id})">
                    Contact
                </button>
            </div>
        `;
        applicantsList.appendChild(applicantCard);
    });
}

// Show post internship form
function showPostInternship() {
    const postInternshipSection = document.getElementById('postInternshipSection');
    if (!postInternshipSection) return;
    
    postInternshipSection.style.display = 'block';
    
    // Set minimum date for start date and deadline
    const today = new Date().toISOString().split('T')[0];
    const startDateInput = document.getElementById('startDate');
    const deadlineInput = document.getElementById('applicationDeadline');
    
    if (startDateInput) startDateInput.min = today;
    if (deadlineInput) deadlineInput.min = today;
}

// Show company profile
function showCompanyProfile() {
    const companyProfileSection = document.getElementById('companyProfileSection');
    if (!companyProfileSection) return;
    
    companyProfileSection.style.display = 'block';
    
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    // Update company information
    const companyProfileName = document.getElementById('companyProfileName');
    const companyIndustry = document.getElementById('companyIndustry');
    const companySize = document.getElementById('companySize');
    const companyWebsite = document.getElementById('companyWebsite');
    const companyInternships = document.getElementById('companyInternships');
    const companyHires = document.getElementById('companyHires');
    const companyAvgRating = document.getElementById('companyAvgRating');
    
    if (companyProfileName) companyProfileName.textContent = currentUser.companyName;
    if (companyIndustry) companyIndustry.textContent = currentUser.industry || 'Not specified';
    if (companySize) companySize.textContent = currentUser.companySize || 'Not specified';
    if (companyWebsite) companyWebsite.textContent = currentUser.website || 'Not specified';
    if (companyInternships) companyInternships.textContent = currentUser.internshipsPosted || 0;
    if (companyHires) companyHires.textContent = currentUser.internsHired || 0;
    if (companyAvgRating) companyAvgRating.textContent = (currentUser.rating || 0).toFixed(1);
    
    // Load company profile form
    const companyNameField = document.getElementById('companyName');
    const companyDescriptionField = document.getElementById('companyDescription');
    const industryField = document.getElementById('companyIndustry');
    const companySizeField = document.getElementById('companySize');
    const websiteField = document.getElementById('companyWebsite');
    const locationField = document.getElementById('companyLocation');
    const cultureField = document.getElementById('companyCulture');
    
    if (companyNameField) companyNameField.value = currentUser.companyName || '';
    if (companyDescriptionField) companyDescriptionField.value = currentUser.description || '';
    if (industryField) industryField.value = currentUser.industry || '';
    if (companySizeField) companySizeField.value = currentUser.companySize || '';
    if (websiteField) websiteField.value = currentUser.website || '';
    if (locationField) locationField.value = currentUser.location || '';
    if (cultureField) cultureField.value = currentUser.culture || '';
}

// Show reviews
function showReviews() {
    const reviewsSection = document.getElementById('reviewsSection');
    if (!reviewsSection) return;
    
    reviewsSection.style.display = 'block';
    
    const currentUser = getCurrentUser();
    const reviews = getReviews();
    const internships = getInternships();
    const users = getUsers();
    
    // Get employer's reviews
    const employerReviews = reviews.filter(review => {
        const internship = internships.find(i => i.id === review.internshipId);
        return internship && internship.employerId === currentUser.id;
    });
    
    const reviewsList = document.getElementById('companyReviewsList');
    if (!reviewsList) return;
    
    if (employerReviews.length === 0) {
        reviewsList.innerHTML = '<p>You haven\'t received any reviews yet.</p>';
        return;
    }
    
    reviewsList.innerHTML = '';
    employerReviews.forEach(review => {
        const internship = internships.find(i => i.id === review.internshipId);
        const user = users.find(u => u.id === review.userId);
        
        if (!internship || !user) return;
        
        const reviewCard = document.createElement('div');
        reviewCard.className = 'review-card';
        reviewCard.innerHTML = `
            <div class="review-header">
                <div>
                    <h4>${user.name}</h4>
                    <p class="review-internship">${internship.title}</p>
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

// Show settings
function showSettings() {
    const settingsSection = document.getElementById('employerSettingsSection');
    if (!settingsSection) return;
    
    settingsSection.style.display = 'block';
}

// Setup event listeners
function setupEventListeners() {
    // Internship form
    const internshipForm = document.getElementById('internshipForm');
    if (internshipForm) {
        internshipForm.addEventListener('submit', handleInternshipSubmission);
    }
    
    // Company profile form
    const companyProfileForm = document.getElementById('companyProfileForm');
    if (companyProfileForm) {
        companyProfileForm.addEventListener('submit', handleCompanyProfileUpdate);
    }
    
    // Account settings form
    const employerAccountSettingsForm = document.getElementById('employerAccountSettingsForm');
    if (employerAccountSettingsForm) {
        employerAccountSettingsForm.addEventListener('submit', handleAccountSettingsUpdate);
    }
    
    // Notification settings form
    const employerNotificationSettingsForm = document.getElementById('employerNotificationSettingsForm');
    if (employerNotificationSettingsForm) {
        employerNotificationSettingsForm.addEventListener('submit', handleNotificationSettingsUpdate);
    }
}

// Handle internship submission
function handleInternshipSubmission(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const currentUser = getCurrentUser();
    
    const internship = {
        id: generateId(),
        employerId: currentUser.id,
        title: formData.get('title'),
        category: formData.get('category'),
        description: formData.get('description'),
        skillsRequired: formData.get('skillsRequired'),
        duration: formData.get('duration'),
        stipend: formData.get('stipend'),
        workType: formData.get('workType'),
        startDate: formData.get('startDate'),
        applicationDeadline: formData.get('applicationDeadline'),
        requirements: formData.get('requirements'),
        benefits: formData.get('benefits'),
        status: 'active',
        postedDate: new Date().toISOString().split('T')[0],
        applications: 0
    };
    
    // Save internship
    saveInternship(internship);
    
    // Update employer stats
    currentUser.internshipsPosted = (currentUser.internshipsPosted || 0) + 1;
    updateUser(currentUser);
    setCurrentUser(currentUser);
    
    alert('Internship posted successfully!');
    
    // Clear form
    e.target.reset();
    
    // Show my internships
    showMyInternships();
}

// Handle company profile update
function handleCompanyProfileUpdate(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const currentUser = getCurrentUser();
    
    const updatedUser = {
        ...currentUser,
        companyName: formData.get('companyName'),
        description: formData.get('companyDescription'),
        industry: formData.get('industry'),
        companySize: formData.get('companySize'),
        website: formData.get('website'),
        location: formData.get('location'),
        culture: formData.get('culture')
    };
    
    // Update user in localStorage
    updateUser(updatedUser);
    
    // Update current user
    setCurrentUser(updatedUser);
    
    alert('Company profile updated successfully!');
}

// Handle account settings update
function handleAccountSettingsUpdate(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const currentUser = getCurrentUser();
    
    const updatedUser = {
        ...currentUser,
        contactPerson: formData.get('contactPerson'),
        contactEmail: formData.get('contactEmail'),
        contactPhone: formData.get('contactPhone')
    };
    
    // Handle password change
    const currentPassword = formData.get('currentPassword');
    const newPassword = formData.get('newPassword');
    
    if (newPassword) {
        if (currentPassword !== currentUser.password) {
            alert('Current password is incorrect.');
            return;
        }
        
        if (!validatePassword(newPassword)) {
            alert('New password must be at least 8 characters long.');
            return;
        }
        
        updatedUser.password = newPassword;
    }
    
    // Update user in localStorage
    updateUser(updatedUser);
    
    // Update current user
    setCurrentUser(updatedUser);
    
    alert('Account settings updated successfully!');
    
    // Clear password fields
    document.getElementById('currentPassword').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmNewPassword').value = '';
}

// Handle notification settings update
function handleNotificationSettingsUpdate(e) {
    e.preventDefault();
    
    // In a real application, this would save notification preferences
    alert('Notification settings updated successfully!');
}

// Application management functions
function acceptApplication(applicationId) {
    if (!confirm('Are you sure you want to accept this application?')) {
        return;
    }
    
    const applications = getApplications();
    const application = applications.find(app => app.id === applicationId);
    
    if (application) {
        application.status = 'accepted';
        localStorage.setItem('applications', JSON.stringify(applications));
        
        alert('Application accepted successfully!');
        showApplicants(); // Refresh the applicants list
    }
}

function rejectApplication(applicationId) {
    if (!confirm('Are you sure you want to reject this application?')) {
        return;
    }
    
    const applications = getApplications();
    const application = applications.find(app => app.id === applicationId);
    
    if (application) {
        application.status = 'rejected';
        localStorage.setItem('applications', JSON.stringify(applications));
        
        alert('Application rejected successfully!');
        showApplicants(); // Refresh the applicants list
    }
}

function viewApplicantProfile(applicationId) {
    const applications = getApplications();
    const users = getUsers();
    
    const application = applications.find(app => app.id === applicationId);
    const user = users.find(u => u.id === application.userId);
    
    if (!application || !user) return;
    
    showModal('Applicant Profile', `
        <div class="applicant-profile">
            <h3>${user.name}</h3>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Phone:</strong> ${user.phone || 'Not provided'}</p>
            <p><strong>Skills:</strong> ${user.skills || 'Not specified'}</p>
            <p><strong>Education:</strong> ${user.education || 'Not specified'}</p>
            <p><strong>Experience:</strong> ${user.experience || 'Not specified'}</p>
            <p><strong>Bio:</strong> ${user.bio || 'Not provided'}</p>
            <p><strong>Rating:</strong> ${generateStarRating(user.rating || 0)}</p>
            <p><strong>Completed Internships:</strong> ${user.completed || 0}</p>
            <p><strong>Cover Letter:</strong> ${application.coverLetter}</p>
            <p><strong>Availability:</strong> ${application.availability}</p>
            <div class="modal-actions">
                <button class="btn btn-primary" onclick="contactApplicant(${applicationId})">
                    Contact Applicant
                </button>
                <button class="btn btn-outline" onclick="closeModal()">
                    Close
                </button>
            </div>
        </div>
    `);
}

function contactApplicant(applicationId) {
    const applications = getApplications();
    const users = getUsers();
    
    const application = applications.find(app => app.id === applicationId);
    const user = users.find(u => u.id === application.userId);
    
    if (!application || !user) return;
    
    showModal('Contact Applicant', `
        <div class="contact-form">
            <h3>Contact ${user.name}</h3>
            <p><strong>Email:</strong> ${user.email}</p>
            <form id="contactForm">
                <div class="form-group">
                    <label for="subject">Subject</label>
                    <input type="text" id="subject" name="subject" required 
                        placeholder="Regarding your application for...">
                </div>
                <div class="form-group">
                    <label for="message">Message</label>
                    <textarea id="message" name="message" rows="6" required 
                        placeholder="Type your message here..."></textarea>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">
                        Send Message
                    </button>
                    <button type="button" class="btn btn-outline" onclick="closeModal()">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    `);
    
    // Handle contact form submission
    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // In a real application, this would send an email
        alert('Message sent successfully!');
        closeModal();
    });
}

// Internship management functions
function editInternship(internshipId) {
    const internships = getInternships();
    const internship = internships.find(i => i.id === internshipId);
    
    if (!internship) return;
    
    // Populate form with internship data
    const form = document.getElementById('internshipForm');
    if (form) {
        form.elements['title'].value = internship.title;
        form.elements['category'].value = internship.category;
        form.elements['description'].value = internship.description;
        form.elements['skillsRequired'].value = internship.skillsRequired;
        form.elements['duration'].value = internship.duration;
        form.elements['stipend'].value = internship.stipend;
        form.elements['workType'].value = internship.workType;
        form.elements['startDate'].value = internship.startDate;
        form.elements['applicationDeadline'].value = internship.applicationDeadline;
        form.elements['requirements'].value = internship.requirements;
        form.elements['benefits'].value = internship.benefits;
        
        // Change form submission handler to update instead of create
        form.onsubmit = function(e) {
            e.preventDefault();
            
            const formData = new FormData(form);
            
            // Update internship
            Object.assign(internship, {
                title: formData.get('title'),
                category: formData.get('category'),
                description: formData.get('description'),
                skillsRequired: formData.get('skillsRequired'),
                duration: formData.get('duration'),
                stipend: formData.get('stipend'),
                workType: formData.get('workType'),
                startDate: formData.get('startDate'),
                applicationDeadline: formData.get('applicationDeadline'),
                requirements: formData.get('requirements'),
                benefits: formData.get('benefits')
            });
            
            // Save updated internship
            const index = internships.findIndex(i => i.id === internshipId);
            internships[index] = internship;
            localStorage.setItem('internships', JSON.stringify(internships));
            
            alert('Internship updated successfully!');
            
            // Reset form handler
            form.onsubmit = handleInternshipSubmission;
            form.reset();
            
            // Show my internships
            showMyInternships();
        };
    }
    
    // Show post internship section
    showPostInternship();
}

function closeInternship(internshipId) {
    if (!confirm('Are you sure you want to close this internship?')) {
        return;
    }
    
    const internships = getInternships();
    const internship = internships.find(i => i.id === internshipId);
    
    if (internship) {
        internship.status = 'closed';
        localStorage.setItem('internships', JSON.stringify(internships));
        
        alert('Internship closed successfully!');
        showMyInternships(); // Refresh the internships list
    }
}

function viewApplicants(internshipId) {
    // Filter applications by internship
    const applications = getApplications();
    const internshipApplications = applications.filter(app => app.internshipId === internshipId);
    
    // Show applicants section
    showApplicants();
    
    // Set internship filter
    const internshipFilter = document.getElementById('internshipFilter');
    if (internshipFilter) {
        internshipFilter.value = internshipId;
        filterApplicants();
    }
}

function filterApplicants() {
    const internshipFilter = document.getElementById('internshipFilter');
    const statusFilter = document.getElementById('statusFilter');
    
    const applications = getApplications();
    const currentUser = getCurrentUser();
    const internships = getInternships();
    
    // Get employer's applications
    let employerApplications = applications.filter(application => {
        const internship = internships.find(i => i.id === application.internshipId);
        return internship && internship.employerId === currentUser.id;
    });
    
    // Apply filters
    if (internshipFilter && internshipFilter.value) {
        employerApplications = employerApplications.filter(app => 
            app.internshipId === parseInt(internshipFilter.value)
        );
    }
    
    if (statusFilter && statusFilter.value) {
        employerApplications = employerApplications.filter(app => 
            app.status === statusFilter.value
        );
    }
    
    displayApplicants(employerApplications);
}

function saveDraft() {
    const form = document.getElementById('internshipForm');
    if (!form) return;
    
    const formData = new FormData(form);
    const currentUser = getCurrentUser();
    
    const draft = {
        id: generateId(),
        employerId: currentUser.id,
        title: formData.get('title'),
        category: formData.get('category'),
        description: formData.get('description'),
        skillsRequired: formData.get('skillsRequired'),
        duration: formData.get('duration'),
        stipend: formData.get('stipend'),
        workType: formData.get('workType'),
        startDate: formData.get('startDate'),
        applicationDeadline: formData.get('applicationDeadline'),
        requirements: formData.get('requirements'),
        benefits: formData.get('benefits'),
        status: 'draft',
        postedDate: new Date().toISOString().split('T')[0],
        applications: 0
    };
    
    // Save draft
    saveInternship(draft);
    
    alert('Draft saved successfully!');
}

function changeLogo() {
    // In a real application, this would open a file picker
    alert('Logo upload would be implemented here.');
}

// Utility functions
function formatInternshipStatus(status) {
    const statusMap = {
        'active': 'Active',
        'closed': 'Closed',
        'draft': 'Draft',
        'flagged': 'Flagged'
    };
    return statusMap[status] || status;
}

// Data access functions
function getInternships() {
    const internshipsJson = localStorage.getItem('internships');
    return internshipsJson ? JSON.parse(internshipsJson) : [];
}

function getApplications() {
    const applicationsJson = localStorage.getItem('applications');
    return applicationsJson ? JSON.parse(applicationsJson) : [];
}

function getUsers() {
    const usersJson = localStorage.getItem('users');
    return usersJson ? JSON.parse(usersJson) : [];
}

function getReviews() {
    const reviewsJson = localStorage.getItem('reviews');
    return reviewsJson ? JSON.parse(reviewsJson) : [];
}

function saveInternship(internship) {
    const internships = getInternships();
    internships.push(internship);
    localStorage.setItem('internships', JSON.stringify(internships));
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
window.showEmployerOverview = showEmployerOverview;
window.showMyInternships = showMyInternships;
window.showApplicants = showApplicants;
window.showPostInternship = showPostInternship;
window.showCompanyProfile = showCompanyProfile;
window.showReviews = showReviews;
window.showSettings = showSettings;
window.acceptApplication = acceptApplication;
window.rejectApplication = rejectApplication;
window.viewApplicantProfile = viewApplicantProfile;
window.contactApplicant = contactApplicant;
window.editInternship = editInternship;
window.closeInternship = closeInternship;
window.viewApplicants = viewApplicants;
window.filterApplicants = filterApplicants;
window.saveDraft = saveDraft;
window.changeLogo = changeLogo;