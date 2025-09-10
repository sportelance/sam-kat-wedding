"use strict";
// Main page functionality without RSVP or guest list dependencies
window.addEventListener('DOMContentLoaded', () => {
    setupScrollEffect();
});
function setupScrollEffect() {
    const bgImage1 = document.querySelector('.bg-image-1');
    const bgImage2 = document.querySelector('.bg-image-2');
    if (!bgImage1 || !bgImage2)
        return;
    window.addEventListener('scroll', () => {
        const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight);
        if (scrollPercent > 0.3) {
            bgImage2.style.opacity = Math.min(1, (scrollPercent - 0.3) / 0.4).toString();
        }
        else {
            bgImage2.style.opacity = '0';
        }
    });
}
//# sourceMappingURL=index.js.map