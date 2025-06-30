document.addEventListener('DOMContentLoaded', function() {
    // Navigation functionality
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    const navIndicator = document.querySelector('.nav-indicator');
    
    // Set initial active section
    let activeSection = 'about';
    
    // Handle nav link clicks
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-section');
            
            // Update active section
            activeSection = sectionId;
            
            // Move indicator
            const linkRect = this.getBoundingClientRect();
            const navRect = this.parentElement.getBoundingClientRect();
            const offset = linkRect.left - navRect.left;
            const width = linkRect.width;
            
            navIndicator.style.transform = `translateX(${offset}px)`;
            navIndicator.style.width = `${width}px`;
            
            // Handle special case for resume (open PDF in new tab)
            if (sectionId === 'resume') {
                window.open('cv.me.pdf', '_blank');
                return;
            }
            
            // Update section visibility
            sections.forEach(section => {
                if (section.id === sectionId) {
                    section.classList.add('active');
                } else {
                    section.classList.remove('active');
                }
            });
            
            // Update active link styling
            navLinks.forEach(navLink => {
                if (navLink.getAttribute('data-section') === sectionId) {
                    navLink.classList.add('active');
                } else {
                    navLink.classList.remove('active');
                }
            });
        });
    });
    
    // Expandable resume blocks
    const expandButtons = document.querySelectorAll('.expand-btn');
    expandButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const block = this.closest('.resume-block');
            block.classList.toggle('expanded');
        });
    });
    
    // Initialize nav indicator position
    const activeLink = document.querySelector(`.nav-link[data-section="${activeSection}"]`);
    if (activeLink) {
        const linkRect = activeLink.getBoundingClientRect();
        const navRect = activeLink.parentElement.getBoundingClientRect();
        const offset = linkRect.left - navRect.left;
        const width = linkRect.width;
        
        navIndicator.style.transform = `translateX(${offset}px)`;
        navIndicator.style.width = `${width}px`;
    }
});