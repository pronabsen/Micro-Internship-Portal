// Main JavaScript file for Micro-Internship Portal

// Global variables
let currentUser = null;
let internships = [];
let applications = [];
let users = [];
let employers = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    loadInternships();
    animateStats();
    setupEventListeners();
});

// Initialize application
function initializeApp() {
    // Check if user is logged in
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateNavigation();
    }
    
    // Load sample data
    loadSampleData();
    
    // Initialize animations
    animateOnScroll();
}

// Load sample data
function loadSampleData() {
    // Sample internships
    internships = [
        {
            id: 1,
            title: "Frontend Web Development",
            company: "TechCorp Solutions",
            category: "web-development",
            description: "Looking for a frontend developer to help build responsive web applications using React and modern CSS.",
            skillsRequired: "React, JavaScript, CSS, HTML",
            duration: "2-months",
            stipend: 500,
            workType: "remote",
            postedDate: "2024-01-15",
            applicationDeadline: "2024-02-15",
            applications: 12
        },
        {
            id: 2,
            title: "Mobile App UI Design",
            company: "DesignHub",
            category: "design",
            description: "Create beautiful and intuitive mobile app designs for our upcoming productivity application.",
            skillsRequired: "Figma, UI/UX Design, Mobile Design",
            duration: "1-month",
            stipend: 400,
            workType: "remote",
            postedDate: "2024-01-10",
            applicationDeadline: "2024-02-10",
            applications: 8
        },
        {
            id: 3,
            title: "Data Analysis Project",
            company: "DataInsights",
            category: "data-science",
            description: "Analyze customer data and create visualizations to help business decision-making.",
            skillsRequired: "Python, Pandas, Data Visualization, Statistics",
            duration: "6-weeks",
            stipend: 600,
            workType: "hybrid",
            postedDate: "2024-01-12",
            applicationDeadline: "2024-02-05",
            applications: 15
        },
        {
            id: 4,
            title: "Content Writing for Tech Blog",
            company: "TechWrite Media",
            category: "content-writing",
            description: "Write engaging technical articles for our popular technology blog.",
            skillsRequired: "Technical Writing, SEO, Research Skills",
            duration: "1-month",
            stipend: 300,
            workType: "remote",
            postedDate: "2024-01-08",
            applicationDeadline: "2024-02-08",
            applications: 6
        },
        {
            id: 5,
            title: "Social Media Marketing",
            company: "GrowthHackers",
            category: "marketing",
            description: "Manage and grow our social media presence across multiple platforms.",
            skillsRequired: "Social Media Management, Content Creation, Analytics",
            duration: "3-months",
            stipend: 350,
            workType: "remote",
            postedDate: "2024-01-05",
            applicationDeadline: "2024-02-20",
            applications: 20
        },
        {
            id: 6,
            title: "Backend API Development",
            company: "CloudTech",
            category: "web-development",
            description: "Develop RESTful APIs for our cloud-based application platform.",
            skillsRequired: "Node.js, Express, MongoDB, REST APIs",
            duration: "2-months",
            stipend: 700,
            workType: "remote",
            postedDate: "2024-01-18",
            applicationDeadline: "2024-02-18",
            applications: 18
        }
    ];
    
    // Sample users
    users = [
        {
            id: 1,
            name: "John Doe",
            email: "john.doe@example.com",
            role: "user",
            skills: "JavaScript, React, Node.js",
            bio: "Passionate web developer with 2 years of experience.",
            applications: 5,
            completed: 3,
            rating: 4.5,
            points: 850
        },
        {
            id: 2,
            name: "Jane Smith",
            email: "jane.smith@example.com",
            role: "user",
            skills: "UI/UX Design, Figma, Adobe XD",
            bio: "Creative designer focused on user experience.",
            applications: 8,
            completed: 6,
            rating: 4.8,
            points: 1200
        }
    ];
    
    // Sample employers
    employers = [
        {
            id: 1,
            companyName: "TechCorp Solutions",
            email: "hr@techcorp.com",
            industry: "technology",
            companySize: "201-500",
            verified: true,
            website: "www.techcorp.com",
            internshipsPosted: 12,
            internsHired: 8,
            rating: 4.6
        },
        {
            id: 2,
            companyName: "DesignHub",
            email: "careers@designhub.com",
            industry: "design",
            companySize: "51-200",
            verified: true,
            website: "www.designhub.com",
            internshipsPosted: 6,
            internsHired: 4,
            rating: 4.9
        }
    ];
}

// Setup event listeners
function setupEventListeners() {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
    
    // Dropdown menus
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            const dropdown = this.nextElementSibling;
            dropdown.classList.toggle('show');
        });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.matches('.dropdown-toggle')) {
            const dropdowns = document.querySelectorAll('.dropdown-menu');
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('show');
            });
        }
    });
    
    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Load internships on main page
