
document.addEventListener('DOMContentLoaded', function () {
    initializeApp();
});

let currentUser = null;
let currentPage = 'home';
let internships = [];
let users = [];
let employers = [];
let applications = [];
let reviews = [];

function initializeApp() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUIForLoggedInUser();
    }
    initializeDummyData();
    loadFeaturedInternships();
    setupEventListeners();
    showPage('home');
}

function initializeDummyData() {

    internships = [
        {
            id: 1,
            title: "Frontend Development Intern",
            company: "Tech Solutions Inc.",
            category: "development",
            description: "We are looking for a frontend development intern to help us build responsive web applications using React and modern CSS frameworks.",
            duration: "1-2 months",
            stipend: 5000,
            skills: ["React", "CSS", "JavaScript", "HTML"],
            postedDate: new Date('2023-05-15'),
            deadline: new Date('2023-06-15'),
            image: "https://picsum.photos/seed/internship1/400/300.jpg",
            status: "active",
            applications: 12
        },
        {
            id: 2,
            title: "UI/UX Design Intern",
            company: "Creative Studios",
            category: "design",
            description: "Join our design team to create beautiful and intuitive user interfaces for web and mobile applications.",
            duration: "3-4 weeks",
            stipend: 4000,
            skills: ["Figma", "Adobe XD", "Prototyping", "User Research"],
            postedDate: new Date('2023-05-20'),
            deadline: new Date('2023-06-10'),
            image: "https://picsum.photos/seed/internship2/400/300.jpg",
            status: "active",
            applications: 8
        },
        {
            id: 3,
            title: "Digital Marketing Intern",
            company: "Marketing Pro",
            category: "marketing",
            description: "Help us develop and implement digital marketing strategies across various social media platforms.",
            duration: "1-2 months",
            stipend: 3000,
            skills: ["Social Media", "Content Creation", "SEO", "Analytics"],
            postedDate: new Date('2023-05-25'),
            deadline: new Date('2023-06-20'),
            image: "https://picsum.photos/seed/internship3/400/300.jpg",
            status: "active",
            applications: 15
        },
        {
            id: 4,
            title: "Data Science Research Intern",
            company: "Data Insights Co.",
            category: "research",
            description: "Join our research team to work on cutting-edge data science projects and machine learning models.",
            duration: "3+ months",
            stipend: 8000,
            skills: ["Python", "Machine Learning", "Data Analysis", "Statistics"],
            postedDate: new Date('2023-05-10'),
            deadline: new Date('2023-06-05'),
            image: "https://picsum.photos/seed/internship4/400/300.jpg",
            status: "active",
            applications: 20
        },
        {
            id: 5,
            title: "Content Writing Intern",
            company: "Content Creators Ltd.",
            category: "writing",
            description: "Create engaging content for our blog, social media, and marketing materials.",
            duration: "1-2 weeks",
            stipend: 2000,
            skills: ["Writing", "Editing", "SEO", "Content Strategy"],
            postedDate: new Date('2023-05-28'),
            deadline: new Date('2023-06-01'),
            image: "https://picsum.photos/seed/internship5/400/300.jpg",
            status: "active",
            applications: 6
        },
        {
            id: 6,
            title: "Backend Development Intern",
            company: "Server Solutions",
            category: "development",
            description: "Work on server-side applications and APIs using Node.js and Express.",
            duration: "2-3 months",
            stipend: 6000,
            skills: ["Node.js", "Express", "MongoDB", "REST APIs"],
            postedDate: new Date('2023-05-18'),
            deadline: new Date('2023-06-12'),
            image: "https://picsum.photos/seed/internship6/400/300.jpg",
            status: "active",
            applications: 10
        }
    ];

    users = [
        {
            id: 1,
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            password: "password123",
            role: "user",
            bio: "I'm a passionate computer science student with a keen interest in web development and machine learning.",
            education: "Bachelor of Science in Computer Science, University of Technology",
            skills: ["JavaScript", "React", "Node.js", "Python", "Machine Learning"],
            points: 850,
            rank: 12,
            completed: 5,
            avatar: "https://picsum.photos/seed/user1/200/200.jpg"
        },
        {
            id: 2,
            firstName: "Jane",
            lastName: "Smith",
            email: "jane.smith@example.com",
            password: "password123",
            role: "user",
            bio: "Design enthusiast with a passion for creating beautiful and functional user interfaces.",
            education: "Bachelor of Design, Art Institute",
            skills: ["UI Design", "UX Research", "Figma", "Adobe XD"],
            points: 920,
            rank: 8,
            completed: 7,
            avatar: "https://picsum.photos/seed/user2/200/200.jpg"
        },
        {
            id: 3,
            firstName: "Michael",
            lastName: "Johnson",
            email: "michael.johnson@example.com",
            password: "password123",
            role: "user",
            bio: "Marketing specialist with experience in digital campaigns and content creation.",
            education: "MBA in Marketing, Business School",
            skills: ["Digital Marketing", "Content Strategy", "SEO", "Analytics"],
            points: 780,
            rank: 15,
            completed: 4,
            avatar: "https://picsum.photos/seed/user3/200/200.jpg"
        },
        {
            id: 4,
            firstName: "Pronab",
            lastName: "Sen",
            email: "user@gmail.com",
            password: "123456",
            role: "user",
            bio: "Marketing specialist with experience in digital campaigns and content creation.",
            education: "MBA in Marketing, Business School",
            skills: ["Digital Marketing", "Content Strategy", "SEO", "Analytics"],
            points: 780,
            rank: 15,
            completed: 4,
            avatar: "https://picsum.photos/seed/user3/200/200.jpg"
        }
    ];
    employers = [
        {
            id: 1,
            companyName: "PronabSenGupta",
            email: "admin@gmail.com",
            password: "123456",
            role: "admin",
            website: "https://pronab.tech",
            description: "An incubator for early-stage startups looking for talented interns to help bring their ideas to life.",
            size: "1-10",
            location: "Austin, TX",
            verified: true,
            avatar: "https://picsum.photos/seed/company3/200/200.jpg"
        },
        {
            id: 2,
            companyName: "Tech Solutions Inc.",
            email: "empolyee@gmail.com",
            password: "123456",
            role: "employer",
            website: "https://pronab.tech",
            description: "We are a leading technology company specializing in innovative software solutions for businesses worldwide.",
            size: "11-50",
            location: "San Francisco, CA",
            verified: true,
            avatar: "https://picsum.photos/seed/company1/200/200.jpg"
        }
    ];
    applications = [
        {
            id: 1,
            internshipId: 1,
            userId: 1,
            employerId: 1,
            coverLetter: "I am excited about the opportunity to work as a frontend development intern at Tech Solutions Inc. My experience with React and modern CSS frameworks makes me a strong candidate for this position.",
            availability: "Available immediately, 20 hours per week",
            expectedStart: "2023-06-15",
            status: "pending",
            appliedDate: new Date('2023-05-30')
        },
        {
            id: 2,
            internshipId: 2,
            userId: 2,
            employerId: 2,
            coverLetter: "As a design enthusiast with a passion for creating beautiful user interfaces, I believe I would be a great fit for the UI/UX Design Intern position at Creative Studios.",
            availability: "Available from June 1, 30 hours per week",
            expectedStart: "2023-06-01",
            status: "approved",
            appliedDate: new Date('2023-05-28')
        },
        {
            id: 3,
            internshipId: 3,
            userId: 3,
            employerId: 3,
            coverLetter: "With my background in digital marketing and content creation, I am excited about the opportunity to contribute to Marketing Pro's digital strategies.",
            availability: "Available from June 10, 25 hours per week",
            expectedStart: "2023-06-10",
            status: "rejected",
            appliedDate: new Date('2023-05-25')
        }
    ];
    reviews = [
        {
            id: 1,
            internshipId: 2,
            userId: 2,
            employerId: 2,
            rating: 5,
            feedback: "Great experience! The team was supportive and I learned a lot about UI/UX design principles.",
            date: new Date('2023-05-20')
        },
        {
            id: 2,
            internshipId: 1,
            userId: 1,
            employerId: 1,
            rating: 4,
            feedback: "Good internship with challenging projects. I gained valuable experience in React development.",
            date: new Date('2023-05-15')
        }
    ];
    localStorage.setItem('internships', JSON.stringify(internships));
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('employers', JSON.stringify(employers));
    localStorage.setItem('applications', JSON.stringify(applications));
    localStorage.setItem('reviews', JSON.stringify(reviews));
}

