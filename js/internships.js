// Internships JavaScript file for Micro-Internship Portal

// Additional internship-related functionality

// Load internships with advanced filtering
function loadInternshipsWithFilters() {
    const internships = getInternships();
    const users = getUsers();
    const applications = getApplications();
    
    // Get filter values
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const category = document.getElementById('categoryFilter')?.value || '';
    const duration = document.getElementById('durationFilter')?.value || '';
    const workType = document.getElementById('workTypeFilter')?.value || '';
    const stipendMin = document.getElementById('stipendMin')?.value || '';
    const stipendMax = document.getElementById('stipendMax')?.value || '';
    
    // Filter internships
    const filteredInternships = internships.filter(internship => {
        // Search filter
        const matchesSearch = !searchTerm || 
            internship.title.toLowerCase().includes(searchTerm) ||
            internship.company.toLowerCase().includes(searchTerm) ||
            internship.description.toLowerCase().includes(searchTerm) ||
            internship.skillsRequired.toLowerCase().includes(searchTerm);
        
        // Category filter
        const matchesCategory = !category || internship.category === category;
        
        // Duration filter
        const matchesDuration = !duration || internship.duration === duration;
        
        // Work type filter
        const matchesWorkType = !workType || internship.workType === workType;
        
        // Stipend filter
        let matchesStipend = true;
        if (stipendMin && internship.stipend) {
            matchesStipend = internship.stipend >= parseInt(stipendMin);
        }
        if (stipendMax && internship.stipend) {
            matchesStipend = matchesStipend && internship.stipend <= parseInt(stipendMax);
        }
        
        return matchesSearch && matchesCategory && matchesDuration && matchesWorkType && matchesStipend;
    });
    
    // Sort internships (newest first)
    filteredInternships.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
    
    return filteredInternships;
}

