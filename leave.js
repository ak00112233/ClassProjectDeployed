window.addEventListener('load', () => {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        document.getElementById('leaveForm').style.display = 'none';
        document.querySelector('.form-instruction').style.display = 'none';
        document.querySelector('.leave-container h2').style.display = 'none';
        document.getElementById('not-logged-in').style.display = 'block';
    } else {
        const user = JSON.parse(currentUser);
        const nameEl  = document.getElementById('lname');
        const rollEl  = document.getElementById('lroll');
        const emailEl = document.getElementById('lemail');

        if (nameEl  && user.name)       nameEl.value  = user.name;
        if (rollEl  && user.rollNumber) rollEl.value  = user.rollNumber;
        if (emailEl && user.email)      emailEl.value = user.email;
    }
});

function submitLeave(event) {
    event.preventDefault();

    const name        = document.getElementById('lname').value;
    const roll        = document.getElementById('lroll').value;
    const email       = document.getElementById('lemail').value;
    const phone       = document.getElementById('lphone').value;
    const room        = document.getElementById('lroom').value;
    const startDate   = document.getElementById('lstartdate').value;
    const endDate     = document.getElementById('lenddate').value;
    const leaveType   = document.getElementById('lleave').value;
    const parents     = document.getElementById('parents').value;
    const reason      = document.getElementById('lreason').value;
    const destination = document.getElementById('ldestination').value;

    if (new Date(endDate) <= new Date(startDate)) {
        showLeaveMessage('End date must be after start date!', 'error');
        return;
    }

    if (new Date(startDate) < new Date()) {
        showLeaveMessage('Start date cannot be in the past!', 'error');
        return;
    }

    const leaveApplication = {
        name,
        rollNumber:    roll,
        email,
        phone,
        room,
        startDate,
        endDate,
        leaveType,
        parents,
        reason,
        destination,
        status:        'Pending',
        submittedAt:   new Date().toLocaleString(),
        applicationId: 'LV' + Math.ceil(Math.random() * 100000)
    };

    let applications = JSON.parse(localStorage.getItem('leaveApplications')) || [];
    applications.push(leaveApplication);
    localStorage.setItem('leaveApplications', JSON.stringify(applications));

    showLeaveMessage(
        'Leave application submitted successfully! Application ID: ' + leaveApplication.applicationId,
        'success'
    );

    document.getElementById('leaveForm').reset();
}

function showLeaveMessage(message, type) {
    const messageEl = document.getElementById('leaveMessage');
    messageEl.textContent = message;
    messageEl.className = 'leave-message ' + type;

    setTimeout(() => {
        messageEl.textContent = '';
        messageEl.className = 'leave-message';
    }, 6000);
}