function setupEventListeners() {

    document.getElementById('loginForm').addEventListener('submit', function (e) {
        e.preventDefault();
        handleLogin();
    });

    document.getElementById('userRegisterForm').addEventListener('submit', function (e) {
        e.preventDefault();
        handleUserRegistration();
    });

    document.getElementById('employerRegisterForm').addEventListener('submit', function (e) {
        e.preventDefault();
        handleEmployerRegistration();
    });

    document.getElementById('postInternshipForm').addEventListener('submit', function (e) {
        e.preventDefault();
        handlePostInternship();
    });

    document.getElementById('companyProfileForm').addEventListener('submit', function (e) {
        e.preventDefault();
        handleUpdateCompanyProfile();
    });

    document.getElementById('applicationForm').addEventListener('submit', function (e) {
        e.preventDefault();
        handleApplicationSubmission();
    });

    document.getElementById('editProfileForm').addEventListener('submit', function (e) {
        e.preventDefault();
        handleEditProfile();
    });

    document.getElementById('reviewForm').addEventListener('submit', function (e) {
        e.preventDefault();
        handleReviewSubmission();
    });

    document.querySelectorAll('.rating-star').forEach(star => {
        star.addEventListener('click', function () {
            const rating = parseInt(this.getAttribute('data-rating'));
            document.getElementById('reviewRating').value = rating;

            document.querySelectorAll('.rating-star').forEach((s, index) => {
                if (index < rating) {
                    s.classList.remove('bi-star');
                    s.classList.add('bi-star-fill');
                } else {
                    s.classList.remove('bi-star-fill');
                    s.classList.add('bi-star');
                }
            });
        });
    });

    document.getElementById('searchBtn').addEventListener('click', function () {
        handleSearch();
    });

    document.getElementById('categoryFilter').addEventListener('change', handleFilter);
    document.getElementById('durationFilter').addEventListener('change', handleFilter);
    document.getElementById('stipendFilter').addEventListener('change', handleFilter);
    document.getElementById('sortBy').addEventListener('change', handleFilter);
}

function showPage(page) {

    document.querySelectorAll('.page-content').forEach(p => {
        p.style.display = 'none';
    });

    document.getElementById(page + 'Page').style.display = 'block';
    currentPage = page;

    switch (page) {
        case 'home':
            loadFeaturedInternships();
            break;
        case 'internships':
            loadInternships();
            break;
        case 'profile':
            loadUserProfile();
            break;
        case 'employerDashboard':
            loadEmployerDashboard();
            break;
        case 'adminDashboard':
            loadAdminDashboard();
            break;
        case 'leaderboard':
            loadLeaderboard();
            break;
        case 'notifications':
            loadNotifications();
            break;
    }
}

function handleLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        updateUIForLoggedInUser();
        showNotification('Login successful!', 'success');

        if (user.role === 'user') {
            showPage('profile');
        } else if (user.role === 'employer') {
            showPage('employerDashboard');
        } else if (user.role === 'admin') {
            showPage('adminDashboard');
        }
    } else {
        const employer = employers.find(e => e.email === email && e.password === password);

        if (employer) {
            currentUser = employer;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            updateUIForLoggedInUser();
            showNotification('Login successful!', 'success');
            showPage('employerDashboard');
        } else {
            showNotification('Invalid email or password!', 'danger');
        }
    }
}