// Display internships in grid
function displayInternships(internships) {
    const internshipsGrid = document.getElementById('internshipsGrid');
    if (!internshipsGrid) return;
    
    internshipsGrid.innerHTML = '';
    
    if (internships.length === 0) {
        internshipsGrid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>No internships found</h3>
                <p>Try adjusting your filters or search terms</p>
            </div>
        `;
        return;
    }
    
    internships.forEach(internship => {
        const card = createInternshipCard(internship);
        internshipsGrid.appendChild(card);
    });
}

// Create enhanced internship card
function createInternshipCard(internship) {
    const card = document.createElement('div');
    card.className = 'internship-card fade-in';
    
    // Calculate days until deadline
    const daysUntilDeadline = calculateDaysUntilDeadline(internship.applicationDeadline);
    const deadlineClass = daysUntilDeadline <= 3 ? 'urgent' : (daysUntilDeadline <= 7 ? 'warning' : '');
    
    card.innerHTML = `
        <div class="internship-header">
            <div>
                <h3 class="internship-title">${internship.title}</h3>
                <p class="internship-company">${internship.company}</p>
                <div class="internship-rating">
                    ${generateStarRating(internship.rating || 0)}
                </div>
            </div>
            <div class="internship-badges">
                <span class="internship-category">${formatCategory(internship.category)}</span>
                ${internship.featured ? '<span class="featured-badge">Featured</span>' : ''}
            </div>
        </div>
        <p class="internship-description">${truncateText(internship.description, 150)}</p>
        <div class="internship-skills">
            <strong>Skills:</strong> ${formatSkills(internship.skillsRequired)}
        </div>
        <div class="internship-meta">
            <div class="internship-meta-item">
                <i class="fas fa-clock"></i>
                <span>${formatDuration(internship.duration)}</span>
            </div>
            <div class="internship-meta-item">
                <i class="fas fa-laptop"></i>
                <span>${formatWorkType(internship.workType)}</span>
            </div>
            <div class="internship-meta-item">
                <i class="fas fa-users"></i>
                <span>${internship.applications || 0} applicants</span>
            </div>
        </div>
        <div class="internship-deadline ${deadlineClass}">
            <i class="fas fa-calendar-alt"></i>
            <span>Deadline: ${formatDate(internship.applicationDeadline)} (${daysUntilDeadline} days left)</span>
        </div>
        <div class="internship-footer">
            <div class="internship-stipend">
                ${internship.stipend ? `$${internship.stipend}/month` : 'Unpaid'}
            </div>
            <div class="internship-actions">
                <button class="btn btn-outline btn-sm" onclick="quickViewInternship(${internship.id})">
                    <i class="fas fa-eye"></i> Quick View
                </button>
                <button class="btn btn-primary btn-sm" onclick="viewInternshipDetails(${internship.id})">
                    <i class="fas fa-info-circle"></i> Details
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// Quick view internship
function quickViewInternship(internshipId) {
    const internship = getInternships().find(i => i.id === internshipId);
    if (!internship) return;
    
    const currentUser = getCurrentUser();
    const hasApplied = currentUser ? checkIfApplied(internshipId, currentUser.id) : false;
    
    showModal('Quick View - ' + internship.title, `
        <div class="quick-view">
            <div class="quick-view-header">
                <h3>${internship.title}</h3>
                <p class="quick-view-company">${internship.company}</p>
                <div class="quick-view-meta">
                    <span class="internship-category">${formatCategory(internship.category)}</span>
                    <span class="internship-rating">${generateStarRating(internship.rating || 0)}</span>
                </div>
            </div>
            
            <div class="quick-view-content">
                <div class="quick-view-section">
                    <h4>Description</h4>
                    <p>${internship.description}</p>
                </div>
                
                <div class="quick-view-section">
                    <h4>Skills Required</h4>
                    <p>${internship.skillsRequired}</p>
                </div>
                
                <div class="quick-view-grid">
                    <div class="quick-view-item">
                        <i class="fas fa-clock"></i>
                        <div>
                            <strong>Duration</strong>
                            <p>${formatDuration(internship.duration)}</p>
                        </div>
                    </div>
                    <div class="quick-view-item">
                        <i class="fas fa-laptop"></i>
                        <div>
                            <strong>Work Type</strong>
                            <p>${formatWorkType(internship.workType)}</p>
                        </div>
                    </div>
                    <div class="quick-view-item">
                        <i class="fas fa-dollar-sign"></i>
                        <div>
                            <strong>Stipend</strong>
                            <p>${internship.stipend ? `$${internship.stipend}/month` : 'Unpaid'}</p>
                        </div>
                    </div>
                    <div class="quick-view-item">
                        <i class="fas fa-calendar-alt"></i>
                        <div>
                            <strong>Deadline</strong>
                            <p>${formatDate(internship.applicationDeadline)}</p>
                        </div>
                    </div>
                </div>
                
                ${internship.requirements ? `
                    <div class="quick-view-section">
                        <h4>Requirements</h4>
                        <p>${internship.requirements}</p>
                    </div>
                ` : ''}
                
                ${internship.benefits ? `
                    <div class="quick-view-section">
                        <h4>Benefits</h4>
                        <p>${internship.benefits}</p>
                    </div>
                ` : ''}
            </div>
            
            <div class="quick-view-actions">
                ${currentUser && !hasApplied ? `
                    <button class="btn btn-primary" onclick="applyForInternship(${internship.id})">
                        <i class="fas fa-paper-plane"></i> Apply Now
                    </button>
                ` : ''}
                ${currentUser && hasApplied ? `
                    <button class="btn btn-outline" disabled>
                        <i class="fas fa-check"></i> Already Applied
                    </button>
                ` : ''}
                ${!currentUser ? `
                    <button class="btn btn-primary" onclick="showLogin()">
                        <i class="fas fa-sign-in-alt"></i> Login to Apply
                    </button>
                ` : ''}
                <button class="btn btn-outline" onclick="viewInternshipDetails(${internship.id})">
                    <i class="fas fa-info-circle"></i> Full Details
                </button>
                <button class="btn btn-outline" onclick="closeModal()">
                    <i class="fas fa-times"></i> Close
                </button>
            </div>
        </div>
    `);
}

// Check if user has applied for internship
function checkIfApplied(internshipId, userId) {
    const applications = getApplications();
    return applications.some(app => app.internshipId === internshipId && app.userId === userId);
}

// Save internship to favorites
function saveToFavorites(internshipId) {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        showLogin();
        return;
    }
    
    const favorites = getFavorites();
    const alreadySaved = favorites.some(fav => fav.internshipId === internshipId && fav.userId === currentUser.id);
    
    if (alreadySaved) {
        alert('This internship is already in your favorites!');
        return;
    }
    
    favorites.push({
        id: generateId(),
        userId: currentUser.id,
        internshipId: internshipId,
        savedDate: new Date().toISOString().split('T')[0]
    });
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
    alert('Internship saved to favorites!');
}

// Share internship
function shareInternship(internshipId) {
    const internship = getInternships().find(i => i.id === internshipId);
    if (!internship) return;
    
    const shareUrl = `${window.location.origin}/index.html#internship-${internshipId}`;
    const shareText = `Check out this internship: ${internship.title} at ${internship.company}`;
    
    if (navigator.share) {
        navigator.share({
            title: internship.title,
            text: shareText,
            url: shareUrl
        });
    } else {
        // Fallback - copy to clipboard
        navigator.clipboard.writeText(`${shareText} - ${shareUrl}`).then(() => {
            alert('Internship link copied to clipboard!');
        });
    }
}

// Report internship
function reportInternship(internshipId) {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        showLogin();
        return;
    }
    
    showModal('Report Internship', `
        <div class="report-form">
            <h3>Report this Internship</h3>
            <form id="reportInternshipForm">
                <div class="form-group">
                    <label for="reportReason">Reason for reporting</label>
                    <select id="reportReason" name="reason" required>
                        <option value="">Select a reason</option>
                        <option value="inappropriate_content">Inappropriate content</option>
                        <option value="fraudulent">Fraudulent posting</option>
                        <option value="discrimination">Discrimination</option>
                        <option value="misinformation">Misinformation</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="reportDescription">Description</label>
                    <textarea id="reportDescription" name="description" rows="4" required 
                        placeholder="Please provide details about your report..."></textarea>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">
                        Submit Report
                    </button>
                    <button type="button" class="btn btn-outline" onclick="closeModal()">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    `);
    
    // Handle form submission
    const reportForm = document.getElementById('reportInternshipForm');
    reportForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const report = {
            id: generateId(),
            internshipId: internshipId,
            userId: currentUser.id,
            reason: formData.get('reason'),
            description: formData.get('description'),
            date: new Date().toISOString().split('T')[0],
            status: 'pending'
        };
        
        // Save report
        const reports = getReports();
        reports.push(report);
        localStorage.setItem('reports', JSON.stringify(reports));
        
        alert('Report submitted successfully. We will review this internship.');
        closeModal();
    });
}

