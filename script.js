// Guest list with name variations
const guestList = {
    'joe': ['Joe', 'Patty', 'Grace'],
    'joey': ['Joe', 'Patty', 'Grace'],
    'joseph': ['Joe', 'Patty', 'Grace'],
    'patty': ['Joe', 'Patty', 'Grace'],
    'grace': ['Joe', 'Patty', 'Grace'],

    'matt': ['Matt', 'Isabella'],
    'matthew': ['Matt', 'Isabella'],
    'isabella': ['Matt', 'Isabella'],
    'bella': ['Matt', 'Isabella'],

    'tom': ['Tom', 'Natalie'],
    'thomas': ['Tom', 'Natalie'],
    'natalie': ['Tom', 'Natalie'],

    'justin': ['Justin', 'Samantha'],
    'sam': ['Justin', 'Samantha'],
    'samantha': ['Justin', 'Samantha'],

    'eileen': ['Eileen', 'Rich', 'Paul'],
    'rich': ['Eileen', 'Rich', 'Paul'],
    'richard': ['Eileen', 'Rich', 'Paul'],
    'paul': ['Eileen', 'Rich', 'Paul'],

    'abi': ['Abi'],
    'abigail': ['Abi'],

    'desiree': ['Desiree'],
    'desi': ['Desiree'],

    'greg': ['Greg', 'Keith'],
    'gregory': ['Greg', 'Keith'],
    'keith': ['Greg', 'Keith'],

    'brian': ['Brian'],

    'preston': ['Preston'],

    'maddy': ['Maddy', 'Chris', 'John'],
    'madeline': ['Maddy', 'Chris', 'John'],
    'chris': ['Maddy', 'Chris', 'John'],
    'john': ['Maddy', 'Chris', 'John'],
    'johnny': ['Maddy', 'Chris', 'John'],

    'tushar': ['Tushar', 'Christopher'],
    'tush': ['Tushar', 'Christopher'],
    'christopher': ['Tushar', 'Christopher'],

    'cole': ['Cole', 'Cayla'],
    'cayla': ['Cole', 'Cayla'],

    'josephine': ['Josephine', 'Austin'],
    'feen': ['Josephine', 'Austin'],
    'austin': ['Josephine', 'Austin'],

    'ally': ['Ally'],

    'dick': ['Dick', 'Pam'],
    'pamela': ['Dick', 'Pam'],
    'pam': ['Dick', 'Pam'],

    'sam': ['Sam', 'Kat'],
    'kat': ['Sam', 'Kat']
};

const EMAILJS_CONFIG = {
    publicKey: 'CoQOIcjZNBGJm0B4e',
    serviceId: 'service_iqw111p',
    templateId: 'template_19ojfhn'
};

emailjs.init(EMAILJS_CONFIG.publicKey);


let currentGuest = null;
let emailCount = 0;

// Landing page functionality
document.getElementById('nameInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        checkGuest();
    }
});

document.getElementById('nameInput').addEventListener('input', function() {
    document.getElementById('errorMessage').classList.remove('show');
});

function checkGuest() {
    const nameInput = document.getElementById('nameInput');
    const name = nameInput.value.trim().toLowerCase();
    
    if (guestList[name]) {
        currentGuest = {
            inputName: nameInput.value.trim(),
            party: guestList[name]
        };
        
        // Save to sessionStorage
        sessionStorage.setItem('currentGuest', JSON.stringify(currentGuest));
        
        showMainPage();
    } else {
        // Show error and shake
        nameInput.classList.add('shake');
        nameInput.value = '';
        document.getElementById('errorMessage').classList.add('show');
        
        setTimeout(() => {
            nameInput.classList.remove('shake');
        }, 500);
    }
}

function showMainPage() {
    document.getElementById('landingPage').style.display = 'none';
    document.getElementById('mainPage').style.display = 'block';
    
    // Update header with guest party
    const header = document.getElementById('mainHeader');
    header.textContent = `Hello ${formatGuestList(currentGuest.party)}!`;
    
    // Set up scroll effect for background images
    setupScrollEffect();
}

function formatGuestList(guests) {
    if (!guests || guests.length === 0) return '';
    if (guests.length === 1) return guests[0];
    if (guests.length === 2) return `${guests[0]} and ${guests[1]}`;
    // Oxford comma for 3 or more
    return `${guests.slice(0, -1).join(', ')}, and ${guests[guests.length - 1]}`;
}

function setupScrollEffect() {
    const bgImage1 = document.querySelector('.bg-image-1');
    const bgImage2 = document.querySelector('.bg-image-2');
    
    window.addEventListener('scroll', () => {
        const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight);
        
        if (scrollPercent > 0.3) {
            bgImage2.style.opacity = Math.min(1, (scrollPercent - 0.3) / 0.4);
        } else {
            bgImage2.style.opacity = 0;
        }
    });
}

