const facilitiesData = [
    {
        title: "Common Room",
        description: "50\" LED TV, Newspaper, Magazines, T.T. Table, Carom Board, Chess Board"
    },
    {
        title: "Sports",
        description: "Badminton Court, Volleyball Ground, Indoor Sports Equipment"
    },
    {
        title: "Utility Services",
        description: "Free Unlimited LAN, Parking Sheds, Laundry Service (4 Washing Machines)"
    },
    {
        title: "Security",
        description: "24/7 CCTV Surveillance, Security Staff, Fire Safety Equipment"
    },
    {
        title: "Comfort",
        description: "Electric Geyser, 24-Hour Water Supply, Well-Maintained Rooms"
    },
    {
        title: "Dining",
        description: "Quality Food, Hygienic Meals, Various Food Options"
    }
];

const rulesData = [
    "Electrical appliances (kettles, etc.) are not allowed in rooms",
    "Students must fill movement forms for any movement outside hostel",
    "No pets are allowed inside the hostel premises",
    "Lights out at 11:00 PM on weekdays",
    "Visitors are allowed only on designated visiting hours (2-6 PM)",
    "Ragging of any kind is strictly prohibited",
    "Students must maintain cleanliness in common areas"
];

const leaveTypes = ["Medical Leave", "Emergency Leave", "Casual Leave", "Vacation", "Other"];

function generateFacilities() {
    const facilitiesContainer = document.getElementById('facilities-container');
    if (facilitiesContainer) {
        const facilitiesHTML = facilitiesData.map(facility => `
            <div class="facility-item">
                <h3>${facility.title}</h3>
                <p>${facility.description}</p>
            </div>
        `).join('');
        facilitiesContainer.innerHTML = facilitiesHTML;
    }
}

function generateRules() {
    const rulesContainer = document.querySelector('.rules-list');
    if (rulesContainer) {
        const rulesHTML = rulesData.map(rule => `<li>${rule}</li>`).join('');
        rulesContainer.innerHTML = rulesHTML;
    }
}

function generateLeaveTypes() {
    const leaveSelect = document.getElementById('lleave');
    if (leaveSelect) {
        const optionsHTML = leaveTypes.map(type => `<option value="${type}">${type}</option>`).join('');
        leaveSelect.innerHTML = '<option value="">Select Leave Type</option>' + optionsHTML;
    }
}

window.addEventListener('load', () => {
    generateFacilities();
    generateRules();
    generateLeaveTypes();
    setupNavAuth();
    
    const heroImg = document.getElementById('heroImg');
    if (heroImg) {
        if (heroImg.complete) {
            resizeImageMap();
        } else {
            heroImg.addEventListener('load', resizeImageMap);
        }
    }
});

window.addEventListener('resize', resizeImageMap);

function resizeImageMap() {
    const img = document.getElementById('heroImg');
    const map = document.getElementById('hostelMap');
    if (!img || !map) return;

    const naturalW = img.naturalWidth;
    const naturalH = img.naturalHeight;
    const displayW = img.offsetWidth;
    const displayH = img.offsetHeight;
    if (!naturalW || !displayW) return;

    
    const scaleToFitW = displayW / naturalW;
    const scaleToFitH = displayH / naturalH;
    const scale = Math.max(scaleToFitW, scaleToFitH);

    const renderedW = naturalW * scale;
    const renderedH = naturalH * scale;
    const offsetX = (renderedW - displayW) / 2;
    const offsetY = (renderedH - displayH) / 2;

    map.querySelectorAll('area').forEach(area => {
        const orig = area.dataset.coords.split(',').map(Number);
        const scaled = [
            Math.round(orig[0] * scale - offsetX),
            Math.round(orig[1] * scale - offsetY),
            Math.round(orig[2] * scale - offsetX),
            Math.round(orig[3] * scale - offsetY)
        ];
        area.coords = scaled.join(',');
    });
}

function setupNavAuth() {
    const authSlot = document.getElementById('nav-auth-slot');
    if (!authSlot) return;

    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        const user = JSON.parse(currentUser);
        const firstLetter = (user.username || user.name || '?')[0].toUpperCase();
        authSlot.innerHTML = `
            <div class="nav-avatar-wrapper">
                <div class="nav-avatar" id="navAvatar">${firstLetter}</div>
                <div class="nav-dropdown" id="navDropdown">
                    <div class="nav-dropdown-inner">
                        <p class="nav-dropdown-username">${user.username || user.name}</p>
                        <button class="nav-logout-btn" onclick="logoutUser()">Logout</button>
                    </div>
                </div>
            </div>
        `;
    } else {
        authSlot.innerHTML = `<a href="signup.html" class="nav-login-btn">Login</a>`;
    }
}

function logoutUser() {
    localStorage.removeItem('currentUser');
    window.location.href = '/signup.html';
}

function scrollTo(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

function submitFeedback(event) {
    event.preventDefault();

    const fname = document.getElementById('fname').value;
    const email = document.getElementById('email').value;
    const roll = document.getElementById('roll').value;
    const feedback = document.getElementById('feedback').value;

    
    if (!fname || !email || !roll || !feedback) {
        showMessage('Please fill all fields!', 'error');
        return;
    }

    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showMessage('Please enter a valid email!', 'error');
        return;
    }

    
    const feedbackData = {
        name: fname,
        email: email,
        rollNumber: roll,
        feedback: feedback,
        timestamp: new Date().toLocaleString()
    };

    let allFeedback = JSON.parse(localStorage.getItem('feedback')) || [];
    allFeedback.push(feedbackData);
    localStorage.setItem('feedback', JSON.stringify(allFeedback));

    
    showMessage('Thank you! Your feedback has been submitted successfully.', 'success');

    
    document.querySelector('.feedback-form').reset();
}

function showMessage(message, type) {
    const messageEl = document.getElementById('feedback-message');
    messageEl.textContent = message;
    messageEl.className = 'feedback-message ' + type;

    
    setTimeout(() => {
        messageEl.textContent = '';
        messageEl.className = 'feedback-message';
    }, 5000);
}


