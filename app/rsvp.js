let currentGuest = null;
let emailCount = 0;

window.addEventListener('DOMContentLoaded', () => {
    const savedGuest = localStorage.getItem('currentGuest');
    if (savedGuest) {
        currentGuest = JSON.parse(savedGuest);
        showRsvpPage();
    } else {
        window.location.href = 'main.html';
    }

    document.getElementById('backArrow').addEventListener('click', () => {
        window.location.href = 'main.html';
    });

    document.getElementById('responseDropdown').addEventListener('change', function() {
        const submitButton = document.getElementById('submitButton');
        submitButton.disabled = this.value === '';
        const otherContainer = document.getElementById('otherTextContainer');
        otherContainer.style.display = this.value === 'Other' ? 'block' : 'none';
    });

    document.getElementById('submitButton').addEventListener('click', submitRSVP);
});

function showRsvpPage() {
    document.getElementById('guestInfo').textContent = `RSVP for: ${currentGuest.party.join(', ')}`;
}

function submitRSVP() {
    const dropdown = document.getElementById('responseDropdown');
    const submitButton = document.getElementById('submitButton');
    const statusMessage = document.getElementById('statusMessage');
    if (!dropdown.value) {
        alert('Please select a response first!');
        return;
    }
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';
    if (EMAILJS_CONFIG.publicKey === 'YOUR_PUBLIC_KEY') {
        alert('EmailJS not configured yet. Please set up your EmailJS credentials.');
        submitButton.disabled = false;
        submitButton.textContent = 'let us know';
        return;
    }
    emailCount++;
    let subject;
    if (emailCount === 1) {
        subject = `RSVP from ${currentGuest.inputName}`;
    } else {
        const ordinals = ['', 'second', 'third', 'fourth', 'fifth'];
        const ordinal = ordinals[emailCount] || `${emailCount}th`;
        subject = `${currentGuest.inputName} has sent a ${ordinal} RSVP email`;
    }
    const emailData = {
        guest_name: currentGuest.inputName,
        party_members: currentGuest.party.join(', '),
        rsvp_response: dropdown.value,
        to_email: 'portelanes25@gmail.com',
        subject
    };
    // Uncomment to send email via EmailJS
    // emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, emailData)
    //     .then(function(response) {
    //         alert('Your RSVP has been sent successfully!');
    //     })
    //     .catch(function(error) {
    //         alert('Failed to send RSVP. Please try again or text Sam directly.');
    //     })
    //     .finally(function() {
    //         submitButton.disabled = false;
    //         submitButton.textContent = 'let us know';
    //     });
    submitButton.disabled = false;
    submitButton.textContent = 'let us know';
    if (emailCount === 2) {
        let warning = document.getElementById('emailWarning');
        if (!warning) {
            warning = document.createElement('div');
            warning.id = 'emailWarning';
            warning.style.color = '#dc3545';
            warning.style.fontWeight = 'bold';
            warning.style.marginTop = '15px';
            warning.textContent = 'I only have so many of these per month.';
            submitButton.parentNode.appendChild(warning);
        } else {
            warning.style.display = 'block';
        }
    }
    if (emailCount > 3) {
        document.getElementById('stopMessage').classList.add('show');
        submitButton.disabled = true;
        submitButton.textContent = "You're cut off!";
    }
} 