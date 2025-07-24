import { guestList, formatGuestList } from './shared.js';
let currentGuest = null;

window.addEventListener('DOMContentLoaded', () => {
    const savedGuest = localStorage.getItem('currentGuest');
    if (savedGuest) {
        currentGuest = JSON.parse(savedGuest);
        showMainPage();
    } else {
        window.location.href = '../index.html';
    }

    document.getElementById('rsvpButton').addEventListener('click', () => {
        window.location.href = 'rsvp.html';
    });

    // Gallery menu logic
    const engagementBtn = document.getElementById('engagementBtn');
    const photosBtn = document.getElementById('photosBtn');
    const engagementGallery = document.getElementById('engagementGallery');
    const photosGallery = document.getElementById('photosGallery');

    engagementBtn.addEventListener('click', () => {
        toggleGallery(engagementGallery, photosGallery);
    });
    photosBtn.addEventListener('click', () => {
        toggleGallery(photosGallery, engagementGallery);
    });
});

function showMainPage() {
    const header = document.getElementById('mainHeader');
    header.textContent = `Hey ${formatGuestList(currentGuest.party)}!`;
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

function toggleGallery(showGallery, hideGallery) {
    if (showGallery.style.display === 'block') {
        showGallery.style.display = 'none';
        return;
    }
    showGallery.style.display = 'block';
    hideGallery.style.display = 'none';
    // Fade in images
    setTimeout(() => {
        showGallery.querySelectorAll('.gallery-img').forEach(img => {
            img.classList.add('fade-in');
        });
    }, 10);
} 