function loadInternships() {
    const internshipsGrid = document.getElementById('internshipsGrid');
    if (!internshipsGrid) return;
    
    internshipsGrid.innerHTML = '';
    
    internships.forEach(internship => {
        const card = createInternshipCard(internship);
        internshipsGrid.appendChild(card);
    });
}

// Create internship card element
function createInternshipCard(internship) {
    const card = document.createElement('div');
    card.className = 'internship-card fade-in';
    card.innerHTML = `
        <div class="internship-header">
            <div>
                <h3 class="internship-title">${internship.title}</h3>
                <p class="internship-company">${internship.company}</p>
            </div>
            <span class="internship-category">${formatCategory(internship.category)}</span>
        </div>
        <p class="internship-description">${internship.description}</p>
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
                <i class="fas fa-calendar"></i>
                <span>Deadline: ${formatDate(internship.applicationDeadline)}</span>
            </div>
        </div>
        <div class="internship-footer">
            <div class="internship-stipend">
                ${internship.stipend ? `$${internship.stipend}/month` : 'Unpaid'}
            </div>
            <button class="btn btn-primary btn-sm" onclick="viewInternshipDetails(${internship.id})">
                View Details
            </button>
        </div>
    `;
    return card;
}

// Format category name
function formatCategory(category) {
    return category.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

// Format duration
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

// Format work type
function formatWorkType(workType) {
    const workTypeMap = {
        'remote': 'Remote',
        'onsite': 'On-site',
        'hybrid': 'Hybrid'
    };
    return workTypeMap[workType] || workType;
}

// Format date
function formatDate(dateString) {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// View internship details
function viewInternshipDetails(internshipId) {
    const internship = internships.find(i => i.id === internshipId);
    if (!internship) return;
    
    // Show modal with internship details
    showModal('Internship Details', `
        <div class="internship-details">
            <h3>${internship.title}</h3>
            <p><strong>Company:</strong> ${internship.company}</p>
            <p><strong>Category:</strong> ${formatCategory(internship.category)}</p>
            <p><strong>Description:</strong> ${internship.description}</p>
            <p><strong>Skills Required:</strong> ${internship.skillsRequired}</p>
            <p><strong>Duration:</strong> ${formatDuration(internship.duration)}</p>
            <p><strong>Stipend:</strong> ${internship.stipend ? `$${internship.stipend}/month` : 'Unpaid'}</p>
            <p><strong>Work Type:</strong> ${formatWorkType(internship.workType)}</p>
            <p><strong>Application Deadline:</strong> ${formatDate(internship.applicationDeadline)}</p>
            <p><strong>Applications:</strong> ${internship.applications}</p>
            <div class="modal-actions">
                <button class="btn btn-primary" onclick="applyForInternship(${internshipId})">
                    Apply Now
                </button>
                <button class="btn btn-outline" onclick="closeModal()">
                    Close
                </button>
            </div>
        </div>
    `);
}

// Apply for internship
function applyForInternship(internshipId) {
    if (!currentUser) {
        showLogin();
        return;
    }
    
    if (currentUser.role === 'employer') {
        alert('Employers cannot apply for internships. Please switch to user account.');
        return;
    }
    
    const internship = internships.find(i => i.id === internshipId);
    if (!internship) return;
    
    // Check if already applied
    const existingApplication = applications.find(app => 
        app.internshipId === internshipId && app.userId === currentUser.id
    );
    
    if (existingApplication) {
        alert('You have already applied for this internship.');
        return;
    }
    
    // Show application form
    showModal('Apply for Internship', `
        <form id="applicationForm">
            <div class="form-group">
                <label for="coverLetter">Cover Letter</label>
                <textarea id="coverLetter" name="coverLetter" rows="6" required 
                    placeholder="Tell us why you're interested in this internship..."></textarea>
            </div>
            <div class="form-group">
                <label for="availability">Availability</label>
                <input type="text" id="availability" name="availability" required 
                    placeholder="e.g., Available immediately, can work 20 hours/week">
            </div>
            <div class="form-actions">
                <button type="submit" class="btn btn-primary">
                    Submit Application
                </button>
                <button type="button" class="btn btn-outline" onclick="closeModal()">
                    Cancel
                </button>
            </div>
        </form>
    `);
    
    // Handle application form submission
    const form = document.getElementById('applicationForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const application = {
            id: applications.length + 1,
            internshipId: internshipId,
            userId: currentUser.id,
            coverLetter: document.getElementById('coverLetter').value,
            availability: document.getElementById('availability').value,
            status: 'pending',
            appliedDate: new Date().toISOString().split('T')[0]
        };
        
        applications.push(application);
        internship.applications++;
        
        alert('Application submitted successfully!');
        closeModal();
        loadInternships(); // Refresh the internships grid
    });
}

