// Main JavaScript file for all pages

// Theme management
function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  createThemeToggle();
}

function createThemeToggle() {
  const button = document.createElement('button');
  button.className = 'theme-toggle';
  button.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"></path>
    </svg>
  `;
  
  button.addEventListener('click', toggleTheme);
  document.body.appendChild(button);
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  
  // Animate theme toggle button
  const button = document.querySelector('.theme-toggle');
  button.style.transform = 'scale(0.8)';
  setTimeout(() => {
    button.style.transform = '';
  }, 200);
}

// Mobile menu handling
function initMobileMenu() {
  const menuToggle = document.getElementById('menu-toggle');
  const mainNav = document.getElementById('main-nav');
  
  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', function() {
      mainNav.classList.toggle('active');
      menuToggle.classList.toggle('active');
    });
  }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initTheme();
  initMobileMenu();
  
  // Add smooth scrolling
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
});

// Add scroll effect to header
const header = document.getElementById('main-header');
let lastScrollTop = 0;

window.addEventListener('scroll', function() {
  let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  
  if (scrollTop > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
  
  lastScrollTop = scrollTop;
});

// Add CSS for animated menu icon
const style = document.createElement('style');
style.textContent = `
  #menu-toggle span {
    transition: all 0.3s;
  }
  
  #menu-toggle span.active:nth-child(1) {
    transform: rotate(45deg) translate(5px, 5px);
  }
  
  #menu-toggle span.active:nth-child(2) {
    opacity: 0;
  }
  
  #menu-toggle span.active:nth-child(3) {
    transform: rotate(-45deg) translate(7px, -6px);
  }
  
  #main-header.scrolled {
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`;
document.head.appendChild(style);

// Helper functions that can be used across pages
function createElement(tag, attributes = {}, children = []) {
  const element = document.createElement(tag);
  
  // Set attributes
  for (const [key, value] of Object.entries(attributes)) {
    if (key === 'className') {
      element.className = value;
    } else if (key === 'textContent') {
      element.textContent = value;
    } else {
      element.setAttribute(key, value);
    }
  }
  
  // Append children
  children.forEach(child => {
    if (typeof child === 'string') {
      element.appendChild(document.createTextNode(child));
    } else {
      element.appendChild(child);
    }
  });
  
  return element;
}

// Add a simple animation for page transitions
document.addEventListener('DOMContentLoaded', function() {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  
  setTimeout(() => {
    document.body.style.opacity = '1';
  }, 50);
});

// Detect browser language and show language notification
document.addEventListener('DOMContentLoaded', function() {
  const userLanguage = navigator.language || navigator.userLanguage;
  
  // Only show for non-Ukrainian languages
  if (userLanguage && !userLanguage.startsWith('uk')) {
    showLanguageNotification();
  }
});

function showLanguageNotification() {
  const notification = createElement('div', {
    className: 'language-notification'
  }, [
    createElement('p', {
      textContent: 'Цей сайт доступний українською мовою'
    }),
    createElement('button', {
      className: 'close-notification',
      textContent: '×'
    })
  ]);
  
  document.body.appendChild(notification);
  
  // Style the notification
  const notificationStyles = `
    .language-notification {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background-color: var(--color-primary);
      color: white;
      padding: 10px 15px;
      border-radius: var(--border-radius-md);
      box-shadow: var(--shadow-md);
      display: flex;
      align-items: center;
      justify-content: space-between;
      z-index: 1000;
      animation: slideIn 0.5s ease forwards;
    }
    
    .close-notification {
      background: none;
      border: none;
      color: white;
      font-size: 1.5rem;
      cursor: pointer;
      margin-left: 10px;
    }
    
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `;
  
  const styleElement = document.createElement('style');
  styleElement.textContent = notificationStyles;
  document.head.appendChild(styleElement);
  
  // Handle close button
  const closeButton = notification.querySelector('.close-notification');
  closeButton.addEventListener('click', function() {
    notification.style.animation = 'slideOut 0.5s ease forwards';
    
    const slideOutStyle = `
      @keyframes slideOut {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(100%);
          opacity: 0;
        }
      }
    `;
    
    const slideOutStyleElement = document.createElement('style');
    slideOutStyleElement.textContent = slideOutStyle;
    document.head.appendChild(slideOutStyleElement);
    
    setTimeout(() => {
      notification.remove();
    }, 500);
  });
  
  // Auto-hide after 5 seconds
  setTimeout(() => {
    if (document.body.contains(notification)) {
      closeButton.click();
    }
  }, 5000);
}

// Add smooth scrolling for anchor links
document.addEventListener('click', function(e) {
  const target = e.target;
  
  if (target.tagName === 'A' && target.getAttribute('href').startsWith('#')) {
    const id = target.getAttribute('href').substring(1);
    const element = document.getElementById(id);
    
    if (element) {
      e.preventDefault();
      
      window.scrollTo({
        top: element.offsetTop - 80, // Account for fixed header
        behavior: 'smooth'
      });
    }
  }
});