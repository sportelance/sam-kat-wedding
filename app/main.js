let currentGuest = null;

window.addEventListener('DOMContentLoaded', () => {
    const savedGuest = sessionStorage.getItem('currentGuest');
    if (savedGuest) {
        currentGuest = JSON.parse(savedGuest);
        showMainPage();
    } else {
        window.location.href = '../index.html';
    }

    document.getElementById('rsvpButton').addEventListener('click', () => {
        window.location.href = 'rsvp.html';
    });
});

function showMainPage() {
    const header = document.getElementById('mainHeader');
    header.textContent = `Hello ${formatGuestList(currentGuest.party)}!`;
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