import { EMAILJS_CONFIG, guestList, formatGuestList, getCurrentGuest } from './shared.js';
let currentGuest = getCurrentGuest();
let emailCount = Number(localStorage.getItem('emailCount') || 0);

// RSVP dropdown options (excluding placeholder)
const rsvpOptionTemplates = [
    "We'll see you for the ceremony",
    "We'll hang out Saturday and Sunday",
    "We can only be there Saturday",
    "We can only be there Sunday",
    "We won't be able to make it",
    "We'll let you know closer to the date",
    "Other"
];

// Initialize EmailJS
if (typeof emailjs !== 'undefined' && EMAILJS_CONFIG && EMAILJS_CONFIG.publicKey) {
    emailjs.init(EMAILJS_CONFIG.publicKey);
}

// Modal HTML for stay suggestion
function createStayModal() {
    // Remove any existing modal
    const existing = document.getElementById('stayModal');
    if (existing) existing.remove();
    const modal = document.createElement('div');
    modal.id = 'stayModal';
    modal.className = 'stay-modal';
    modal.innerHTML = `
        <div class="stay-modal-content">
            <span class="stay-modal-close" id="stayModalClose">&times;</span>
            <div style="margin-bottom: 8px;">looks like you'll need somewhere to stay!<br>
            This <a href="https://maps.app.goo.gl/9XJtcKF69zRet49r8" target="_blank">place</a> and this <a href="https://maps.app.goo.gl/jZvbRXjSWgT48SVV9" target="_blank">place</a> are pretty close to our apartment (we live @48 Mansfield St, Somerville)</div>
        </div>
    `;
    document.body.appendChild(modal);
    document.getElementById('stayModalClose').onclick = () => modal.remove();
}

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

    // Populate RSVP dropdown on click (only once)
    const dropdown = document.getElementById('responseDropdown');
    if (dropdown) {
        dropdown.addEventListener('focus', () => populateRsvpDropdown());
        dropdown.addEventListener('mousedown', () => populateRsvpDropdown());
        dropdown.addEventListener('change', function() {
            // Show modal if "We'll hang out Saturday and Sunday" is selected
            if (this.value === "We'll hang out Saturday and Sunday") {
                createStayModal();
            } else {
                const modal = document.getElementById('stayModal');
                if (modal) modal.remove();
            }
        });
    }

    document.getElementById('responseDropdown').addEventListener('change', function() {
        const submitButton = document.getElementById('submitButton');
        submitButton.disabled = this.value === '';
        const otherContainer = document.getElementById('otherTextContainer');
        otherContainer.style.display = this.value === 'Other' ? 'block' : 'none';
    });

    document.getElementById('submitButton').addEventListener('click', submitRSVP);
});

function showRsvpPage() {
    document.getElementById('guestInfo').textContent = 'RSVP for:';
    const checkboxesDiv = document.getElementById('guestCheckboxes');
    checkboxesDiv.innerHTML = '';
    currentGuest.party.forEach((guest, i) => {
        const label = document.createElement('label');
        label.className = 'guest-pill';
        label.style.position = 'relative';
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = 'guests';
        checkbox.value = guest;
        checkbox.checked = true;
        checkbox.className = 'pill-checkbox';
        // Update pill style on change
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                label.classList.add('checked');
            } else {
                label.classList.remove('checked');
            }
        });
        // Initial state
        if (checkbox.checked) label.classList.add('checked');
        label.appendChild(checkbox);
        const span = document.createElement('span');
        span.textContent = guest;
        label.appendChild(span);
        checkboxesDiv.appendChild(label);
    });
}

