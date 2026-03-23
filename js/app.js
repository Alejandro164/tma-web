// Modules to load sequentially to maintain DOM order
const modules = [
    { name: 'navbar', type: 'shared' },
    { name: 'footer', type: 'shared' }
];

async function loadModules() {
    const isInsidePages = window.location.pathname.includes('/pages/');
    const basePath = isInsidePages ? '../' : './';

    for (const mod of modules) {
        try {
            const response = await fetch(`${basePath}${mod.type}/${mod.name}.html`);
            if (response.ok) {
                const html = await response.text();
                const container = document.getElementById(`${mod.name}-module`);
                if (container) {
                    container.innerHTML = html;

                    // Rewrite links inside the loaded module
                    const links = container.querySelectorAll('a');
                    links.forEach(link => {
                        const href = link.getAttribute('href');
                        if (!href || href.startsWith('http') || href.startsWith('#')) return;
                        
                        if (isInsidePages) {
                            if (href === 'index.html') {
                                link.setAttribute('href', '../index.html');
                            } else if (!href.includes('/')) {
                                link.setAttribute('href', href); 
                            }
                        } else {
                            if (href !== 'index.html' && !href.includes('/')) {
                                link.setAttribute('href', 'pages/' + href);
                            }
                        }
                    });

                    // Rewrite image srcs in the module
                    const imgs = container.querySelectorAll('img');
                    imgs.forEach(img => {
                        const src = img.getAttribute('src');
                        if (src && !src.startsWith('http') && !src.startsWith('data:')) {
                            img.setAttribute('src', basePath + src);
                        }
                    });

                    // Mobile Menu Toggle Logic
                    if (mod.name === 'navbar') {
                        const toggleBtn = container.querySelector('.mobile-menu-toggle');
                        const navLinksContainer = container.querySelector('nav');
                        
                        if (toggleBtn && navLinksContainer) {
                            toggleBtn.addEventListener('click', () => {
                                const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
                                toggleBtn.setAttribute('aria-expanded', !isExpanded);
                                toggleBtn.classList.toggle('is-active');
                                navLinksContainer.classList.toggle('is-open');
                            });

                            const navLinks = navLinksContainer.querySelectorAll('a');
                            navLinks.forEach(link => {
                                link.addEventListener('click', () => {
                                    toggleBtn.classList.remove('is-active');
                                    navLinksContainer.classList.remove('is-open');
                                    toggleBtn.setAttribute('aria-expanded', 'false');
                                });
                            });
                        }
                    }
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