function handleUserRegistration() {
    const firstName = document.getElementById('userFirstName').value;
    const lastName = document.getElementById('userLastName').value;
    const email = document.getElementById('userEmail').value;
    const password = document.getElementById('userPassword').value;
    const confirmPassword = document.getElementById('userConfirmPassword').value;
    const education = document.getElementById('userEducation').value;
    const skills = document.getElementById('userSkills').value;

    if (password !== confirmPassword) {
        showNotification('Passwords do not match!', 'danger');
        return;
    }

    if (users.find(u => u.email === email)) {
        showNotification('User with this email already exists!', 'danger');
        return;
    }

    const newUser = {
        id: users.length + 1,
        firstName,
        lastName,
        email,
        password,
        role: 'user',
        bio: '',
        education,
        skills: skills.split(',').map(s => s.trim()),
        points: 0,
        rank: 0,
        completed: 0,
        avatar: `https://picsum.photos/seed/user${users.length + 1}/200/200.jpg`
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    showNotification('Registration successful! Please login.', 'success');
    showPage('login');
}

function handleEmployerRegistration() {
    const companyName = document.getElementById('companyName').value;
    const email = document.getElementById('companyEmail').value;
    const password = document.getElementById('companyPassword').value;
    const confirmPassword = document.getElementById('companyConfirmPassword').value;
    const website = document.getElementById('companyWebsite').value;
    const description = document.getElementById('companyDescription').value;

    if (password !== confirmPassword) {
        showNotification('Passwords do not match!', 'danger');
        return;
    }

    if (employers.find(e => e.email === email)) {
        showNotification('Employer with this email already exists!', 'danger');
        return;
    }

    const newEmployer = {
        id: employers.length + 1,
        companyName,
        email,
        password,
        role: 'employer',
        website,
        description,
        size: '',
        location: '',
        verified: false,
        avatar: `https://picsum.photos/seed/company${employers.length + 1}/200/200.jpg`
    };

    employers.push(newEmployer);
    localStorage.setItem('employers', JSON.stringify(employers));

    showNotification('Registration successful! Your account is pending verification. Please login.', 'success');
    showPage('login');
}

function updateUIForLoggedInUser() {
    if (!currentUser) return;

    const userInfo = document.getElementById('userInfo');
    userInfo.innerHTML = `
                <img src="${currentUser.avatar}" alt="Profile" class="user-avatar">
                <div class="dropdown">
                    <a class="nav-link dropdown-toggle" href="#" role="button" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                        ${currentUser.firstName || currentUser.companyName}
                    </a>
                    <ul class="dropdown-menu" aria-labelledby="userDropdown">
                        <li><a class="dropdown-item" href="#" onclick="showPage('profile')">Profile</a></li>
                        <li><a class="dropdown-item" href="#" onclick="showPage('settings')">Settings</a></li>
                        <li><hr class="dropdown-divider"></li>
                        <li><a class="dropdown-item" href="#" onclick="handleLogout()">Logout</a></li>
                    </ul>
                </div>
            `;

    document.getElementById('userNav').style.display = currentUser.role === 'user' ? 'block' : 'none';
    document.getElementById('employerNav').style.display = currentUser.role === 'employer' ? 'block' : 'none';
    document.getElementById('adminNav').style.display = currentUser.role === 'admin' ? 'block' : 'none';
}

function handleLogout() {
    currentUser = null;
    localStorage.removeItem('currentUser');

    document.getElementById('userInfo').innerHTML = '<a class="nav-link" href="#" onclick="showPage(\'login\')">Login</a>';

    document.getElementById('userNav').style.display = 'none';
    document.getElementById('employerNav').style.display = 'none';
    document.getElementById('adminNav').style.display = 'none';

    showNotification('You have been logged out.', 'info');
    showPage('home');
}

function loadFeaturedInternships() {
    const featuredInternshipsContainer = document.getElementById('featuredInternships');
    featuredInternshipsContainer.innerHTML = '';

    const featured = internships.slice(0, 3);

    featured.forEach(internship => {
        const internshipCard = createInternshipCard(internship);
        featuredInternshipsContainer.appendChild(internshipCard);
    });
}

function loadInternships() {
    const internshipsList = document.getElementById('internshipsList');
    internshipsList.innerHTML = '';

    internships.forEach(internship => {
        const internshipCard = createInternshipCard(internship);
        internshipsList.appendChild(internshipCard);
    });
}

function createInternshipCard(internship) {
    const col = document.createElement('div');
    col.className = 'col-md-4 mb-4';

    const card = document.createElement('div');
    card.className = 'card internship-card';

    const img = document.createElement('img');
    img.src = internship.image;
    img.className = 'card-img-top';
    img.alt = internship.title;

    const badge = document.createElement('div');
    badge.className = 'internship-badge';
    badge.textContent = internship.category;

    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    const title = document.createElement('h5');
    title.className = 'card-title';
    title.textContent = internship.title;

    const company = document.createElement('p');
    company.className = 'card-text text-muted';
    company.innerHTML = `<i class="bi bi-building me-1"></i> ${internship.company}`;

    const duration = document.createElement('p');
    duration.className = 'card-text text-muted';
    duration.innerHTML = `<i class="bi bi-clock me-1"></i> ${internship.duration}`;

    const stipend = document.createElement('p');
    stipend.className = 'card-text stipend';
    stipend.innerHTML = `<i class="bi bi-currency-dollar me-1"></i> ${internship.stipend}`;

    const btnContainer = document.createElement('div');
    btnContainer.className = 'd-flex justify-content-between';

    const detailsBtn = document.createElement('button');
    detailsBtn.className = 'btn btn-outline-primary btn-sm';
    detailsBtn.textContent = 'View Details';
    detailsBtn.onclick = () => showInternshipDetails(internship.id);

    const applyBtn = document.createElement('button');
    applyBtn.className = 'btn btn-primary btn-sm';
    applyBtn.textContent = 'Apply Now';
    applyBtn.onclick = () => showApplicationForm(internship.id);

    btnContainer.appendChild(detailsBtn);
    btnContainer.appendChild(applyBtn);

    cardBody.appendChild(title);
    cardBody.appendChild(company);
    cardBody.appendChild(duration);
    cardBody.appendChild(stipend);
    cardBody.appendChild(btnContainer);

    card.appendChild(img);
    card.appendChild(badge);
    card.appendChild(cardBody);

    col.appendChild(card);

    return col;
}

function showInternshipDetails(internshipId) {
    const internship = internships.find(i => i.id === internshipId);
    if (!internship) return;

    const modal = new bootstrap.Modal(document.getElementById('internshipDetailsModal'));
    const content = document.getElementById('internshipDetailsContent');

    content.innerHTML = `
                <div class="row">
                    <div class="col-md-6">
                        <img src="${internship.image}" alt="${internship.title}" class="img-fluid rounded">
                    </div>
                    <div class="col-md-6">
                        <h4>${internship.title}</h4>
                        <p class="text-muted"><i class="bi bi-building me-1"></i> ${internship.company}</p>
                        <p><strong>Category:</strong> ${internship.category}</p>
                        <p><strong>Duration:</strong> ${internship.duration}</p>
                        <p><strong>Stipend:</strong> $${internship.stipend}</p>
                        <p><strong>Posted Date:</strong> ${internship.postedDate.toLocaleDateString()}</p>
                        <p><strong>Application Deadline:</strong> ${internship.deadline.toLocaleDateString()}</p>
                        <p><strong>Applications:</strong> ${internship.applications}</p>
                    </div>
                </div>
                <div class="mt-4">
                    <h5>Description</h5>
                    <p>${internship.description}</p>
                </div>
                <div class="mt-4">
                    <h5>Required Skills</h5>
                    <div>
                        ${internship.skills.map(skill => `<span class="badge bg-primary me-2 mb-2">${skill}</span>`).join('')}
                    </div>
                </div>
            `;

    document.getElementById('applyInternshipBtn').onclick = () => {
        modal.hide();
        showApplicationForm(internshipId);
    };

    modal.show();
}

function showApplicationForm(internshipId) {
    if (!currentUser) {
        showNotification('Please login to apply for internships.', 'warning');
        showPage('login');
        return;
    }

    if (currentUser.role !== 'user') {
        showNotification('Only students can apply for internships.', 'warning');
        return;
    }

    const modal = new bootstrap.Modal(document.getElementById('applicationModal'));

    document.getElementById('submitApplicationBtn').onclick = () => {
        handleApplicationSubmission(internshipId);
        modal.hide();
    };

    modal.show();
}

function handleApplicationSubmission(internshipId) {
    const coverLetter = document.getElementById('coverLetter').value;
    const availability = document.getElementById('availability').value;
    const expectedStart = document.getElementById('expectedStart').value;

    const newApplication = {
        id: applications.length + 1,
        internshipId,
        userId: currentUser.id,
        employerId: internships.find(i => i.id === internshipId).employerId || 1,
        coverLetter,
        availability,
        expectedStart,
        status: 'pending',
        appliedDate: new Date()
    };

    applications.push(newApplication);
    localStorage.setItem('applications', JSON.stringify(applications));

    const internship = internships.find(i => i.id === internshipId);
    if (internship) {
        internship.applications++;
        localStorage.setItem('internships', JSON.stringify(internships));
    }

    showNotification('Application submitted successfully!', 'success');

    document.getElementById('applicationForm').reset();
}

function loadUserProfile() {
    if (!currentUser || currentUser.role !== 'user') {
        showNotification('Please login as a student to view your profile.', 'warning');
        showPage('login');
        return;
    }

    document.getElementById('profileName').textContent = `${currentUser.firstName} ${currentUser.lastName}`;
    document.getElementById('profileEmail').textContent = currentUser.email;
    document.getElementById('profilePoints').textContent = currentUser.points;
    document.getElementById('profileRank').textContent = currentUser.rank;
    document.getElementById('profileCompleted').textContent = currentUser.completed;
    document.getElementById('profileBio').textContent = currentUser.bio;
    document.getElementById('profileEducation').textContent = currentUser.education;

    const skillsContainer = document.getElementById('profileSkills');
    skillsContainer.innerHTML = '';
    currentUser.skills.forEach(skill => {
        const badge = document.createElement('span');
        badge.className = 'badge bg-primary me-2 mb-2';
        badge.textContent = skill;
        skillsContainer.appendChild(badge);
    });

    loadUserApplications();

    loadUserReviews();
}

function loadUserApplications() {
    const applicationsTable = document.getElementById('applicationsTable');
    applicationsTable.innerHTML = '';

    const userApplications = applications.filter(a => a.userId === currentUser.id);

    if (userApplications.length === 0) {
        applicationsTable.innerHTML = '<tr><td colspan="5" class="text-center">No applications yet.</td></tr>';
        return;
    }

    userApplications.forEach(application => {
        const internship = internships.find(i => i.id === application.internshipId);
        if (!internship) return;

        const row = document.createElement('tr');

        let statusClass = '';
        let statusText = '';

        switch (application.status) {
            case 'pending':
                statusClass = 'status-pending';
                statusText = 'Pending';
                break;
            case 'approved':
                statusClass = 'status-approved';
                statusText = 'Approved';
                break;
            case 'rejected':
                statusClass = 'status-rejected';
                statusText = 'Rejected';
                break;
        }

        row.innerHTML = `
                    <td>${internship.title}</td>
                    <td>${internship.company}</td>
                    <td>${application.appliedDate.toLocaleDateString()}</td>
                    <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                    <td>
                        ${application.status === 'approved' ?
                `<button class="btn btn-sm btn-success" onclick="showReviewForm(${application.id})">Leave Review</button>` :
                ''}
                    </td>
                `;

        applicationsTable.appendChild(row);
    });
}

function loadUserReviews() {
    const reviewsList = document.getElementById('reviewsList');
    reviewsList.innerHTML = '';

    const userReviews = reviews.filter(r => r.userId === currentUser.id);

    if (userReviews.length === 0) {
        reviewsList.innerHTML = '<p>No reviews yet.</p>';
        return;
    }

    userReviews.forEach(review => {
        const internship = internships.find(i => i.id === review.internshipId);
        const employer = employers.find(e => e.id === review.employerId);

        if (!internship || !employer) return;

        const reviewCard = document.createElement('div');
        reviewCard.className = 'review-card';

        reviewCard.innerHTML = `
                    <div class="review-header">
                        <div class="reviewer-info">
                            <img src="${employer.avatar}" alt="${employer.companyName}" class="reviewer-avatar">
                            <div>
                                <h6>${employer.companyName}</h6>
                                <p class="text-muted mb-0">${internship.title}</p>
                            </div>
                        </div>
                        <div class="rating">
                            ${Array(review.rating).fill().map(() => '<i class="bi bi-star-fill"></i>').join('')}
                            ${Array(5 - review.rating).fill().map(() => '<i class="bi bi-star"></i>').join('')}
                        </div>
                    </div>
                    <p>${review.feedback}</p>
                    <small class="text-muted">${review.date.toLocaleDateString()}</small>
                `;

        reviewsList.appendChild(reviewCard);
    });
}

function showEditProfile() {
    document.getElementById('editBio').value = currentUser.bio;
    document.getElementById('editEducation').value = currentUser.education;
    document.getElementById('editSkills').value = currentUser.skills.join(', ');

    const modal = new bootstrap.Modal(document.getElementById('editProfileModal'));
    modal.show();
}

function handleEditProfile() {
    const bio = document.getElementById('editBio').value;
    const education = document.getElementById('editEducation').value;
    const skills = document.getElementById('editSkills').value;

    currentUser.bio = bio;
    currentUser.education = education;
    currentUser.skills = skills.split(',').map(s => s.trim());

    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        users[userIndex] = currentUser;
        localStorage.setItem('users', JSON.stringify(users));
    }

    localStorage.setItem('currentUser', JSON.stringify(currentUser));

    showNotification('Profile updated successfully!', 'success');
    loadUserProfile();
}

