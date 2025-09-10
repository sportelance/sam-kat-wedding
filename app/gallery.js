const backArrow = document.getElementById('backArrow');
const photoModal = document.getElementById('photoModal');
const modalImage = document.getElementById('modalImage');
const modalClose = document.getElementById('modalClose');
let hideTimeout;

function showBackArrow() {
    backArrow.classList.remove('hide');
    clearTimeout(hideTimeout);
    hideTimeout = setTimeout(() => {
        backArrow.classList.add('hide');
    }, 3000);
}

backArrow.addEventListener('click', () => {
    window.location.href = '../index.html';
});

// Modal functionality
function openModal(imageSrc) {
    modalImage.src = imageSrc;
    photoModal.classList.add('show');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeModal() {
    photoModal.classList.remove('show');
    document.body.style.overflow = 'auto'; // Restore scrolling
}

// Add click listeners to all gallery images
document.addEventListener('DOMContentLoaded', () => {
    const galleryImages = document.querySelectorAll('.gallery-bg');
    galleryImages.forEach(image => {
        image.addEventListener('click', () => {
            const imageSrc = image.getAttribute('data-image');
            openModal(imageSrc);
        });
    });
});

// Close modal when clicking the X button
modalClose.addEventListener('click', closeModal);

// Close modal when clicking outside the image
photoModal.addEventListener('click', (e) => {
    if (e.target === photoModal) {
        closeModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && photoModal.classList.contains('show')) {
        closeModal();
    }
});

['mousemove', 'touchstart'].forEach(evt => {
    document.addEventListener(evt, showBackArrow);
});

// Start the hide timer on load
showBackArrow(); 