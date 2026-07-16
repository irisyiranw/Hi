/* ======================================
   PERSONAL WEBSITE SCRIPTS - IRIS
   Interactive features and functions
   ====================================== */

// SMOOTH SCROLLING - Makes navigation links smooth
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ADD ANIMATION WHEN SCROLLING - Makes cards appear with animation
window.addEventListener('scroll', function() {
    const cards = document.querySelectorAll('.interest-card, .project-card, .quote-card');
    cards.forEach(card => {
        const cardTop = card.getBoundingClientRect().top;
        const cardBottom = card.getBoundingClientRect().bottom;
        if (cardTop < window.innerHeight && cardBottom > 0) {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }
    });
});

function setupQuoteSlideshow() {
    const quotes = [
        { text: "Believe you can and you're halfway there.", author: '— Theodore Roosevelt' },
        { text: 'The future belongs to those who believe in the beauty of their dreams.', author: '— Eleanor Roosevelt' },
        { text: 'You are braver than you believe, stronger than you seem, and smarter than you think.', author: '— A. A. Milne' },
        { text: 'Small steps every day can lead to big dreams.', author: '— Keep going!' },
        { text: 'Be yourself—there is nobody better for the job.', author: '— Be uniquely you!' }
    ];

    const quoteText = document.getElementById('quote-text');
    const quoteAuthor = document.getElementById('quote-author');
    const dots = document.getElementById('quote-dots');
    const previous = document.getElementById('previous-quote');
    const next = document.getElementById('next-quote');
    const card = document.querySelector('.quote-card');
    if (!quoteText || !quoteAuthor || !dots || !previous || !next || !card) return;

    let currentQuote = 0;
    let slideshowTimer;

    function showQuote(index) {
        currentQuote = (index + quotes.length) % quotes.length;
        card.classList.remove('quote-changing');
        void card.offsetWidth;
        card.classList.add('quote-changing');
        quoteText.textContent = quotes[currentQuote].text;
        quoteAuthor.textContent = quotes[currentQuote].author;
        dots.querySelectorAll('button').forEach((dot, dotIndex) => {
            dot.classList.toggle('active', dotIndex === currentQuote);
            dot.setAttribute('aria-current', dotIndex === currentQuote ? 'true' : 'false');
        });
    }

    function restartTimer() {
        clearInterval(slideshowTimer);
        slideshowTimer = setInterval(() => showQuote(currentQuote + 1), 5000);
    }

    quotes.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'quote-dot';
        dot.setAttribute('aria-label', `Show quote ${index + 1}`);
        dot.addEventListener('click', () => {
            showQuote(index);
            restartTimer();
        });
        dots.appendChild(dot);
    });

    previous.addEventListener('click', () => {
        showQuote(currentQuote - 1);
        restartTimer();
    });
    next.addEventListener('click', () => {
        showQuote(currentQuote + 1);
        restartTimer();
    });

    showQuote(0);
    restartTimer();
}

// SET INITIAL OPACITY FOR CARDS AND START THE QUOTE SLIDESHOW
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.interest-card, .project-card, .quote-card');
    cards.forEach(card => {
        card.style.opacity = '0.8';
        card.style.transform = 'translateY(10px)';
        card.style.transition = 'all 0.6s ease';
    });
    setupQuoteSlideshow();
});

// NAVBAR BACKGROUND CHANGE ON SCROLL
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 6px 20px rgba(105, 188, 232, 0.35)';
    } else {
        navbar.style.boxShadow = 'var(--shadow)';
    }
});

// BUTTON CLICK FEEDBACK
document.querySelectorAll('button, .contact-button').forEach(button => {
    button.addEventListener('click', function() {
        console.log('Button clicked! ✨');
    });
});

console.log("Welcome to Iris's Personal Website! 🌈✨");