function loadEmployerDashboard() {
    if (!currentUser || currentUser.role !== 'employer') {
        showNotification('Please login as an employer to view your dashboard.', 'warning');
        showPage('login');
        return;
    }

    loadEmployerInternships();

    loadApplicants();
}

function loadEmployerInternships() {
    const manageInternshipsTable = document.getElementById('manageInternshipsTable');
    manageInternshipsTable.innerHTML = '';

    const employerInternships = internships.filter(i => i.company === currentUser.companyName);

    if (employerInternships.length === 0) {
        manageInternshipsTable.innerHTML = '<tr><td colspan="6" class="text-center">No internships posted yet.</td></tr>';
        return;
    }

    employerInternships.forEach(internship => {
        const row = document.createElement('tr');

        let statusClass = '';
        let statusText = '';

        switch (internship.status) {
            case 'active':
                statusClass = 'status-approved';
                statusText = 'Active';
                break;
            case 'closed':
                statusClass = 'status-rejected';
                statusText = 'Closed';
                break;
        }

        row.innerHTML = `
                    <td>${internship.title}</td>
                    <td>${internship.category}</td>
                    <td>${internship.postedDate.toLocaleDateString()}</td>
                    <td>${internship.applications}</td>
                    <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                    <td>
                        <button class="btn btn-sm btn-primary" onclick="showInternshipDetails(${internship.id})">View</button>
                        <button class="btn btn-sm btn-danger" onclick="deleteInternship(${internship.id})">Delete</button>
                    </td>
                `;

        manageInternshipsTable.appendChild(row);
    });
}