// Search internships
function searchInternships() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const category = document.getElementById('categoryFilter').value;
    const duration = document.getElementById('durationFilter').value;
    
    const filteredInternships = internships.filter(internship => {
        const matchesSearch = !searchTerm || 
            internship.title.toLowerCase().includes(searchTerm) ||
            internship.company.toLowerCase().includes(searchTerm) ||
            internship.description.toLowerCase().includes(searchTerm);
        
        const matchesCategory = !category || internship.category === category;
        const matchesDuration = !duration || internship.duration === duration;
        
        return matchesSearch && matchesCategory && matchesDuration;
    });
    
    const internshipsGrid = document.getElementById('internshipsGrid');
    internshipsGrid.innerHTML = '';
    
    if (filteredInternships.length === 0) {
        internshipsGrid.innerHTML = '<p>No internships found matching your criteria.</p>';
        return;
    }
    
    filteredInternships.forEach(internship => {
        const card = createInternshipCard(internship);
        internshipsGrid.appendChild(card);
    });
}

// Filter internships
function filterInternships() {
    searchInternships(); // Reuse search logic
}

// Load more internships
function loadMoreInternships() {
    // In a real application, this would load more internships from the server
    alert('No more internships to load. This is a demo application.');
}

// Scroll to internships section
function scrollToInternships() {
    const internshipsSection = document.getElementById('internships');
    if (internshipsSection) {
        internshipsSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Animate statistics
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        const increment = target / 100;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                stat.textContent = Math.ceil(current);
                setTimeout(updateCounter, 20);
            } else {
                stat.textContent = target;
            }
        };
        
        updateCounter();
    });
}

// Animate elements on scroll
function animateOnScroll() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    const elementsToAnimate = document.querySelectorAll('.feature-card, .testimonial-card, .internship-card');
    elementsToAnimate.forEach(element => {
        observer.observe(element);
    });
}

// Update navigation based on user login status
function updateNavigation() {
    const navAuth = document.querySelector('.nav-auth');
    if (!navAuth) return;
    
    if (currentUser) {
        navAuth.innerHTML = `
            <div class="nav-dropdown">
                <button class="nav-link dropdown-toggle">
                    <i class="fas fa-user-circle"></i>
                    <span>${currentUser.name || currentUser.companyName}</span>
                    <i class="fas fa-chevron-down"></i>
                </button>
                <div class="dropdown-menu">
                    <a href="${currentUser.role === 'admin' ? 'admin-dashboard.html' : (currentUser.role === 'employer' ? 'employer-dashboard.html' : 'dashboard.html')}" class="dropdown-item">
                        <i class="fas fa-tachometer-alt"></i> Dashboard
                    </a>
                    <a href="#" class="dropdown-item" onclick="logout()">
                        <i class="fas fa-sign-out-alt"></i> Logout
                    </a>
                </div>
            </div>
        `;
    } else {
        navAuth.innerHTML = `
            <button class="btn btn-outline" onclick="showLogin()">Login</button>
            <button class="btn btn-primary" onclick="showRegister()">Register</button>
        `;
    }
}

// Modal functions
function showModal(title, content) {
    const modalContainer = document.getElementById('modalContainer');
    if (!modalContainer) return;
    
    modalContainer.innerHTML = `
        <div class="modal-overlay" onclick="closeModal()"></div>
        <div class="modal">
            <div class="modal-header">
                <h2>${title}</h2>
                <button class="modal-close" onclick="closeModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                ${content}
            </div>
        </div>
    `;
    
    modalContainer.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modalContainer = document.getElementById('modalContainer');
    if (!modalContainer) return;
    
    modalContainer.innerHTML = '';
    modalContainer.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Navigation functions
function showLogin() {
    window.location.href = 'login.html';
}

function showRegister() {
    window.location.href = 'register.html';
}

function showEmployerRegister() {
    window.location.href = 'register.html#employer';
}

function logout() {
    localStorage.removeItem('currentUser');
    currentUser = null;
    updateNavigation();
    window.location.href = 'index.html';
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

function formatDateForInput(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Export functions for use in other files
window.viewInternshipDetails = viewInternshipDetails;
window.applyForInternship = applyForInternship;
window.searchInternships = searchInternships;
window.filterInternships = filterInternships;
window.loadMoreInternships = loadMoreInternships;
window.scrollToInternships = scrollToInternships;
window.showLogin = showLogin;
window.showRegister = showRegister;
window.showEmployerRegister = showEmployerRegister;
window.logout = logout;
window.closeModal = closeModal;