function goToRsvp() {
    document.getElementById('mainPage').style.display = 'none';
    document.getElementById('rsvpPage').style.display = 'block';
    
    // Update guest info
    document.getElementById('guestInfo').textContent = 
        `RSVP for: ${currentGuest.party.join(', ')}`;
    
    // Reset scroll position
    window.scrollTo(0, 0);
}

function goToMain() {
    document.getElementById('rsvpPage').style.display = 'none';
    document.getElementById('mainPage').style.display = 'block';
}

// RSVP dropdown change handler
document.getElementById('responseDropdown').addEventListener('change', function() {
    const submitButton = document.getElementById('submitButton');
    submitButton.disabled = this.value === '';
});

document.getElementById('responseDropdown').addEventListener('change', function() {
    const otherContainer = document.getElementById('otherTextContainer');
    if (this.value === 'Other') {
        otherContainer.style.display = 'block';
    } else {
        otherContainer.style.display = 'none';
    }
});


function submitRSVP() {
    const dropdown = document.getElementById('rsvpDropdown');
    const submitButton = document.getElementById('submitRsvp');
    const statusMessage = document.getElementById('statusMessage');
    
    if (!dropdown.value) {
        showStatus('Please select a response first!', 'error');
        return;
    }

    // Disable button while sending
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';

    // Check if this is configured
    if (EMAILJS_CONFIG.publicKey === 'YOUR_PUBLIC_KEY') {
        showStatus('EmailJS not configured yet. Please set up your EmailJS credentials.', 'error');
        submitButton.disabled = false;
        submitButton.textContent = 'let us know';
        return;
    }

    // Prepare email data
    const emailData = {
        guest_name: currentGuest,
        party_members: currentParty.join(', '),
        rsvp_response: dropdown.value,
        to_email: 'portelanes25@gmail.com'
    };

    // Determine email subject based on count
    emailCount++;
    let subject;
    if (emailCount === 1) {
        subject = `RSVP from ${currentGuest}`;
    } else {
        const ordinals = ['', 'second', 'third', 'fourth', 'fifth'];
        const ordinal = ordinals[emailCount] || `${emailCount}th`;
        subject = `${currentGuest} has sent a ${ordinal} RSVP email`;
    }

    emailData.subject = subject;

    console.log('Email would be sent to: sportelance1@gmail.com');
    console.log('Title:', emailTitle);
    console.log('Body:', emailBody);

    // Send email using EmailJS
    // sendRsvpEmail(emailData, dropdown, submitButton, emailCount);
    // Show warning after 2 emails
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
    } else {
        submitButton.disabled = false;
        submitButton.textContent = 'let us know';
    }
}

function sendRsvpEmail(emailData, dropdown, submitButton, emailCount) {
    emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, emailData)
        .then(function(response) {
            console.log('Email sent successfully:', response);
            showStatus('Your RSVP has been sent successfully!', 'success');
            
            // Handle multiple emails
            if (emailCount > 3) {
                document.getElementById('stopMessage').classList.add('show');
                
                // Add "I beg you" option if not already there
                const firstOption = dropdown.options[1];
                if (firstOption && firstOption.value !== "I beg you") {
                    const begOption = new Option("I beg you", "I beg you");
                    dropdown.insertBefore(begOption, firstOption);
                }
            }
        })
        .catch(function(error) {
            console.error('Email send failed:', error);
            showStatus('Failed to send RSVP. Please try again or text Sam directly.', 'error');
        })
        .finally(function() {
            // Re-enable button
            submitButton.disabled = false;
            submitButton.textContent = 'let us know';
        });
}

// Check if returning user
window.addEventListener('load', () => {
    const savedGuest = sessionStorage.getItem('currentGuest');
    if (savedGuest) {
        currentGuest = JSON.parse(savedGuest);
        showMainPage();
    }
});

document.getElementById('rsvpOption').addEventListener('change', function() {
  const otherContainer = document.getElementById('otherTextContainer');
  otherContainer.style.display = this.value === 'other' ? 'block' : 'none';
});

document.getElementById('rsvpForm').addEventListener('submit', function(e) {
  e.preventDefault();

  // Get selected guests
  const guests = Array.from(document.querySelectorAll('input[name="guests"]:checked'))
    .map(cb => cb.value);

  // Get RSVP option
  const rsvpOption = document.getElementById('rsvpOption').value;

  // Get other text if needed
  let rsvpResponse = rsvpOption;
  if (rsvpOption === 'other') {
    const otherText = document.getElementById('otherText').value.trim();
    rsvpResponse = `other: ${otherText}`;
  }

  // Send RSVP data (replace with your actual submission logic)
  console.log({
    guests,
    rsvp: rsvpResponse
  });

  // ...show confirmation, etc...
});