function loadApplicants() {
    const applicantsList = document.getElementById('applicantsList');
    applicantsList.innerHTML = '';

    const employerApplications = applications.filter(a => a.employerId === currentUser.id);

    if (employerApplications.length === 0) {
        applicantsList.innerHTML = '<p>No applications yet.</p>';
        return;
    }

    employerApplications.forEach(application => {
        const internship = internships.find(i => i.id === application.internshipId);
        const user = users.find(u => u.id === application.userId);

        if (!internship || !user) return;

        const applicantCard = document.createElement('div');
        applicantCard.className = 'card mb-3';

        let statusClass = '';
        let statusText = '';

        switch (application.status) {
            case 'pending':
                statusClass = 'status-pending';
                statusText = 'Pending';
                break;
            case 'approved':
                statusClass = 'status-approved';
                statusText = 'Approved';
                break;
            case 'rejected':
                statusClass = 'status-rejected';
                statusText = 'Rejected';
                break;
        }

        applicantCard.innerHTML = `
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-2">
                                <img src="${user.avatar}" alt="${user.firstName} ${user.lastName}" class="rounded-circle" width="60" height="60">
                            </div>
                            <div class="col-md-8">
                                <h5>${user.firstName} ${user.lastName}</h5>
                                <p class="text-muted mb-1">${user.email}</p>
                                <p class="mb-1"><strong>Applied for:</strong> ${internship.title}</p>
                                <p class="mb-1"><strong>Applied on:</strong> ${application.appliedDate.toLocaleDateString()}</p>
                                <p><strong>Status:</strong> <span class="status-badge ${statusClass}">${statusText}</span></p>
                            </div>
                            <div class="col-md-2 d-flex align-items-center">
                                <button class="btn btn-primary btn-sm" onclick="showApplicantDetails(${application.id})">View Details</button>
                            </div>
                        </div>
                    </div>
                `;

        applicantsList.appendChild(applicantCard);
    });
}

