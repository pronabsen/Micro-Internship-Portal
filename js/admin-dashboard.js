// Admin Dashboard JavaScript file for Micro-Internship Portal

// Initialize admin dashboard
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (!checkAuthStatus()) return;
    
    // Check role
    if (!requireRole('admin')) return;
    
    // Load admin data
    loadAdminData();
    
    // Setup sidebar navigation
    setupSidebarNavigation();
    
    // Load dashboard overview
    showAdminOverview();
    
    // Setup event listeners
    setupEventListeners();
});

// Load admin data
function loadAdminData() {
    // Admin-specific initialization
    console.log('Admin dashboard loaded');
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

// Show admin overview
function showAdminOverview() {
    const overviewSection = document.getElementById('adminOverviewSection');
    if (!overviewSection) return;
    
    overviewSection.style.display = 'block';
    
    // Load system statistics
    loadSystemStats();
    
    // Load pending actions
    loadPendingActions();
}

// Load system statistics
function loadSystemStats() {
    const users = getUsers();
    const internships = getInternships();
    const applications = getApplications();
    
    // Calculate statistics
    const totalUsers = users.filter(u => u.role === 'user').length;
    const totalEmployers = users.filter(u => u.role === 'employer').length;
    const totalInternships = internships.length;
    const totalApplications = applications.length;
    
    // Update stats cards
    const totalUsersElement = document.getElementById('totalUsers');
    const totalEmployersElement = document.getElementById('totalEmployers');
    const totalInternshipsElement = document.getElementById('totalInternships');
    const totalApplicationsElement = document.getElementById('totalApplications');
    
    if (totalUsersElement) totalUsersElement.textContent = totalUsers;
    if (totalEmployersElement) totalEmployersElement.textContent = totalEmployers;
    if (totalInternshipsElement) totalInternshipsElement.textContent = totalInternships;
    if (totalApplicationsElement) totalApplicationsElement.textContent = totalApplications;
    
    // Update badges
    const usersCountElement = document.getElementById('usersCount');
    const pendingVerificationsElement = document.getElementById('pendingVerifications');
    const internshipsCountElement = document.getElementById('internshipsCount');
    
    if (usersCountElement) usersCountElement.textContent = users.length;
    if (pendingVerificationsElement) {
        const pendingEmployers = users.filter(u => u.role === 'employer' && u.status === 'pending_verification');
        pendingVerificationsElement.textContent = pendingEmployers.length;
    }
    if (internshipsCountElement) internshipsCountElement.textContent = totalInternships;
}

// Load pending actions
function loadPendingActions() {
    const users = getUsers();
    const internships = getInternships();
    
    // Count pending employer verifications
    const pendingEmployers = users.filter(u => u.role === 'employer' && u.status === 'pending_verification');
    const pendingEmployersElement = document.getElementById('pendingEmployers');
    if (pendingEmployersElement) pendingEmployersElement.textContent = pendingEmployers.length;
    
    // Count reported issues (placeholder)
    const reportedIssuesElement = document.getElementById('reportedIssues');
    if (reportedIssuesElement) reportedIssuesElement.textContent = '0';
}

// Show user management
function showUserManagement() {
    const userManagementSection = document.getElementById('userManagementSection');
    if (!userManagementSection) return;
    
    userManagementSection.style.display = 'block';
    
    loadUsersTable();
}

// Load users table
function loadUsersTable() {
    const users = getUsers();
    const usersTableBody = document.getElementById('usersTableBody');
    if (!usersTableBody) return;
    
    usersTableBody.innerHTML = '';
    
    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name || user.companyName}</td>
            <td>${user.email}</td>
            <td>${formatRole(user.role)}</td>
            <td><span class="status-badge ${user.status}">${formatUserStatus(user.status)}</span></td>
            <td>${formatDate(user.joinedDate)}</td>
            <td>
                <button class="btn btn-outline btn-sm" onclick="viewUser(${user.id})">
                    View
                </button>
                <button class="btn btn-outline btn-sm" onclick="editUser(${user.id})">
                    Edit
                </button>
                ${user.status === 'active' ? `
                    <button class="btn btn-outline btn-sm" onclick="suspendUser(${user.id})">
                        Suspend
                    </button>
                ` : ''}
                ${user.status === 'suspended' ? `
                    <button class="btn btn-outline btn-sm" onclick="activateUser(${user.id})">
                        Activate
                    </button>
                ` : ''}
                <button class="btn btn-outline btn-sm" onclick="deleteUser(${user.id})">
                    Delete
                </button>
            </td>
        `;
        usersTableBody.appendChild(row);
    });
}

// Show employer verification
function showEmployerVerification() {
    const employerVerificationSection = document.getElementById('employerVerificationSection');
    if (!employerVerificationSection) return;
    
    employerVerificationSection.style.display = 'block';
    
    loadEmployerVerifications();
}

// Load employer verifications
function loadEmployerVerifications() {
    const users = getUsers();
    const employers = users.filter(u => u.role === 'employer');
    
    const verificationsList = document.getElementById('verificationsList');
    if (!verificationsList) return;
    
    if (employers.length === 0) {
        verificationsList.innerHTML = '<p>No employer registrations to review.</p>';
        return;
    }
    
    verificationsList.innerHTML = '';
    employers.forEach(employer => {
        const verificationCard = document.createElement('div');
        verificationCard.className = 'verification-card';
        verificationCard.innerHTML = `
            <div class="verification-header">
                <div>
                    <h3>${employer.companyName}</h3>
                    <p class="verification-email">${employer.email}</p>
                    <p class="verification-industry">${employer.industry} • ${employer.companySize}</p>
                </div>
                <div class="verification-status">
                    <span class="status-badge ${employer.status}">${formatUserStatus(employer.status)}</span>
                </div>
            </div>
            <div class="verification-details">
                <p><strong>Contact Person:</strong> ${employer.contactPerson}</p>
                <p><strong>Phone:</strong> ${employer.phone || 'Not provided'}</p>
                <p><strong>Website:</strong> ${employer.website || 'Not provided'}</p>
                <p><strong>Joined:</strong> ${formatDate(employer.joinedDate)}</p>
            </div>
            <div class="verification-actions">
                ${employer.status === 'pending_verification' ? `
                    <button class="btn btn-primary btn-sm" onclick="approveEmployer(${employer.id})">
                        Approve
                    </button>
                    <button class="btn btn-outline btn-sm" onclick="rejectEmployer(${employer.id})">
                        Reject
                    </button>
                ` : ''}
                <button class="btn btn-outline btn-sm" onclick="viewEmployerDetails(${employer.id})">
                    View Details
                </button>
            </div>
        `;
        verificationsList.appendChild(verificationCard);
    });
}

// Show internship management
function showInternshipManagement() {
    const internshipManagementSection = document.getElementById('internshipManagementSection');
    if (!internshipManagementSection) return;
    
    internshipManagementSection.style.display = 'block';
    
    loadInternshipsTable();
}

// Load internships table
function loadInternshipsTable() {
    const internships = getInternships();
    const users = getUsers();
    const applications = getApplications();
    
    const internshipsTableBody = document.getElementById('internshipsTableBody');
    if (!internshipsTableBody) return;
    
    internshipsTableBody.innerHTML = '';
    
    internships.forEach(internship => {
        const employer = users.find(u => u.id === internship.employerId);
        const internshipApplications = applications.filter(a => a.internshipId === internship.id);
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${internship.id}</td>
            <td>${internship.title}</td>
            <td>${employer ? employer.companyName : 'Unknown'}</td>
            <td>${formatCategory(internship.category)}</td>
            <td>${internshipApplications.length}</td>
            <td><span class="status-badge ${internship.status}">${formatInternshipStatus(internship.status)}</span></td>
            <td>${formatDate(internship.postedDate)}</td>
            <td>
                <button class="btn btn-outline btn-sm" onclick="viewInternship(${internship.id})">
                    View
                </button>
                <button class="btn btn-outline btn-sm" onclick="editInternship(${internship.id})">
                    Edit
                </button>
                ${internship.status === 'active' ? `
                    <button class="btn btn-outline btn-sm" onclick="closeInternship(${internship.id})">
                        Close
                    </button>
                ` : ''}
                ${internship.status === 'flagged' ? `
                    <button class="btn btn-outline btn-sm" onclick="reviewInternship(${internship.id})">
                        Review
                    </button>
                ` : ''}
                <button class="btn btn-outline btn-sm" onclick="deleteInternship(${internship.id})">
                    Delete
                </button>
            </td>
        `;
        internshipsTableBody.appendChild(row);
    });
}

