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
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ADD ANIMATION WHEN SCROLLING - Makes cards appear with animation
window.addEventListener('scroll', function() {
    const cards = document.querySelectorAll('.interest-card, .project-card, .journal-entry');
    
    cards.forEach(card => {
        const cardTop = card.getBoundingClientRect().top;
        const cardBottom = card.getBoundingClientRect().bottom;
        
        // Check if card is visible in viewport
        if (cardTop < window.innerHeight && cardBottom > 0) {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }
    });
});

// SET INITIAL OPACITY FOR CARDS
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.interest-card, .project-card, .journal-entry');
    cards.forEach(card => {
        card.style.opacity = '0.8';
        card.style.transform = 'translateY(10px)';
        card.style.transition = 'all 0.6s ease';
    });
});

// UPDATE JOURNAL ENTRIES WEEKLY - Change this to add new entries!
function addJournalEntry(week, title, content) {
    const journalContainer = document.querySelector('.journal-container');
    
    const newEntry = document.createElement('div');
    newEntry.className = 'journal-entry';
    newEntry.innerHTML = `
        <div class="journal-date">${week}</div>
        <h3>${title}</h3>
        <p>${content}</p>
    `;
    
    journalContainer.appendChild(newEntry);
    
    // Apply animation to new entry
    newEntry.style.opacity = '0.8';
    newEntry.style.transform = 'translateY(10px)';
    newEntry.style.transition = 'all 0.6s ease';
    
    setTimeout(() => {
        newEntry.style.opacity = '1';
        newEntry.style.transform = 'translateY(0)';
    }, 100);
}

// EXAMPLE: Uncomment below to add a new journal entry
// addJournalEntry('Week 3', 'Learning Something New', 'This is where you can add your next update!');

// NAVBAR BACKGROUND CHANGE ON SCROLL
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 6px 20px rgba(255, 182, 217, 0.4)';
    } else {
        navbar.style.boxShadow = '0 4px 15px rgba(255, 182, 217, 0.3)';
    }
});

// BUTTON CLICK FEEDBACK - Simple animation when you click buttons
document.querySelectorAll('button, .contact-button').forEach(button => {
    button.addEventListener('click', function() {
        // Create a ripple effect
        const ripple = document.createElement('span');
        ripple.style.position = 'absolute';
        ripple.style.width = '20px';
        ripple.style.height = '20px';
        ripple.style.background = 'rgba(255, 255, 255, 0.5)';
        ripple.style.borderRadius = '50%';
        ripple.style.animation = 'ripple 0.6s ease-out';
        
        // Optional: Add the ripple animation if you want
        console.log('Button clicked! ✨');
    });
});

// FUTURE: EMAIL VALIDATION
function validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

// FUTURE: FORM SUBMISSION (when you add a contact form)
function handleContactSubmit(e) {
    e.preventDefault();
    console.log('Form submitted! Remember to ask parents before sending info online 🛡️');
}

// LOG A WELCOME MESSAGE
console.log('Welcome to Iris\'s Personal Website! 🌈✨');
console.log('Feel free to customize the JavaScript to add more interactive features!');