function showApplicantDetails(applicationId) {
    const application = applications.find(a => a.id === applicationId);
    if (!application) return;

    const internship = internships.find(i => i.id === application.internshipId);
    const user = users.find(u => u.id === application.userId);

    if (!internship || !user) return;

    const modal = new bootstrap.Modal(document.getElementById('applicantDetailsModal'));
    const content = document.getElementById('applicantDetailsContent');

    content.innerHTML = `
                <div class="row">
                    <div class="col-md-3">
                        <img src="${user.avatar}" alt="${user.firstName} ${user.lastName}" class="rounded-circle" width="150" height="150">
                    </div>
                    <div class="col-md-9">
                        <h4>${user.firstName} ${user.lastName}</h4>
                        <p class="text-muted">${user.email}</p>
                        <p><strong>Education:</strong> ${user.education}</p>
                        <p><strong>Points:</strong> ${user.points}</p>
                        <p><strong>Rank:</strong> ${user.rank}</p>
                        <p><strong>Completed Internships:</strong> ${user.completed}</p>
                    </div>
                </div>
                <div class="mt-4">
                    <h5>Skills</h5>
                    <div>
                        ${user.skills.map(skill => `<span class="badge bg-primary me-2 mb-2">${skill}</span>`).join('')}
                    </div>
                </div>
                <div class="mt-4">
                    <h5>Bio</h5>
                    <p>${user.bio}</p>
                </div>
                <div class="mt-4">
                    <h5>Application Details</h5>
                    <p><strong>Internship:</strong> ${internship.title}</p>
                    <p><strong>Cover Letter:</strong> ${application.coverLetter}</p>
                    <p><strong>Availability:</strong> ${application.availability}</p>
                    <p><strong>Expected Start Date:</strong> ${application.expectedStart}</p>
                    <p><strong>Applied Date:</strong> ${application.appliedDate.toLocaleDateString()}</p>
                    <p><strong>Status:</strong> ${application.status}</p>
                </div>
            `;

    document.getElementById('acceptApplicantBtn').onclick = () => {
        updateApplicationStatus(applicationId, 'approved');
        modal.hide();
    };

    document.getElementById('rejectApplicantBtn').onclick = () => {
        updateApplicationStatus(applicationId, 'rejected');
        modal.hide();
    };

    modal.show();
}

function updateApplicationStatus(applicationId, status) {
    const application = applications.find(a => a.id === applicationId);
    if (!application) return;

    application.status = status;
    localStorage.setItem('applications', JSON.stringify(applications));

    showNotification(`Application ${status}!`, 'success');
    loadApplicants();
}

function handlePostInternship() {
    const title = document.getElementById('internshipTitle').value;
    const category = document.getElementById('internshipCategory').value;
    const description = document.getElementById('internshipDescription').value;
    const duration = document.getElementById('internshipDuration').value;
    const stipend = document.getElementById('internshipStipend').value;
    const skills = document.getElementById('internshipSkills').value;
    const deadline = document.getElementById('internshipDeadline').value;

    const newInternship = {
        id: internships.length + 1,
        title,
        company: currentUser.companyName,
        category,
        description,
        duration,
        stipend: parseInt(stipend),
        skills: skills.split(',').map(s => s.trim()),
        postedDate: new Date(),
        deadline: new Date(deadline),
        image: `https://picsum.photos/seed/internship${internships.length + 1}/400/300.jpg`,
        status: 'active',
        applications: 0,
        employerId: currentUser.id
    };

    internships.push(newInternship);
    localStorage.setItem('internships', JSON.stringify(internships));

    showNotification('Internship posted successfully!', 'success');


    document.getElementById('postInternshipForm').reset();

    loadEmployerInternships();
}

function handleUpdateCompanyProfile() {
    const companyName = document.getElementById('profileCompanyName').value;
    const website = document.getElementById('profileCompanyWebsite').value;
    const email = document.getElementById('profileCompanyEmail').value;
    const description = document.getElementById('profileCompanyDescription').value;
    const size = document.getElementById('profileCompanySize').value;
    const location = document.getElementById('profileCompanyLocation').value;

    currentUser.companyName = companyName;
    currentUser.website = website;
    currentUser.email = email;
    currentUser.description = description;
    currentUser.size = size;
    currentUser.location = location;

    const employerIndex = employers.findIndex(e => e.id === currentUser.id);
    if (employerIndex !== -1) {
        employers[employerIndex] = currentUser;
        localStorage.setItem('employers', JSON.stringify(employers));
    }

    localStorage.setItem('currentUser', JSON.stringify(currentUser));

    showNotification('Company profile updated successfully!', 'success');
}

function loadAdminDashboard() {
    if (!currentUser || currentUser.role !== 'admin') {
        showNotification('Please login as an admin to view the dashboard.', 'warning');
        showPage('login');
        return;
    }

    loadEmployerVerificationRequests();

    loadUsers();
    loadInternshipsForAdmin();
    loadReports();
}

function loadEmployerVerificationRequests() {
    const verifyEmployersTable = document.getElementById('verifyEmployersTable');
    verifyEmployersTable.innerHTML = '';

    const unverifiedEmployers = employers.filter(e => !e.verified);

    if (unverifiedEmployers.length === 0) {
        verifyEmployersTable.innerHTML = '<tr><td colspan="6" class="text-center">No pending verification requests.</td></tr>';
        return;
    }

    unverifiedEmployers.forEach(employer => {
        const row = document.createElement('tr');

        row.innerHTML = `
                    <td>${employer.companyName}</td>
                    <td>${employer.email}</td>
                    <td>${employer.website}</td>
                    <td>${new Date().toLocaleDateString()}</td>
                    <td><span class="status-badge status-pending">Pending</span></td>
                    <td>
                        <button class="btn btn-sm btn-success" onclick="verifyEmployer(${employer.id}, true)">Approve</button>
                        <button class="btn btn-sm btn-danger" onclick="verifyEmployer(${employer.id}, false)">Reject</button>
                    </td>
                `;

        verifyEmployersTable.appendChild(row);
    });
}

function verifyEmployer(employerId, approved) {
    const employer = employers.find(e => e.id === employerId);
    if (!employer) return;

    employer.verified = approved;
    localStorage.setItem('employers', JSON.stringify(employers));

    showNotification(`Employer ${approved ? 'approved' : 'rejected'}!`, 'success');
    loadEmployerVerificationRequests();
}