// Show reports
function showReports() {
    const reportsSection = document.getElementById('reportsSection');
    if (!reportsSection) return;
    
    reportsSection.style.display = 'block';
    
    // In a real application, this would load actual chart data
    // For now, we'll show placeholder content
    const reportContents = document.querySelectorAll('.report-content');
    reportContents.forEach(content => {
        content.innerHTML = '<p>Chart would be displayed here</p>';
    });
}

// Show settings
function showSettings() {
    const settingsSection = document.getElementById('adminSettingsSection');
    if (!settingsSection) return;
    
    settingsSection.style.display = 'block';
}

// Setup event listeners
function setupEventListeners() {
    // System settings form
    const systemSettingsForm = document.getElementById('systemSettingsForm');
    if (systemSettingsForm) {
        systemSettingsForm.addEventListener('submit', handleSystemSettingsUpdate);
    }
    
    // Email settings form
    const emailSettingsForm = document.getElementById('emailSettingsForm');
    if (emailSettingsForm) {
        emailSettingsForm.addEventListener('submit', handleEmailSettingsUpdate);
    }
}

// Handle system settings update
function handleSystemSettingsUpdate(e) {
    e.preventDefault();
    
    // In a real application, this would save system settings
    alert('System settings updated successfully!');
}

// Handle email settings update
function handleEmailSettingsUpdate(e) {
    e.preventDefault();
    
    // In a real application, this would save email settings
    alert('Email settings updated successfully!');
}

