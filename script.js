// Guest list with name variations
const guestList = {
    'joe': ['Joe', 'Sarah'],
    'joey': ['Joe', 'Sarah'],
    'joseph': ['Joe', 'Sarah'],
    'sarah': ['Joe', 'Sarah'],
    'mike': ['Mike', 'Lisa', 'Tommy'],
    'michael': ['Mike', 'Lisa', 'Tommy'],
    'lisa': ['Mike', 'Lisa', 'Tommy'],
    'emma': ['Emma'],
    'em': ['Emma'],
    'david': ['David', 'Rachel'],
    'dave': ['David', 'Rachel'],
    'rachel': ['David', 'Rachel'],
    'sam': ['Sam', 'Alex'],
    'samuel': ['Sam', 'Alex'],
    'alex': ['Sam', 'Alex'],
    'alexandra': ['Sam', 'Alex']
};

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
    header.textContent = `Hello ${currentGuest.party.join(', ')}`;
    
    // Set up scroll effect for background images
    setupScrollEffect();
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

function submitRsvp() {
    const dropdown = document.getElementById('responseDropdown');
    const selectedResponse = dropdown.value;
    
    if (!selectedResponse) return;
    
    // Disable button while processing
    const submitButton = document.getElementById('submitButton');
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';
    
    // Simulate email sending (replace with actual email service)
    setTimeout(() => {
        emailCount++;
        
        // Determine email title
        let emailTitle;
        if (emailCount === 1) {
            emailTitle = `RSVP from ${currentGuest.inputName}`;
        } else {
            const ordinals = ['', 'second', 'third', 'fourth', 'fifth'];
            const ordinal = ordinals[emailCount] || `${emailCount}th`;
            emailTitle = `${currentGuest.inputName} has sent a ${ordinal} RSVP email`;
        }
        
        // Email body
        const emailBody = `Name: ${currentGuest.inputName}\nParty: ${currentGuest.party.join(', ')}\nResponse: ${selectedResponse}`;
        
        console.log('Email would be sent to: sportelance1@gmail.com');
        console.log('Title:', emailTitle);
        console.log('Body:', emailBody);
        
        // Show stop message after 3 emails
        if (emailCount > 3) {
            document.getElementById('stopMessage').classList.add('show');
            
            // Add "I beg you" option if not already there
            const firstOption = dropdown.options[1];
            if (firstOption.value !== "I beg you") {
                const begOption = new Option("I beg you", "I beg you");
                dropdown.add(begOption, 1);
            }
        }
        
        // Re-enable button
        submitButton.disabled = false;
        submitButton.textContent = 'let us know';
        
        alert('RSVP sent successfully!');
        
    }, 1000);
}

// Check if returning user
window.addEventListener('load', () => {
    const savedGuest = sessionStorage.getItem('currentGuest');
    if (savedGuest) {
        currentGuest = JSON.parse(savedGuest);
        showMainPage();
    }
});