function loadUsers() {
    const manageUsersTable = document.getElementById('manageUsersTable');
    manageUsersTable.innerHTML = '';

    users.forEach(user => {
        const row = document.createElement('tr');

        row.innerHTML = `
                    <td>${user.firstName} ${user.lastName}</td>
                    <td>${user.email}</td>
                    <td>${user.role}</td>
                    <td>${new Date().toLocaleDateString()}</td>
                    <td><span class="status-badge status-approved">Active</span></td>
                    <td>
                        <button class="btn btn-sm btn-primary" onclick="viewUserDetails(${user.id})">View</button>
                        <button class="btn btn-sm btn-danger" onclick="deleteUser(${user.id})">Delete</button>
                    </td>
                `;

        manageUsersTable.appendChild(row);
    });
}

function loadInternshipsForAdmin() {
    const manageInternshipsAdminTable = document.getElementById('manageInternshipsAdminTable');
    manageInternshipsAdminTable.innerHTML = '';

    internships.forEach(internship => {
        const row = document.createElement('tr');

        let statusClass = '';
        let statusText = '';

        switch (internship.status) {
            case 'active':
                statusClass = 'status-approved';
                statusText = 'Active';
                break;
            case 'closed':
                statusClass = 'status-rejected';
                statusText = 'Closed';
                break;
        }

        row.innerHTML = `
                    <td>${internship.title}</td>
                    <td>${internship.company}</td>
                    <td>${internship.category}</td>
                    <td>${internship.postedDate.toLocaleDateString()}</td>
                    <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                    <td>
                        <button class="btn btn-sm btn-primary" onclick="showInternshipDetails(${internship.id})">View</button>
                        <button class="btn btn-sm btn-danger" onclick="deleteInternship(${internship.id})">Delete</button>
                    </td>
                `;

        manageInternshipsAdminTable.appendChild(row);
    });
}

function loadReports() {
    const topPerformersList = document.getElementById('topPerformersList');
    topPerformersList.innerHTML = '';

    const sortedUsers = [...users].sort((a, b) => b.points - a.points).slice(0, 5);

    sortedUsers.forEach((user, index) => {
        const li = document.createElement('li');
        li.innerHTML = `${user.firstName} ${user.lastName} - ${user.points} points`;
        topPerformersList.appendChild(li);
    });

    const recentActivitiesList = document.getElementById('recentActivitiesList');
    recentActivitiesList.innerHTML = '';

    const recentActivities = [
        { text: 'New user registration: Sarah Johnson', time: '2 hours ago' },
        { text: 'New internship posted: Backend Developer at Tech Solutions', time: '3 hours ago' },
        { text: 'Application submitted: John Doe for Frontend Developer', time: '5 hours ago' },
        { text: 'Employer verified: Creative Studios', time: '1 day ago' },
        { text: 'Review submitted: 5 stars for Jane Smith', time: '2 days ago' }
    ];

    recentActivities.forEach(activity => {
        const li = document.createElement('li');
        li.innerHTML = `${activity.text} <small class="text-muted">(${activity.time})</small>`;
        recentActivitiesList.appendChild(li);
    });
}

function loadLeaderboard() {
    const topUsersList = document.getElementById('topUsersList');
    topUsersList.innerHTML = '';

    const sortedUsers = [...users].sort((a, b) => b.points - a.points);

    sortedUsers.forEach((user, index) => {
        const leaderboardItem = document.createElement('div');
        leaderboardItem.className = 'leaderboard-item';

        let rankClass = 'rank-other';
        if (index === 0) rankClass = 'rank-1';
        else if (index === 1) rankClass = 'rank-2';
        else if (index === 2) rankClass = 'rank-3';

        leaderboardItem.innerHTML = `
                    <div class="leaderboard-rank ${rankClass}">${index + 1}</div>
                    <img src="${user.avatar}" alt="${user.firstName} ${user.lastName}" class="rounded-circle" width="50" height="50">
                    <div class="ms-3 flex-grow-1">
                        <h6>${user.firstName} ${user.lastName}</h6>
                        <p class="text-muted mb-0">${user.completed} completed internships</p>
                    </div>
                    <div class="text-end">
                        <h5>${user.points}</h5>
                        <small class="text-muted">points</small>
                    </div>
                `;

        topUsersList.appendChild(leaderboardItem);
    });

    const topEmployersList = document.getElementById('topEmployersList');
    topEmployersList.innerHTML = '';

    const employerInternshipCounts = employers.map(employer => {
        const count = internships.filter(i => i.company === employer.companyName).length;
        return { employer, count };
    }).sort((a, b) => b.count - a.count);

    employerInternshipCounts.forEach(({ employer, count }, index) => {
        const leaderboardItem = document.createElement('div');
        leaderboardItem.className = 'leaderboard-item';

        let rankClass = 'rank-other';
        if (index === 0) rankClass = 'rank-1';
        else if (index === 1) rankClass = 'rank-2';
        else if (index === 2) rankClass = 'rank-3';

        leaderboardItem.innerHTML = `
                    <div class="leaderboard-rank ${rankClass}">${index + 1}</div>
                    <img src="${employer.avatar}" alt="${employer.companyName}" class="rounded-circle" width="50" height="50">
                    <div class="ms-3 flex-grow-1">
                        <h6>${employer.companyName}</h6>
                        <p class="text-muted mb-0">${employer.verified ? 'Verified' : 'Pending Verification'}</p>
                    </div>
                    <div class="text-end">
                        <h5>${count}</h5>
                        <small class="text-muted">internships</small>
                    </div>
                `;

        topEmployersList.appendChild(leaderboardItem);
    });
}