// User management functions
function viewUser(userId) {
    const users = getUsers();
    const user = users.find(u => u.id === userId);
    
    if (!user) return;
    
    showModal('User Details', `
        <div class="user-details">
            <h3>${user.name || user.companyName}</h3>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Role:</strong> ${formatRole(user.role)}</p>
            <p><strong>Status:</strong> ${formatUserStatus(user.status)}</p>
            <p><strong>Joined:</strong> ${formatDate(user.joinedDate)}</p>
            ${user.role === 'user' ? `
                <p><strong>Skills:</strong> ${user.skills || 'Not specified'}</p>
                <p><strong>Applications:</strong> ${user.applications || 0}</p>
                <p><strong>Completed:</strong> ${user.completed || 0}</p>
                <p><strong>Rating:</strong> ${generateStarRating(user.rating || 0)}</p>
                <p><strong>Points:</strong> ${user.points || 0}</p>
            ` : ''}
            ${user.role === 'employer' ? `
                <p><strong>Company:</strong> ${user.companyName}</p>
                <p><strong>Industry:</strong> ${user.industry || 'Not specified'}</p>
                <p><strong>Company Size:</strong> ${user.companySize || 'Not specified'}</p>
                <p><strong>Website:</strong> ${user.website || 'Not specified'}</p>
                <p><strong>Internships Posted:</strong> ${user.internshipsPosted || 0}</p>
                <p><strong>Interns Hired:</strong> ${user.internsHired || 0}</p>
                <p><strong>Rating:</strong> ${generateStarRating(user.rating || 0)}</p>
            ` : `}
            <div class="modal-actions">
                <button class="btn btn-outline" onclick="closeModal()">
                    Close
                </button>
            </div>
        </div>
    `);
}

function editUser(userId) {
    const users = getUsers();
    const user = users.find(u => u.id === userId);
    
    if (!user) return;
    
    showModal('Edit User', `
        <div class="edit-user-form">
            <h3>Edit ${user.name || user.companyName}</h3>
            <form id="editUserForm">
                <div class="form-group">
                    <label for="editStatus">Status</label>
                    <select id="editStatus" name="status">
                        <option value="active" ${user.status === 'active' ? 'selected' : ''}>Active</option>
                        <option value="inactive" ${user.status === 'inactive' ? 'selected' : ''}>Inactive</option>
                        <option value="suspended" ${user.status === 'suspended' ? 'selected' : ''}>Suspended</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="editEmail">Email</label>
                    <input type="email" id="editEmail" name="email" value="${user.email}" required>
                </div>
                ${user.role === 'employer' ? `
                    <div class="form-group">
                        <label for="editVerified">Verified</label>
                        <select id="editVerified" name="verified">
                            <option value="true" ${user.verified ? 'selected' : ''}>Verified</option>
                            <option value="false" ${!user.verified ? 'selected' : ''}>Not Verified</option>
                        </select>
                    </div>
                ` : ''}
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">
                        Save Changes
                    </button>
                    <button type="button" class="btn btn-outline" onclick="closeModal()">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    `);
    
    // Handle form submission
    const editUserForm = document.getElementById('editUserForm');
    editUserForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        
        // Update user
        user.status = formData.get('status');
        user.email = formData.get('email');
        
        if (user.role === 'employer') {
            user.verified = formData.get('verified') === 'true';
            if (user.verified) {
                user.status = 'active';
            }
        }
        
        // Save updated user
        const userIndex = users.findIndex(u => u.id === userId);
        users[userIndex] = user;
        localStorage.setItem('users', JSON.stringify(users));
        
        alert('User updated successfully!');
        closeModal();
        loadUsersTable(); // Refresh the table
    });
}

function suspendUser(userId) {
    if (!confirm('Are you sure you want to suspend this user?')) {
        return;
    }
    
    const users = getUsers();
    const user = users.find(u => u.id === userId);
    
    if (user) {
        user.status = 'suspended';
        localStorage.setItem('users', JSON.stringify(users));
        
        alert('User suspended successfully!');
        loadUsersTable(); // Refresh the table
    }
}

function activateUser(userId) {
    if (!confirm('Are you sure you want to activate this user?')) {
        return;
    }
    
    const users = getUsers();
    const user = users.find(u => u.id === userId);
    
    if (user) {
        user.status = 'active';
        localStorage.setItem('users', JSON.stringify(users));
        
        alert('User activated successfully!');
        loadUsersTable(); // Refresh the table
    }
}

function deleteUser(userId) {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
        return;
    }
    
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex !== -1) {
        users.splice(userIndex, 1);
        localStorage.setItem('users', JSON.stringify(users));
        
        alert('User deleted successfully!');
        loadUsersTable(); // Refresh the table
    }
}

// Employer verification functions
function approveEmployer(employerId) {
    if (!confirm('Are you sure you want to approve this employer?')) {
        return;
    }
    
    const users = getUsers();
    const employer = users.find(u => u.id === employerId);
    
    if (employer) {
        employer.verified = true;
        employer.status = 'active';
        localStorage.setItem('users', JSON.stringify(users));
        
        alert('Employer approved successfully!');
        loadEmployerVerifications(); // Refresh the list
    }
}

function rejectEmployer(employerId) {
    if (!confirm('Are you sure you want to reject this employer?')) {
        return;
    }
    
    const users = getUsers();
    const employer = users.find(u => u.id === employerId);
    
    if (employer) {
        employer.verified = false;
        employer.status = 'rejected';
        localStorage.setItem('users', JSON.stringify(users));
        
        alert('Employer rejected successfully!');
        loadEmployerVerifications(); // Refresh the list
    }
}

function viewEmployerDetails(employerId) {
    const users = getUsers();
    const employer = users.find(u => u.id === employerId);
    
    if (!employer) return;
    
    showModal('Employer Details', `
        <div class="employer-details">
            <h3>${employer.companyName}</h3>
            <p><strong>Contact Person:</strong> ${employer.contactPerson}</p>
            <p><strong>Email:</strong> ${employer.email}</p>
            <p><strong>Phone:</strong> ${employer.phone || 'Not provided'}</p>
            <p><strong>Industry:</strong> ${employer.industry || 'Not specified'}</p>
            <p><strong>Company Size:</strong> ${employer.companySize || 'Not specified'}</p>
            <p><strong>Website:</strong> ${employer.website || 'Not provided'}</p>
            <p><strong>Status:</strong> ${formatUserStatus(employer.status)}</p>
            <p><strong>Verified:</strong> ${employer.verified ? 'Yes' : 'No'}</p>
            <p><strong>Joined:</strong> ${formatDate(employer.joinedDate)}</p>
            <p><strong>Internships Posted:</strong> ${employer.internshipsPosted || 0}</p>
            <p><strong>Interns Hired:</strong> ${employer.internsHired || 0}</p>
            <p><strong>Rating:</strong> ${generateStarRating(employer.rating || 0)}</p>
            <div class="modal-actions">
                <button class="btn btn-outline" onclick="closeModal()">
                    Close
                </button>
            </div>
        </div>
    `);
}

// Internship management functions
function viewInternship(internshipId) {
    const internships = getInternships();
    const users = getUsers();
    const applications = getApplications();
    
    const internship = internships.find(i => i.id === internshipId);
    const employer = users.find(u => u.id === internship.employerId);
    const internshipApplications = applications.filter(a => a.internshipId === internshipId);
    
    if (!internship) return;
    
    showModal('Internship Details', `
        <div class="internship-details">
            <h3>${internship.title}</h3>
            <p><strong>Company:</strong> ${employer ? employer.companyName : 'Unknown'}</p>
            <p><strong>Category:</strong> ${formatCategory(internship.category)}</p>
            <p><strong>Description:</strong> ${internship.description}</p>
            <p><strong>Skills Required:</strong> ${internship.skillsRequired}</p>
            <p><strong>Duration:</strong> ${formatDuration(internship.duration)}</p>
            <p><strong>Stipend:</strong> ${internship.stipend ? `$${internship.stipend}/month` : 'Unpaid'}</p>
            <p><strong>Work Type:</strong> ${formatWorkType(internship.workType)}</p>
            <p><strong>Start Date:</strong> ${formatDate(internship.startDate)}</p>
            <p><strong>Application Deadline:</strong> ${formatDate(internship.applicationDeadline)}</p>
            <p><strong>Requirements:</strong> ${internship.requirements}</p>
            <p><strong>Benefits:</strong> ${internship.benefits}</p>
            <p><strong>Status:</strong> ${formatInternshipStatus(internship.status)}</p>
            <p><strong>Posted:</strong> ${formatDate(internship.postedDate)}</p>
            <p><strong>Applications:</strong> ${internshipApplications.length}</p>
            <div class="modal-actions">
                <button class="btn btn-outline" onclick="closeModal()">
                    Close
                </button>
            </div>
        </div>
    `);
}

function editInternship(internshipId) {
    // Similar to employer dashboard edit function
    alert('Edit internship functionality would be implemented here.');
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
        loadInternshipsTable(); // Refresh the table
    }
}

function reviewInternship(internshipId) {
    const internships = getInternships();
    const internship = internships.find(i => i.id === internshipId);
    
    if (!internship) return;
    
    showModal('Review Internship', `
        <div class="review-internship">
            <h3>${internship.title}</h3>
            <p><strong>Company:</strong> ${internship.companyName}</p>
            <p><strong>Status:</strong> ${formatInternshipStatus(internship.status)}</p>
            <form id="reviewInternshipForm">
                <div class="form-group">
                    <label for="reviewAction">Action</label>
                    <select id="reviewAction" name="reviewAction">
                        <option value="approve">Approve</option>
                        <option value="reject">Reject</option>
                        <option value="request_changes">Request Changes</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="reviewNotes">Notes</label>
                    <textarea id="reviewNotes" name="reviewNotes" rows="4" 
                        placeholder="Add notes about your decision..."></textarea>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">
                        Submit Review
                    </button>
                    <button type="button" class="btn btn-outline" onclick="closeModal()">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    `);
    
    // Handle form submission
    const reviewInternshipForm = document.getElementById('reviewInternshipForm');
    reviewInternshipForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const action = formData.get('reviewAction');
        
        // Update internship status
        if (action === 'approve') {
            internship.status = 'active';
        } else if (action === 'reject') {
            internship.status = 'rejected';
        } else if (action === 'request_changes') {
            internship.status = 'draft';
        }
        
        localStorage.setItem('internships', JSON.stringify(internships));
        
        alert(`Internship ${action}d successfully!`);
        closeModal();
        loadInternshipsTable(); // Refresh the table
    });
}

function deleteInternship(internshipId) {
    if (!confirm('Are you sure you want to delete this internship? This action cannot be undone.')) {
        return;
    }
    
    const internships = getInternships();
    const internshipIndex = internships.findIndex(i => i.id === internshipId);
    
    if (internshipIndex !== -1) {
        internships.splice(internshipIndex, 1);
        localStorage.setItem('internships', JSON.stringify(internships));
        
        alert('Internship deleted successfully!');
        loadInternshipsTable(); // Refresh the table
    }
}

// Filter functions
function searchUsers() {
    const searchTerm = document.getElementById('userSearch').value.toLowerCase();
    const roleFilter = document.getElementById('userRoleFilter').value;
    const statusFilter = document.getElementById('userStatusFilter').value;
    
    const users = getUsers();
    const filteredUsers = users.filter(user => {
        const matchesSearch = !searchTerm || 
            (user.name && user.name.toLowerCase().includes(searchTerm)) ||
            (user.companyName && user.companyName.toLowerCase().includes(searchTerm)) ||
            user.email.toLowerCase().includes(searchTerm);
        
        const matchesRole = !roleFilter || user.role === roleFilter;
        const matchesStatus = !statusFilter || user.status === statusFilter;
        
        return matchesSearch && matchesRole && matchesStatus;
    });
    
    // Update table with filtered users
    const usersTableBody = document.getElementById('usersTableBody');
    usersTableBody.innerHTML = '';
    
    filteredUsers.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name || user.companyName}</td>
            <td>${user.email}</td>
            <td>${formatRole(user.role)}</td>
            <td><span class="status-badge ${user.status}">${formatUserStatus(user.status)}</span></td>
            <td>${formatDate(user.joinedDate)}</td>
            <td>
                <button class="btn btn-outline btn-sm" onclick="viewUser(${user.id})">
                    View
                </button>
                <button class="btn btn-outline btn-sm" onclick="editUser(${user.id})">
                    Edit
                </button>
                ${user.status === 'active' ? `
                    <button class="btn btn-outline btn-sm" onclick="suspendUser(${user.id})">
                        Suspend
                    </button>
                ` : ''}
                ${user.status === 'suspended' ? `
                    <button class="btn btn-outline btn-sm" onclick="activateUser(${user.id})">
                        Activate
                    </button>
                ` : ''}
                <button class="btn btn-outline btn-sm" onclick="deleteUser(${user.id})">
                    Delete
                </button>
            </td>
        `;
        usersTableBody.appendChild(row);
    });
}

