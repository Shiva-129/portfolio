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

// Golden Apple Projectile Animation
const navbarLogo = document.getElementById('navbar-logo');

console.log('navbarLogo:', navbarLogo);

if (navbarLogo) {
    navbarLogo.addEventListener('click', (event) => {
        console.log('Navbar logo clicked!');
        // Button press animation for logo
        navbarLogo.style.transition = 'transform 0.12s cubic-bezier(0.4,0,0.2,1)';
        navbarLogo.style.transform = 'scale(0.85)';
        setTimeout(() => {
            navbarLogo.style.transform = 'scale(1.08)';
            setTimeout(() => {
                navbarLogo.style.transform = 'scale(1)';
            }, 120);
        }, 100);

        // Get logo position in viewport
        const logoRect = navbarLogo.getBoundingClientRect();
        const scrollY = window.scrollY || window.pageYOffset;
        const scrollX = window.scrollX || window.pageXOffset;
        const startX = logoRect.left + logoRect.width / 2 + scrollX;
        const startY = logoRect.bottom + scrollY;
        const appleSize = 32;
        const pageHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
        const endY = pageHeight - 40;
        const duration = 1200; // ms

        // Determine click position relative to logo
        const clickX = event.clientX - logoRect.left;
        const logoWidth = logoRect.width;
        let directions = [];
        if (clickX < logoWidth / 3) {
            // Left third: all apples go left
            directions = [-1, -1, -1, -1, -1];
        } else if (clickX > logoWidth * 2 / 3) {
            // Right third: all apples go right
            directions = [1, 1, 1, 1, 1];
        } else {
            // Center third: half left, half right
            directions = [-1, -1, 1, 1, Math.random() < 0.5 ? -1 : 1];
        }

        function launchApple(delay, arcVariation, direction) {
            setTimeout(() => {
                const horizontalDistance = window.innerWidth * (0.25 + Math.random() * 0.15); // 25% to 40% of screen width
                const endX = startX + direction * horizontalDistance;
                const height = window.innerHeight * (0.4 + arcVariation); // vary arc height
                const midX = (startX + endX) / 2;
                const peakY = Math.min(startY, endY) - height * 1.4;
                const start = performance.now();

                const apple = document.createElement('img');
                apple.src = 'images/Enchanted_Golden_Apple.webp';
                apple.alt = 'Golden Apple';
                apple.id = 'projectile-golden-apple';
                apple.style.position = 'absolute';
                apple.style.left = (startX - appleSize / 2) + 'px';
                apple.style.top = (startY - appleSize / 2) + 'px';
                apple.style.width = appleSize + 'px';
                apple.style.height = appleSize + 'px';
                apple.style.zIndex = '5';
                apple.style.pointerEvents = 'none';
                document.body.appendChild(apple);

                function animateProjectile(now) {
                    const elapsed = now - start;
                    const t = Math.min(elapsed / duration, 1);
                    const bx = (1 - t) * (1 - t) * startX + 2 * (1 - t) * t * midX + t * t * endX;
                    const by = (1 - t) * (1 - t) * startY + 2 * (1 - t) * t * peakY + t * t * endY;
                    apple.style.left = (bx - appleSize / 2) + 'px';
                    apple.style.top = (by - appleSize / 2) + 'px';
                    apple.style.opacity = `${1 - 0.8 * t}`;
                    if (t > 0.1) apple.style.zIndex = '3000';
                    if (t < 1) {
                        requestAnimationFrame(animateProjectile);
                    } else {
                        setTimeout(() => {
                            if (apple.parentNode) apple.parentNode.removeChild(apple);
                        }, 300);
                    }
                }
                requestAnimationFrame(animateProjectile);
            }, delay);
        }

        // Launch 5 apples with staggered delays and arc variations, using chosen directions
        for (let i = 0; i < 5; i++) {
            launchApple(i * 120, Math.random() * 0.15 - 0.05, directions[i]);
        }
    });
}