function showSuccessMessage(rsvpValue) {
    // Remove any existing
    let msg = document.getElementById('rsvpSuccessMsg');
    if (msg) msg.remove();
    msg = document.createElement('div');
    msg.id = 'rsvpSuccessMsg';
    let isSorry = false;
    if (
        rsvpValue === "We won't be able to make it" ||
        rsvpValue === "I won't be able to make it"
    ) {
        msg.textContent = "I'm sorry you won't be able to join us. We're planning a bigger party in the spring and hope to see you then!";
        msg.style.color = '#b8005c';
        isSorry = true;
    } else {
        msg.textContent = 'thanks for your rsvp!';
        msg.style.color = '#28a745';
    }
    msg.style.position = 'fixed';
    msg.style.top = '32px';
    msg.style.left = '50%';
    msg.style.transform = 'translateX(-50%)';
    msg.style.background = 'rgba(255,255,255,0.97)';
    msg.style.fontWeight = 'bold';
    msg.style.fontSize = '1.2rem';
    msg.style.padding = '14px 32px';
    msg.style.borderRadius = '10px';
    msg.style.boxShadow = '0 2px 12px rgba(40,167,69,0.10)';
    msg.style.zIndex = 9999;
    msg.style.textAlign = 'center';
    msg.style.cursor = 'pointer';
    msg.title = 'Click to dismiss';
    msg.onclick = () => msg.remove();
    document.body.appendChild(msg);
    setTimeout(() => { if (msg) msg.remove(); }, isSorry ? 9000 : 6000);
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
    submitButton.classList.add('disabled');
    if (EMAILJS_CONFIG.publicKey === 'YOUR_PUBLIC_KEY') {
        alert('EmailJS not configured yet. Please set up your EmailJS credentials.');
        submitButton.disabled = false;
        submitButton.textContent = 'let us know';
        submitButton.classList.remove('disabled');
        return;
    }
    incrementEmailCount();
    let subject;
    if (emailCount === 1) {
        subject = `RSVP from ${currentGuest.inputName}`;
    } else {
        const ordinals = ['', 'second', 'third', 'fourth', 'fifth'];
        const ordinal = ordinals[emailCount] || `${emailCount}th`;
        subject = `${currentGuest.inputName} has sent a ${ordinal} RSVP email`;
    }  
    const selectedGuests = getSelectedGuests();
    const emailData = {
        guest_name: currentGuest.inputName,
        party_members: selectedGuests.join(', '),
        rsvp_response: dropdown.value,
        to_email: 'portelanes25@gmail.com',
        subject
    };
    emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, emailData)
        .then(function(response) {
            showSuccessMessage(dropdown.value);
        })
        .catch(function(error) {
            alert('Failed to send RSVP. Please try again or text Sam directly.');
        })
        .finally(function() {
            submitButton.disabled = false;
            submitButton.textContent = 'let us know';
            submitButton.classList.remove('disabled');
        });
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
        submitButton.classList.add('disabled');
    }
}

function incrementEmailCount() {
    emailCount++;
    localStorage.setItem('emailCount', emailCount);
}

function getSelectedGuests() {
    return Array.from(document.querySelectorAll('.guest-checkboxes input[type="checkbox"]:checked')).map(cb => cb.value);
}

function populateRsvpDropdown() {
    const dropdown = document.getElementById('responseDropdown');
    if (!dropdown) return;

    const selectedGuests = getSelectedGuests();
    // Remove all but the first (placeholder) option
    while (dropdown.options.length > 1) dropdown.remove(1);

    // If no guests selected, show only 'Other' and update placeholder
    if (selectedGuests.length === 0) {
        dropdown.options[0].textContent = "please select who you're rsvping for";
        const opt = document.createElement('option');
        opt.value = "Other";
        opt.textContent = "Other";
        dropdown.appendChild(opt);
        dropdown.value = "";
        return;
    } else {
        dropdown.options[0].textContent = "Select your response...";
    }

    // Determine prefix: 'I' or 'We'
    const isSingle = selectedGuests.length === 1;
    for (let i = 0; i < rsvpOptionTemplates.length; i++) {
        let optionText = rsvpOptionTemplates[i];
        // Replace 'We'/'we'/'We'll' with 'I'/'I'll' if only one guest
        if (isSingle) {
            optionText = optionText.replace(/^We\b/, 'I')
                                   .replace(/^we\b/, 'I')
                                   .replace(/^We'?ll\b/, "I'll")
                                   .replace(/^we'?ll\b/, "I'll");
        }
        const opt = document.createElement('option');
        opt.value = optionText;
        opt.textContent = optionText;
        dropdown.appendChild(opt);
    }
    dropdown.value = "";
}

// Re-populate dropdown if guest selection changes
document.addEventListener('change', function(e) {
    if (e.target && e.target.matches('.guest-checkboxes input[type="checkbox"]')) {
        populateRsvpDropdown();
    }
}); 