function filterUsers() {
    searchUsers(); // Reuse search logic
}

function filterVerifications(status) {
    const filterBtns = document.querySelectorAll('.verification-filters .filter-btn');
    filterBtns.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    const users = getUsers();
    let employers = users.filter(u => u.role === 'employer');
    
    if (status !== 'all') {
        employers = employers.filter(employer => {
            if (status === 'pending') return employer.status === 'pending_verification';
            if (status === 'approved') return employer.verified;
            if (status === 'rejected') return employer.status === 'rejected';
            return true;
        });
    }
    
    // Update verifications list
    const verificationsList = document.getElementById('verificationsList');
    verificationsList.innerHTML = '';
    
    if (employers.length === 0) {
        verificationsList.innerHTML = '<p>No employer registrations found.</p>';
        return;
    }
    
    employers.forEach(employer => {
        const verificationCard = document.createElement('div');
        verificationCard.className = 'verification-card';
        verificationCard.innerHTML = `
            <div class="verification-header">
                <div>
                    <h3>${employer.companyName}</h3>
                    <p class="verification-email">${employer.email}</p>
                    <p class="verification-industry">${employer.industry} • ${employer.companySize}</p>
                </div>
                <div class="verification-status">
                    <span class="status-badge ${employer.status}">${formatUserStatus(employer.status)}</span>
                </div>
            </div>
            <div class="verification-details">
                <p><strong>Contact Person:</strong> ${employer.contactPerson}</p>
                <p><strong>Phone:</strong> ${employer.phone || 'Not provided'}</p>
                <p><strong>Website:</strong> ${employer.website || 'Not provided'}</p>
                <p><strong>Joined:</strong> ${formatDate(employer.joinedDate)}</p>
            </div>
            <div class="verification-actions">
                ${employer.status === 'pending_verification' ? `
                    <button class="btn btn-primary btn-sm" onclick="approveEmployer(${employer.id})">
                        Approve
                    </button>
                    <button class="btn btn-outline btn-sm" onclick="rejectEmployer(${employer.id})">
                        Reject
                    </button>
                ` : ''}
                <button class="btn btn-outline btn-sm" onclick="viewEmployerDetails(${employer.id})">
                    View Details
                </button>
            </div>
        `;
        verificationsList.appendChild(verificationCard);
    });
}

