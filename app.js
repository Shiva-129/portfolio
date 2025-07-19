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

// Modern rotating text animation for developer/designer toggle
function initTextAnimation() {
    const designerElement = document.querySelector('.designer');
    if (!designerElement) return;

    const words = ['DEVELOPER', 'DESIGNER'];
    let currentIndex = 0;

    function changeText() {
        // Modern upward rotation exit
        designerElement.style.transform = 'translateY(-30px) rotateX(90deg) scale(0.8)';
        designerElement.style.opacity = '0';

        setTimeout(() => {
            // Change text
            currentIndex = (currentIndex + 1) % words.length;
            designerElement.textContent = words[currentIndex];

            // Reset position for entrance (from below)
            designerElement.style.transform = 'translateY(30px) rotateX(-90deg) scale(0.8)';

            // Small delay for smooth transition
            setTimeout(() => {
                // Modern upward rotation entrance
                designerElement.style.transform = 'translateY(0) rotateX(0deg) scale(1)';
                designerElement.style.opacity = '1';
            }, 50);
        }, 400);
    }

    // Set modern transition properties with smooth easing
    designerElement.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    designerElement.style.transformStyle = 'preserve-3d';
    designerElement.style.perspective = '1000px';

    // Start the animation loop
    setInterval(changeText, 5000);
}

// Initialize text animation when DOM is loaded
document.addEventListener('DOMContentLoaded', initTextAnimation);

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

// Falling Letters Animation
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
        const startX = logoRect.left + scrollX;
        const startY = logoRect.top + scrollY;

        // Create falling letters
        const logoText = 'SHOUKO';

        // Define subtle weight differences for natural variation
        const letterWeights = [1.1, 0.9, 1.0, 0.95, 1.05, 1.0]; // S, H, O, U, K, O

        function createFallingLetter(letter, index) {
            const letterElement = document.createElement('div');
            letterElement.textContent = letter;
            letterElement.style.position = 'absolute';
            letterElement.style.left = (startX + (index * 20)) + 'px';
            letterElement.style.top = startY + 'px';
            letterElement.style.fontSize = '24px';
            letterElement.style.fontWeight = '700';
            letterElement.style.color = '#f0f0f0';
            letterElement.style.zIndex = '3000';
            letterElement.style.pointerEvents = 'none';
            letterElement.style.textShadow = '0 0 8px rgba(240, 240, 240, 0.4)';
            letterElement.style.userSelect = 'none';

            document.body.appendChild(letterElement);

            // Get letter weight for subtle speed variation
            const weight = letterWeights[index];

            // Clean animation parameters
            const fallDistance = window.innerHeight - startY + 50;
            const baseDuration = 3500; // Slower, more graceful fall
            const fallDuration = baseDuration / weight;
            const horizontalDrift = (index - 2.5) * 15; // Subtle spread from center
            const rotationAmount = (index % 2 === 0 ? 1 : -1) * 180; // Alternating rotation

            const startTime = performance.now();

            function animateFall(now) {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / fallDuration, 1);

                // Gentle easing for graceful fall
                const easing = progress * progress;

                const currentY = startY + (fallDistance * easing);
                const currentX = startX + (index * 20) + (horizontalDrift * progress * 0.5);
                const currentRotation = rotationAmount * progress * 0.5;
                const currentOpacity = Math.max(0.1, 1 - (progress * 0.8));

                letterElement.style.left = currentX + 'px';
                letterElement.style.top = currentY + 'px';
                letterElement.style.transform = `rotate(${currentRotation}deg)`;
                letterElement.style.opacity = currentOpacity;

                if (progress < 1) {
                    requestAnimationFrame(animateFall);
                } else {
                    // Clean removal
                    setTimeout(() => {
                        if (letterElement.parentNode) {
                            letterElement.parentNode.removeChild(letterElement);
                        }
                    }, 200);
                }
            }

            requestAnimationFrame(animateFall);
        }

        // Create all falling letters simultaneously
        for (let i = 0; i < logoText.length; i++) {
            createFallingLetter(logoText[i], i);
        }
    });
}