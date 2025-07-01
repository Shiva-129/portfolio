// Get all skill icons
const skillIcons = document.querySelectorAll('.skill-icon-item img');

skillIcons.forEach(icon => {
    let isDragging = false;
    let mouseOffsetX; // Offset from element's left edge to click point (within element)
    let mouseOffsetY; // Offset from element's top edge to click point (within element)

    // Add mouse event listeners
    icon.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag); // Listen on document to handle fast drags off element
    document.addEventListener('mouseup', dragEnd); // Listen on document

    // Add touch event listeners for mobile
    icon.addEventListener('touchstart', dragStart);
    document.addEventListener('touchmove', drag);
    document.addEventListener('touchend', dragEnd);

    function dragStart(e) {
        e.preventDefault(); // Prevent default browser behaviors like HTML5 drag or text selection

        // Get viewport coordinates of mouse/touch
        const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
        const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;

        // Get current viewport position of the icon
        const iconRect = icon.getBoundingClientRect();

        // Calculate the offset from the element's top-left corner to the click point
        mouseOffsetX = clientX - iconRect.left;
        mouseOffsetY = clientY - iconRect.top;

        if (e.target === icon) { // Ensure dragging only starts on the icon itself
            isDragging = true;

            icon.style.zIndex = '1000'; // Bring to front
            icon.style.cursor = 'grabbing';
            icon.style.filter = 'drop-shadow(0 0 15px rgba(0, 149, 255, 0.9))'; // Apply glow

            // Apply initial scale for visual feedback during drag
            icon.style.transform = 'scale(1.1)';

            // Set initial position based on where it visually is, relative to its parent
            const parentRect = icon.parentElement.getBoundingClientRect();
            icon.style.left = `${iconRect.left - parentRect.left}px`;
            icon.style.top = `${iconRect.top - parentRect.top}px`;

            // Prevent text selection on body during drag
            document.body.style.userSelect = 'none';
            document.body.style.webkitUserSelect = 'none';
            document.body.style.mozUserSelect = 'none';
        }
    }

    function drag(e) {
        if (isDragging) {
            e.preventDefault(); // Prevent default browser behaviors like scrolling, text selection

            const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
            const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;

            // Get parent's current viewport position to calculate relative position
            const parentRect = icon.parentElement.getBoundingClientRect();

            // Calculate the new X/Y position relative to the parent container's top-left
            // This takes into account the mouse position and the offset where the icon was clicked
            const newLeft = (clientX - mouseOffsetX) - parentRect.left;
            const newTop = (clientY - mouseOffsetY) - parentRect.top;

            icon.style.left = `${newLeft}px`;
            icon.style.top = `${newTop}px`;

            // Maintain the scale during drag
            icon.style.transform = 'scale(1.1)';
        }
    }

    function dragEnd(e) {
        if (isDragging) {
            isDragging = false;

            // Revert visual styles
            icon.style.cursor = 'grab';
            icon.style.transform = ''; // Remove temporary scale (will revert to hover scale if applicable)
            icon.style.filter = ''; // Remove glow
            icon.style.zIndex = ''; // Clear z-index

            // Re-enable text selection on body
            document.body.style.userSelect = '';
            document.body.style.webkitUserSelect = '';
            document.body.style.mozUserSelect = '';
        }
    }
});

// Mobile menu functionality
const hamburgerMenu = document.querySelector('.hamburger-menu');
const navLinks = document.querySelector('.nav-links');

hamburgerMenu.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburgerMenu.classList.toggle('active');
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburgerMenu.classList.remove('active');
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburgerMenu.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('active');
        hamburgerMenu.classList.remove('active');
    }
});

// Function to check if an element is in the viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Add scroll event listener
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('#projects-section, #skills-section, #learning-section');

    sections.forEach(section => {
        if (isInViewport(section)) {
            section.classList.add('visible');
        }
    });
});