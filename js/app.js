// Modules to load sequentially to maintain DOM order
const modules = [
    { name: 'navbar', type: 'shared' },
    { name: 'hero', type: 'sections' },
    { name: 'about', type: 'sections' },
    { name: 'solutions', type: 'sections' },
    { name: 'industries', type: 'sections' },
    { name: 'costarica', type: 'sections' },
    { name: 'traceability', type: 'sections' },
    { name: 'trust', type: 'sections' },
    { name: 'contact', type: 'sections' },
    { name: 'footer', type: 'shared' }
];

async function loadModules() {
    for (const mod of modules) {
        try {
            const response = await fetch(`${mod.type}/${mod.name}.html`);
            if (response.ok) {
                const html = await response.text();
                const container = document.getElementById(`${mod.name}-module`);
                if (container) {
                    container.innerHTML = html;
                }
            } else {
                console.error(`Error loading module: ${mod.name}`);
            }
        } catch (error) {
            console.error(`Fetch error for ${mod.name}:`, error);
        }
    }
    
    // Once DOM is fully assembled, apply translations and bind events
    if (typeof window.i18nInit === 'function') {
        window.i18nInit();
    }
    bindScrollEvents();
    bindScrollAnimations();
}

function bindScrollEvents() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            e.preventDefault();
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerOffset;
  
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function bindScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // observer.unobserve(entry.target); // Optional: if we want them to re-animate when scrolled up/down
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// Initialize application
document.addEventListener('DOMContentLoaded', loadModules);
