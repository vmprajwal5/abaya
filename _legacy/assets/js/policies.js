document.addEventListener('DOMContentLoaded', () => {
    generateTOC();
    initScrollSpy();
    initAccordions();
});

/* 1. Auto-Generate Table of Contents */
function generateTOC() {
    const tocList = document.getElementById('tocList');
    if (!tocList) return; // Exit if no sidebar

    const headings = document.querySelectorAll('.policy-section h2');
    
    headings.forEach((heading, index) => {
        // Create ID if missing
        if (!heading.id) {
            heading.id = `section-${index + 1}`;
            heading.parentElement.id = `section-wrapper-${index + 1}`;
        }

        const li = document.createElement('li');
        const link = document.createElement('a');
        link.href = `#${heading.parentElement.id}`;
        link.className = 'toc-link';
        link.innerText = heading.innerText;
        
        // Smooth Scroll
        link.onclick = (e) => {
            e.preventDefault();
            document.getElementById(heading.parentElement.id).scrollIntoView({
                behavior: 'smooth'
            });
        };

        li.appendChild(link);
        tocList.appendChild(li);
    });
}

/* 2. Scroll Spy (Highlight Sidebar) */
function initScrollSpy() {
    const sections = document.querySelectorAll('.policy-section');
    const navLinks = document.querySelectorAll('.toc-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollY >= sectionTop - 150) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });
}

/* 3. Accordion Logic (Customer Service) */
function initAccordions() {
    const acc = document.getElementsByClassName("accordion-header");
    for (let i = 0; i < acc.length; i++) {
        acc[i].addEventListener("click", function() {
            this.parentElement.classList.toggle("active");
            const icon = this.querySelector('i');
            if(icon) icon.classList.toggle('fa-minus');
            if(icon) icon.classList.toggle('fa-plus');
        });
    }
}

/* 4. Utilities */
function printPage() {
    window.print();
}

function sharePage() {
    if (navigator.share) {
        navigator.share({
            title: document.title,
            url: window.location.href
        });
    } else {
        alert("Link copied to clipboard!");
        navigator.clipboard.writeText(window.location.href);
    }
}