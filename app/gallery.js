const backArrow = document.getElementById('backArrow');
let hideTimeout;

function showBackArrow() {
    backArrow.classList.remove('hide');
    clearTimeout(hideTimeout);
    hideTimeout = setTimeout(() => {
        backArrow.classList.add('hide');
    }, 3000);
}

backArrow.addEventListener('click', () => {
    window.location.href = 'main.html';
});

['mousemove', 'touchstart'].forEach(evt => {
    document.addEventListener(evt, showBackArrow);
});

// Start the hide timer on load
showBackArrow(); 