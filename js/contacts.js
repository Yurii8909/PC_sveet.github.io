// Contacts page specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');
  const sendAnotherBtn = document.getElementById('send-another');
  
  // Initialize Google Map
  function initMap() {
    // Координати Херсона
    const kherson = { lat: 46.6354, lng: 32.6169 };
    
    const map = new google.maps.Map(document.getElementById('google-map'), {
      center: kherson,
      zoom: 15
    });
    
    // Додаємо маркер на карту
    const marker = new google.maps.Marker({
      position: kherson,
      map: map,
      title: 'ОС Світ - Херсон'
    });
  }
  
  // Initialize map when the page loads
  initMap();
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Animate form submission
      contactForm.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      contactForm.style.opacity = '0';
      contactForm.style.transform = 'translateY(-20px)';
      
      // Show success message
      setTimeout(() => {
        contactForm.style.display = 'none';
        
        if (formSuccess) {
          formSuccess.style.display = 'block';
          formSuccess.style.opacity = '0';
          formSuccess.style.transform = 'translateY(20px)';
          formSuccess.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
          
          setTimeout(() => {
            formSuccess.style.opacity = '1';
            formSuccess.style.transform = 'translateY(0)';
          }, 50);
        }
      }, 500);
    });
  }
  
  if (sendAnotherBtn) {
    sendAnotherBtn.addEventListener('click', function() {
      // Hide success message
      formSuccess.style.opacity = '0';
      formSuccess.style.transform = 'translateY(20px)';
      
      // Show form again
      setTimeout(() => {
        formSuccess.style.display = 'none';
        contactForm.style.display = 'block';
        
        // Reset form
        contactForm.reset();
        
        setTimeout(() => {
          contactForm.style.opacity = '1';
          contactForm.style.transform = 'translateY(0)';
        }, 50);
      }, 500);
    });
  }
  
  // Animate contact cards on scroll
  const contactCards = document.querySelectorAll('.contact-card');
  
  function checkScroll() {
    contactCards.forEach(card => {
      const cardTop = card.getBoundingClientRect().top;
      const triggerPoint = window.innerHeight * 0.8;
      
      if (cardTop < triggerPoint) {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }
    });
  }
  
  // Reset animation properties
  contactCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  });
  
  // Initial check
  checkScroll();
  
  // Check on scroll
  window.addEventListener('scroll', checkScroll);
});