// News page specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
  // Filter news by category
  const filterButtons = document.querySelectorAll('.filter-btn');
  const newsItems = document.querySelectorAll('.news-item');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Update active button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      
      const category = this.getAttribute('data-filter');
      
      // Filter news items
      newsItems.forEach(item => {
        if (category === 'all' || item.getAttribute('data-category') === category) {
          item.classList.remove('hidden');
          // Apply fade-in animation
          item.style.animation = 'none';
          item.offsetHeight; // Trigger reflow
          item.style.animation = 'fadeIn 0.5s ease forwards';
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });
  
  // Handle news item clicks
  newsItems.forEach(item => {
    item.addEventListener('click', function(e) {
      // Only redirect if the link itself wasn't clicked
      if (!e.target.classList.contains('read-more')) {
        const id = this.getAttribute('id');
        if (id) {
          window.location.hash = id;
        }
      }
    });
  });
  
  // Highlight news item based on URL hash
  function highlightNewsItem() {
    const hash = window.location.hash;
    if (hash) {
      const targetNews = document.querySelector(hash);
      if (targetNews) {
        // Remove highlight from all news items
        newsItems.forEach(item => item.classList.remove('highlighted'));
        
        // Add highlight to the target news item
        targetNews.classList.add('highlighted');
        
        // Scroll to the news item
        setTimeout(() => {
          targetNews.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
        
        // Apply highlight styling
        const style = document.createElement('style');
        style.textContent = `
          .news-item.highlighted {
            box-shadow: 0 0 0 3px var(--color-primary);
            animation: pulse 2s infinite;
          }
          
          @keyframes pulse {
            0% {
              box-shadow: 0 0 0 0 rgba(0, 102, 204, 0.7);
            }
            70% {
              box-shadow: 0 0 0 6px rgba(0, 102, 204, 0);
            }
            100% {
              box-shadow: 0 0 0 0 rgba(0, 102, 204, 0);
            }
          }
        `;
        document.head.appendChild(style);
      }
    }
  }
  
  // Check for hash on page load
  highlightNewsItem();
  
  // Check for hash changes
  window.addEventListener('hashchange', highlightNewsItem);
});