// Advanced search
function performAdvancedSearch() {
    const searchForm = document.getElementById('advancedSearchForm');
    if (!searchForm) return;
    
    const formData = new FormData(searchForm);
    const searchCriteria = {
        searchTerm: formData.get('searchTerm'),
        category: formData.get('category'),
        duration: formData.get('duration'),
        workType: formData.get('workType'),
        stipendMin: formData.get('stipendMin'),
        stipendMax: formData.get('stipendMax'),
        postedWithin: formData.get('postedWithin')
    };
    
    // Apply filters and display results
    const filteredInternships = filterInternshipsByCriteria(searchCriteria);
    displayInternships(filteredInternships);
    
    // Update results count
    updateResultsCount(filteredInternships.length);
}

// Filter internships by criteria
function filterInternshipsByCriteria(criteria) {
    const internships = getInternships();
    
    return internships.filter(internship => {
        // Search term filter
        if (criteria.searchTerm) {
            const searchTerm = criteria.searchTerm.toLowerCase();
            const matchesSearch = 
                internship.title.toLowerCase().includes(searchTerm) ||
                internship.company.toLowerCase().includes(searchTerm) ||
                internship.description.toLowerCase().includes(searchTerm) ||
                internship.skillsRequired.toLowerCase().includes(searchTerm);
            
            if (!matchesSearch) return false;
        }
        
        // Category filter
        if (criteria.category && internship.category !== criteria.category) {
            return false;
        }
        
        // Duration filter
        if (criteria.duration && internship.duration !== criteria.duration) {
            return false;
        }
        
        // Work type filter
        if (criteria.workType && internship.workType !== criteria.workType) {
            return false;
        }
        
        // Stipend filter
        if (criteria.stipendMin && (!internship.stipend || internship.stipend < parseInt(criteria.stipendMin))) {
            return false;
        }
        
        if (criteria.stipendMax && internship.stipend && internship.stipend > parseInt(criteria.stipendMax)) {
            return false;
        }
        
        // Posted within filter
        if (criteria.postedWithin) {
            const postedDate = new Date(internship.postedDate);
            const today = new Date();
            const daysDiff = Math.floor((today - postedDate) / (1000 * 60 * 60 * 24));
            
            if (criteria.postedWithin === '7' && daysDiff > 7) return false;
            if (criteria.postedWithin === '30' && daysDiff > 30) return false;
            if (criteria.postedWithin === '90' && daysDiff > 90) return false;
        }
        
        return true;
    });
}

// Update results count
function updateResultsCount(count) {
    const resultsCount = document.getElementById('resultsCount');
    if (resultsCount) {
        resultsCount.textContent = `${count} internship${count !== 1 ? 's' : ''} found`;
    }
}

// Utility functions
function calculateDaysUntilDeadline(deadline) {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const timeDiff = deadlineDate - today;
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    return daysDiff > 0 ? daysDiff : 0;
}

function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

function formatSkills(skills) {
    if (!skills) return 'Not specified';
    const skillsArray = skills.split(',').map(skill => skill.trim());
    return skillsArray.slice(0, 3).join(', ') + (skillsArray.length > 3 ? '...' : '');
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

function getFavorites() {
    const favoritesJson = localStorage.getItem('favorites');
    return favoritesJson ? JSON.parse(favoritesJson) : [];
}

function getReports() {
    const reportsJson = localStorage.getItem('reports');
    return reportsJson ? JSON.parse(reportsJson) : [];
}

// Export functions for use in other files
window.quickViewInternship = quickViewInternship;
window.saveToFavorites = saveToFavorites;
window.shareInternship = shareInternship;
window.reportInternship = reportInternship;
window.performAdvancedSearch = performAdvancedSearch;