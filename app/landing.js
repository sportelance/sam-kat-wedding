import { guestList, formatGuestList } from './shared.js';

document.getElementById('nameInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        checkGuest();
    }
});

document.getElementById('landingSubmit').addEventListener('click', function() {
    checkGuest();
});

document.getElementById('nameInput').addEventListener('input', function() {
    document.getElementById('errorMessage').classList.remove('show');
});

window.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('currentGuest')) {
        goToMain();
    }
}); 

function checkGuest() {
    console.log('checking guest');
    const nameInput = document.getElementById('nameInput');
    const name = nameInput.value.trim().toLowerCase();
    if (guestList[name]) {
        const formattedName = capitalizeFirst(name);
        let currentGuest = {
            inputName: formattedName,
            party: guestList[name]
        };
        localStorage.setItem('currentGuest', JSON.stringify(currentGuest));
        goToMain();
    } else {
        nameInput.classList.add('shake');
        nameInput.value = '';
        document.getElementById('errorMessage').classList.add('show');
        setTimeout(() => {
            nameInput.classList.remove('shake');
        }, 500);
    }
} 

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function goToMain() {
    window.location.href = 'app/main.html';
}