function filterInternships() {
    const searchTerm = document.getElementById('internshipSearch').value.toLowerCase();
    const statusFilter = document.getElementById('internshipStatusFilter').value;
    const categoryFilter = document.getElementById('internshipCategoryFilter').value;
    
    const internships = getInternships();
    const users = getUsers();
    const applications = getApplications();
    
    const filteredInternships = internships.filter(internship => {
        const matchesSearch = !searchTerm || 
            internship.title.toLowerCase().includes(searchTerm) ||
            internship.description.toLowerCase().includes(searchTerm);
        
        const matchesStatus = !statusFilter || internship.status === statusFilter;
        const matchesCategory = !categoryFilter || internship.category === categoryFilter;
        
        return matchesSearch && matchesStatus && matchesCategory;
    });
    
    // Update table with filtered internships
    const internshipsTableBody = document.getElementById('internshipsTableBody');
    internshipsTableBody.innerHTML = '';
    
    filteredInternships.forEach(internship => {
        const employer = users.find(u => u.id === internship.employerId);
        const internshipApplications = applications.filter(a => a.internshipId === internship.id);
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${internship.id}</td>
            <td>${internship.title}</td>
            <td>${employer ? employer.companyName : 'Unknown'}</td>
            <td>${formatCategory(internship.category)}</td>
            <td>${internshipApplications.length}</td>
            <td><span class="status-badge ${internship.status}">${formatInternshipStatus(internship.status)}</span></td>
            <td>${formatDate(internship.postedDate)}</td>
            <td>
                <button class="btn btn-outline btn-sm" onclick="viewInternship(${internship.id})">
                    View
                </button>
                <button class="btn btn-outline btn-sm" onclick="editInternship(${internship.id})">
                    Edit
                </button>
                ${internship.status === 'active' ? `
                    <button class="btn btn-outline btn-sm" onclick="closeInternship(${internship.id})">
                        Close
                    </button>
                ` : ''}
                ${internship.status === 'flagged' ? `
                    <button class="btn btn-outline btn-sm" onclick="reviewInternship(${internship.id})">
                        Review
                    </button>
                ` : ''}
                <button class="btn btn-outline btn-sm" onclick="deleteInternship(${internship.id})">
                    Delete
                </button>
            </td>
        `;
        internshipsTableBody.appendChild(row);
    });
}

// Export functions
function exportUsers() {
    const users = getUsers();
    const csv = convertToCSV(users);
    downloadCSV(csv, 'users.csv');
    alert('Users exported successfully!');
}

function exportInternships() {
    const internships = getInternships();
    const csv = convertToCSV(internships);
    downloadCSV(csv, 'internships.csv');
    alert('Internships exported successfully!');
}

// Report generation
function generateReport(period) {
    // In a real application, this would generate a PDF report
    alert(`${period.charAt(0).toUpperCase() + period.slice(1)} report would be generated here.`);
}

function showReportedIssues() {
    showModal('Reported Issues', `
        <div class="reported-issues">
            <h3>Reported Issues</h3>
            <p>No reported issues at this time.</p>
            <div class="modal-actions">
                <button class="btn btn-outline" onclick="closeModal()">
                    Close
                </button>
            </div>
        </div>
    `);
}

// Utility functions
function formatRole(role) {
    const roleMap = {
        'user': 'User',
        'employer': 'Employer',
        'admin': 'Admin'
    };
    return roleMap[role] || role;
}

function formatUserStatus(status) {
    const statusMap = {
        'active': 'Active',
        'inactive': 'Inactive',
        'suspended': 'Suspended',
        'pending_verification': 'Pending Verification',
        'rejected': 'Rejected'
    };
    return statusMap[status] || status;
}

function convertToCSV(data) {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvHeaders = headers.join(',');
    
    const csvRows = data.map(row => {
        const values = headers.map(header => {
            const value = row[header];
            return typeof value === 'string' ? `"${value}"` : value;
        });
        return values.join(',');
    });
    
    return [csvHeaders, ...csvRows].join('\n');
}

function downloadCSV(csv, filename) {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
}

// Data access functions
function getUsers() {
    const usersJson = localStorage.getItem('users');
    return usersJson ? JSON.parse(usersJson) : [];
}

function getInternships() {
    const internshipsJson = localStorage.getItem('internships');
    return internshipsJson ? JSON.parse(internshipsJson) : [];
}

function getApplications() {
    const applicationsJson = localStorage.getItem('applications');
    return applicationsJson ? JSON.parse(applicationsJson) : [];
}

// Export functions for use in other files
window.showAdminOverview = showAdminOverview;
window.showUserManagement = showUserManagement;
window.showEmployerVerification = showEmployerVerification;
window.showInternshipManagement = showInternshipManagement;
window.showReports = showReports;
window.showSettings = showSettings;
window.viewUser = viewUser;
window.editUser = editUser;
window.suspendUser = suspendUser;
window.activateUser = activateUser;
window.deleteUser = deleteUser;
window.approveEmployer = approveEmployer;
window.rejectEmployer = rejectEmployer;
window.viewEmployerDetails = viewEmployerDetails;
window.viewInternship = viewInternship;
window.editInternship = editInternship;
window.closeInternship = closeInternship;
window.reviewInternship = reviewInternship;
window.deleteInternship = deleteInternship;
window.searchUsers = searchUsers;
window.filterUsers = filterUsers;
window.filterVerifications = filterVerifications;
window.filterInternships = filterInternships;
window.exportUsers = exportUsers;
window.exportInternships = exportInternships;
window.generateReport = generateReport;
window.showReportedIssues = showReportedIssues;