function loadNotifications() {
    const notificationsList = document.getElementById('notificationsList');
    notificationsList.innerHTML = '';

    const notifications = [
        { id: 1, text: 'Your application for Frontend Development Intern has been approved.', time: '2 hours ago', read: false },
        { id: 2, text: 'New internship matching your skills: Backend Development Intern', time: '1 day ago', read: false },
        { id: 3, text: 'You have received a 5-star review from Tech Solutions Inc.', time: '3 days ago', read: true },
        { id: 4, text: 'Your profile has been viewed by 5 employers this week.', time: '1 week ago', read: true },
        { id: 5, text: 'Congratulations! You have earned the "Quick Learner" badge.', time: '2 weeks ago', read: true }
    ];

    notifications.forEach(notification => {
        const notificationCard = document.createElement('div');
        notificationCard.className = `card mb-3 ${notification.read ? 'bg-light' : ''}`;

        notificationCard.innerHTML = `
                    <div class="card-body">
                        <div class="d-flex justify-content-between">
                            <p class="mb-1">${notification.text}</p>
                            ${!notification.read ? '<span class="badge bg-primary">New</span>' : ''}
                        </div>
                        <small class="text-muted">${notification.time}</small>
                    </div>
                `;

        notificationsList.appendChild(notificationCard);
    });

    const unreadCount = notifications.filter(n => !n.read).length;
    document.getElementById('notificationCount').textContent = unreadCount;
    document.getElementById('notificationCount').style.display = unreadCount > 0 ? 'flex' : 'none';
}

function showReviewForm(applicationId) {
    const modal = new bootstrap.Modal(document.getElementById('reviewModal'));

    document.getElementById('submitReviewBtn').onclick = () => {
        handleReviewSubmission(applicationId);
        modal.hide();
    };

    modal.show();
}

function handleReviewSubmission(applicationId) {
    const rating = document.getElementById('reviewRating').value;
    const feedback = document.getElementById('reviewFeedback').value;

    if (rating === 0) {
        showNotification('Please select a rating.', 'warning');
        return;
    }

    const application = applications.find(a => a.id === applicationId);
    if (!application) return;

    const newReview = {
        id: reviews.length + 1,
        internshipId: application.internshipId,
        userId: application.userId,
        employerId: application.employerId,
        rating: parseInt(rating),
        feedback,
        date: new Date()
    };

    reviews.push(newReview);
    localStorage.setItem('reviews', JSON.stringify(reviews));

    showNotification('Review submitted successfully!', 'success');

    document.getElementById('reviewForm').reset();
    document.querySelectorAll('.rating-star').forEach(s => {
        s.classList.remove('bi-star-fill');
        s.classList.add('bi-star');
    });
    document.getElementById('reviewRating').value = 0;

    loadUserReviews();
}

function handleSearch() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();

    if (!searchTerm) {
        loadInternships();
        return;
    }

    const filteredInternships = internships.filter(internship =>
        internship.title.toLowerCase().includes(searchTerm) ||
        internship.company.toLowerCase().includes(searchTerm) ||
        internship.description.toLowerCase().includes(searchTerm) ||
        internship.category.toLowerCase().includes(searchTerm) ||
        internship.skills.some(skill => skill.toLowerCase().includes(searchTerm))
    );

    displayFilteredInternships(filteredInternships);
}

function handleFilter() {
    const category = document.getElementById('categoryFilter').value;
    const duration = document.getElementById('durationFilter').value;
    const stipend = document.getElementById('stipendFilter').value;
    const sortBy = document.getElementById('sortBy').value;

    let filteredInternships = [...internships];

    if (category) {
        filteredInternships = filteredInternships.filter(i => i.category === category);
    }

    if (duration) {
        filteredInternships = filteredInternships.filter(i => i.duration === duration);
    }

    if (stipend) {
        if (stipend === 'unpaid') {
            filteredInternships = filteredInternships.filter(i => i.stipend === 0);
        } else if (stipend === '0-5000') {
            filteredInternships = filteredInternships.filter(i => i.stipend > 0 && i.stipend <= 5000);
        } else if (stipend === '5000-10000') {
            filteredInternships = filteredInternships.filter(i => i.stipend > 5000 && i.stipend <= 10000);
        } else if (stipend === '10000+') {
            filteredInternships = filteredInternships.filter(i => i.stipend > 10000);
        }
    }

    if (sortBy === 'newest') {
        filteredInternships.sort((a, b) => b.postedDate - a.postedDate);
    } else if (sortBy === 'oldest') {
        filteredInternships.sort((a, b) => a.postedDate - b.postedDate);
    } else if (sortBy === 'stipend-high') {
        filteredInternships.sort((a, b) => b.stipend - a.stipend);
    } else if (sortBy === 'stipend-low') {
        filteredInternships.sort((a, b) => a.stipend - b.stipend);
    }

    displayFilteredInternships(filteredInternships);
}

function displayFilteredInternships(filteredInternships) {
    const internshipsList = document.getElementById('internshipsList');
    internshipsList.innerHTML = '';

    if (filteredInternships.length === 0) {
        internshipsList.innerHTML = '<div class="col-12 text-center"><p>No internships found matching your criteria.</p></div>';
        return;
    }

    filteredInternships.forEach(internship => {
        const internshipCard = createInternshipCard(internship);
        internshipsList.appendChild(internshipCard);
    });
}

function deleteInternship(internshipId) {
    if (confirm('Are you sure you want to delete this internship?')) {
        const index = internships.findIndex(i => i.id === internshipId);
        if (index !== -1) {
            internships.splice(index, 1);
            localStorage.setItem('internships', JSON.stringify(internships));
            showNotification('Internship deleted successfully!', 'success');
            loadInternshipsForAdmin();
            loadEmployerInternships();
        }
    }
}

function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user?')) {
        const index = users.findIndex(u => u.id === userId);
        if (index !== -1) {
            users.splice(index, 1);
            localStorage.setItem('users', JSON.stringify(users));
            showNotification('User deleted successfully!', 'success');
            loadUsers();
        }
    }
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.zIndex = '9999';
    notification.innerHTML = `
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}