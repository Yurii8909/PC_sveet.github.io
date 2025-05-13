// Discussion page specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
  // Discussion page elements
  const newTopicBtn = document.getElementById('new-topic-btn');
  const newTopicForm = document.getElementById('new-topic-form');
  const cancelTopicBtn = document.getElementById('cancel-topic');
  const topicForm = document.getElementById('topic-form');
  const categoryLinks = document.querySelectorAll('.category-list a');
  const topicItems = document.querySelectorAll('.topic-item');
  const topicLinks = document.querySelectorAll('.topic-link');
  const topicDetail = document.getElementById('topic-detail');
  const backToTopicsBtn = document.getElementById('back-to-topics');
  const topicsList = document.querySelector('.topics-list');
  const replyForm = document.getElementById('reply-form');
  
  // Show/hide new topic form
  if (newTopicBtn && newTopicForm) {
    newTopicBtn.addEventListener('click', function() {
      newTopicForm.style.display = 'block';
      newTopicBtn.style.display = 'none';
      
      // Add animation
      newTopicForm.style.opacity = '0';
      newTopicForm.style.transform = 'translateY(-20px)';
      newTopicForm.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      
      setTimeout(() => {
        newTopicForm.style.opacity = '1';
        newTopicForm.style.transform = 'translateY(0)';
      }, 50);
    });
  }
  
  // Cancel new topic
  if (cancelTopicBtn && newTopicForm && newTopicBtn) {
    cancelTopicBtn.addEventListener('click', function() {
      // Add animation
      newTopicForm.style.opacity = '0';
      newTopicForm.style.transform = 'translateY(-20px)';
      
      setTimeout(() => {
        newTopicForm.style.display = 'none';
        newTopicBtn.style.display = 'block';
      }, 300);
    });
  }
  
  // Submit new topic
  if (topicForm) {
    topicForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const title = document.getElementById('topic-title').value;
      const category = document.getElementById('topic-category').value;
      const content = document.getElementById('topic-content').value;
      const username = document.getElementById('topic-username').value;
      
      if (title && category && content && username) {
        // Create new topic item (in a real app this would be saved to a database)
        const newTopic = createTopicItem(title, category, content, username);
        
        // Add it to the top of the list
        if (topicsList) {
          topicsList.insertBefore(newTopic, topicsList.firstChild);
          
          // Reset form
          topicForm.reset();
          
          // Hide form
          if (cancelTopicBtn) {
            cancelTopicBtn.click();
          }
          
          // Show success message
          showNotification('Нову тему успішно створено!', 'success');
        }
      } else {
        showNotification('Будь ласка, заповніть всі поля.', 'error');
      }
    });
  }
  
  // Filter topics by category
  if (categoryLinks) {
    categoryLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Update active category
        categoryLinks.forEach(l => l.classList.remove('active'));
        this.classList.add('active');
        
        const category = this.getAttribute('data-category');
        
        // Filter topics
        topicItems.forEach(item => {
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
  }
  
  // Show topic detail
  if (topicLinks && topicDetail) {
    topicLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        
        const topicId = this.getAttribute('href').substring(1);
        const topic = this.closest('.topic-item');
        
        if (topic) {
          const title = topic.querySelector('.topic-title').textContent;
          const author = topic.querySelector('.topic-author').textContent.replace('Автор: ', '');
          const date = topic.querySelector('.topic-date').textContent;
          const content = topic.querySelector('.topic-preview').textContent;
          
          // Populate topic detail view
          document.getElementById('detail-title').textContent = title;
          document.getElementById('detail-author').textContent = author;
          document.getElementById('detail-date').textContent = date;
          document.getElementById('detail-content').textContent = content;
          
          // Show detail view, hide topics list
          topicsList.style.display = 'none';
          newTopicBtn.style.display = 'none';
          topicDetail.style.display = 'block';
          
          // Load replies (in a real app these would come from a database)
          loadReplies(topicId);
        }
      });
    });
  }
  
  // Back to topics list
  if (backToTopicsBtn && topicDetail && topicsList) {
    backToTopicsBtn.addEventListener('click', function() {
      topicDetail.style.display = 'none';
      topicsList.style.display = 'flex';
      newTopicBtn.style.display = 'block';
    });
  }
  
  // Submit reply
  if (replyForm) {
    replyForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const content = document.getElementById('reply-content').value;
      const username = document.getElementById('reply-username').value;
      
      if (content && username) {
        // Add reply (in a real app this would be saved to a database)
        addReply(username, content);
        
        // Reset form
        replyForm.reset();
        
        // Show success message
        showNotification('Вашу відповідь додано!', 'success');
      } else {
        showNotification('Будь ласка, заповніть всі поля.', 'error');
      }
    });
  }
  
  // Helper functions
  function createTopicItem(title, category, content, username) {
    const topic = document.createElement('div');
    topic.className = 'topic-item';
    topic.setAttribute('data-category', category);
    
    const now = new Date();
    const date = `${now.getDate()} ${getMonthName(now.getMonth())} ${now.getFullYear()}`;
    
    let categoryText = '';
    switch (category) {
      case 'windows': categoryText = 'Windows'; break;
      case 'macos': categoryText = 'macOS'; break;
      case 'linux': categoryText = 'Linux'; break;
      case 'mobile': categoryText = 'Мобільні ОС'; break;
      case 'other': categoryText = 'Інше'; break;
    }
    
    topic.innerHTML = `
      <div class="topic-header">
        <h3 class="topic-title">${title}</h3>
        <span class="topic-category">${categoryText}</span>
      </div>
      <div class="topic-meta">
        <span class="topic-author">Автор: ${username}</span>
        <span class="topic-date">${date}</span>
        <span class="topic-replies">Відповідей: 0</span>
      </div>
      <div class="topic-preview">
        ${content}
      </div>
      <a href="#new-topic-${Date.now()}" class="topic-link">Переглянути</a>
    `;
    
    // Add event listener to the new topic link
    const newTopicLink = topic.querySelector('.topic-link');
    newTopicLink.addEventListener('click', function(e) {
      e.preventDefault();
      
      const topicId = this.getAttribute('href').substring(1);
      
      // Populate topic detail view
      document.getElementById('detail-title').textContent = title;
      document.getElementById('detail-author').textContent = username;
      document.getElementById('detail-date').textContent = date;
      document.getElementById('detail-content').textContent = content;
      
      // Show detail view, hide topics list
      topicsList.style.display = 'none';
      newTopicBtn.style.display = 'none';
      topicDetail.style.display = 'block';
      
      // Clear replies
      document.getElementById('replies-list').innerHTML = '<p>Наразі немає відповідей.</p>';
    });
    
    return topic;
  }
  
  function loadReplies(topicId) {
    const repliesList = document.getElementById('replies-list');
    
    // In a real app, replies would be loaded from a database
    // For demo purposes, we'll show some sample replies
    let replies = [];
    
    if (topicId === 'topic1') {
      replies = [
        { author: 'Максим', date: '16 березня 2025', content: 'У мене була така ж проблема. Спробуйте відключити автоматичне оновлення драйверів у налаштуваннях.' },
        { author: 'Інна', date: '16 березня 2025', content: 'Можливо, варто перевірити температуру процесора. Windows 11 потребує більше ресурсів, і ваш комп\'ютер може перегріватися.' },
        { author: 'Дмитро', date: '17 березня 2025', content: 'Спробуйте видалити останнє оновлення через Параметри > Оновлення та безпека > Перегляд історії оновлень > Видалити оновлення.' },
        { author: 'Адміністратор', date: '17 березня 2025', content: 'Microsoft визнала проблему з останнім оновленням. Вони обіцяють випустити виправлення протягом тижня. Тим часом, спробуйте рішення, запропоновані іншими користувачами.' }
      ];
    } else if (topicId === 'topic2') {
      replies = [
        { author: 'Андрій', date: '10 березня 2025', content: 'Ubuntu - найкращий вибір для початківців. Має дружній інтерфейс і велику спільноту.' },
        { author: 'Віталій', date: '11 березня 2025', content: 'Я б порадив Linux Mint. Він ще простіший за Ubuntu і більше схожий на Windows.' },
        { author: 'Олена', date: '11 березня 2025', content: 'Pop!_OS також відмінний варіант. Оптимізований для геймерів і має відмінну підтримку драйверів.' },
        { author: 'Сергій', date: '12 березня 2025', content: 'Manjaro - чудовий дистрибутив на базі Arch Linux, але з простішим встановленням і налаштуванням.' },
        { author: 'Катерина', date: '13 березня 2025', content: 'Elementary OS має красивий інтерфейс, схожий на macOS. Дуже простий у використанні.' },
        { author: 'Роман', date: '14 березня 2025', content: 'Zorin OS спеціально розроблений для користувачів, які переходять з Windows. Має знайомий інтерфейс.' },
        { author: 'Юлія', date: '14 березня 2025', content: 'Ubuntu MATE - легковагий варіант Ubuntu з класичним інтерфейсом. Працює швидко навіть на старих комп\'ютерах.' }
      ];
    } else if (topicId === 'topic3') {
      replies = [
        { author: 'Володимир', date: '6 березня 2025', content: 'Для 5-річного MacBook Pro я б не рекомендував. Нові версії macOS оптимізовані для новіших моделей і можуть сповільнити старі машини.' },
        { author: 'Ігор', date: '7 березня 2025', content: 'Все залежить від моделі та конфігурації. Подивіться список сумісних моделей на сайті Apple.' },
        { author: 'Анастасія', date: '8 березня 2025', content: 'Я оновила свій MacBook Pro 2018 року і не помітила жодних проблем. Навпаки, отримала нові функції безпеки та покращення продуктивності.' }
      ];
    } else if (topicId === 'topic4') {
      replies = [
        { author: 'Микола', date: '28 лютого 2025', content: 'Android пропонує більше свободи налаштування та вибору пристроїв. iOS має кращу екосистему, якщо ви використовуєте інші пристрої Apple.' },
        { author: 'Тетяна', date: '1 березня 2025', content: 'У 2025 році різниця між ними менша, ніж раніше. iOS отримав більше можливостей налаштування, а Android став стабільнішим.' },
        { author: 'Олег', date: '2 березня 2025', content: 'Якщо вам важлива конфіденційність, iOS має перевагу. Apple менше збирає даних про користувачів у порівнянні з Google.' },
        { author: 'Марина', date: '3 березня 2025', content: 'Android має перевагу в інтеграції з сервісами Google, які багато хто використовує щодня.' },
        { author: 'Петро', date: '4 березня 2025', content: 'iPhones зазвичай отримують оновлення протягом 5-7 років, тоді як більшість Android-смартфонів - лише 2-4 роки.' },
        { author: 'Наталія', date: '5 березня 2025', content: 'Якщо вам важлива камера, топові моделі з обох систем зараз на одному рівні.' },
        { author: 'Василь', date: '6 березня 2025', content: 'Android пропонує більший вибір цінових категорій. Якщо бюджет обмежений, можна знайти хороший Android-смартфон дешевше, ніж iPhone.' },
        { author: 'Софія', date: '7 березня 2025', content: 'Я користувалася обома системами і вирішила залишитися з iOS через її простоту та стабільність.' },
        { author: 'Антон', date: '8 березня 2025', content: 'Якщо ви використовуєте Windows-комп\'ютер, Android краще інтегрується з ним. Якщо Mac - то iPhone.' },
        { author: 'Ірина', date: '9 березня 2025', content: 'Порівняйте конкретні моделі смартфонів, а не просто ОС. Деякі Android-пристрої перевершують iPhone у певних аспектах, і навпаки.' },
        { author: 'Тарас', date: '10 березня 2025', content: 'Я рекомендую піти в магазин і потримати різні моделі в руках. Іноді фізичні відчуття від користування пристроєм важливіші, ніж характеристики.' },
        { author: 'Даша', date: '11 березня 2025', content: 'У 2025 році варто звернути увагу на підтримку ШІ-функцій. В цьому плані Android починає випереджати iOS.' }
      ];
    } else if (topicId === 'topic5') {
      replies = [
        { author: 'Олексій', date: '20 лютого 2025', content: 'Традиційні ОС еволюціонуватимуть у напрямку інтеграції з хмарними сервісами. Ми бачимо це вже зараз з Windows 365 та Chrome OS.' },
        { author: 'Євген', date: '21 лютого 2025', content: 'Думаю, ми побачимо більше ОС, орієнтованих на конкретні задачі, а не універсальних систем.' },
        { author: 'Галина', date: '22 лютого 2025', content: 'Штучний інтелект змінить способи взаємодії з ОС. Голосові та жестові інтерфейси стануть основними.' },
        { author: 'Богдан', date: '24 лютого 2025', content: 'Межа між мобільними та десктопними ОС стиратиметься. Windows вже запроваджує підтримку Android-додатків.' },
        { author: 'Лідія', date: '25 лютого 2025', content: 'З розвитком VR та AR, з\'являться нові ОС, орієнтовані на ці технології. Meta вже працює над операційною системою для метавсесвіту.' },
        { author: 'Ярослав', date: '27 лютого 2025', content: 'Безпека та конфіденційність стануть ключовими факторами при виборі ОС. Системи з відкритим кодом отримають перевагу через можливість аудиту.' }
      ];
    }
    
    if (replies.length > 0) {
      repliesList.innerHTML = '';
      
      replies.forEach(reply => {
        const replyElement = document.createElement('div');
        replyElement.className = 'reply-item';
        
        replyElement.innerHTML = `
          <div class="post-author">
            <div class="author-avatar"></div>
            <div class="author-name">${reply.author}</div>
            <div class="post-date">${reply.date}</div>
          </div>
          <div class="post-content">
            ${reply.content}
          </div>
        `;
        
        repliesList.appendChild(replyElement);
      });
    } else {
      repliesList.innerHTML = '<p>Наразі немає відповідей.</p>';
    }
  }
  
  function addReply(username, content) {
    const repliesList = document.getElementById('replies-list');
    
    // If there's a "no replies" message, remove it
    if (repliesList.innerHTML.includes('Наразі немає відповідей')) {
      repliesList.innerHTML = '';
    }
    
    const replyElement = document.createElement('div');
    replyElement.className = 'reply-item';
    
    const now = new Date();
    const date = `${now.getDate()} ${getMonthName(now.getMonth())} ${now.getFullYear()}`;
    
    replyElement.innerHTML = `
      <div class="post-author">
        <div class="author-avatar"></div>
        <div class="author-name">${username}</div>
        <div class="post-date">${date}</div>
      </div>
      <div class="post-content">
        ${content}
      </div>
    `;
    
    repliesList.appendChild(replyElement);
    
    // Add animation
    replyElement.style.opacity = '0';
    replyElement.style.transform = 'translateY(20px)';
    replyElement.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    
    setTimeout(() => {
      replyElement.style.opacity = '1';
      replyElement.style.transform = 'translateY(0)';
    }, 50);
    
    // Update reply count in the topic list
    const topicDetailTitle = document.getElementById('detail-title').textContent;
    
    topicItems.forEach(item => {
      const itemTitle = item.querySelector('.topic-title').textContent;
      
      if (itemTitle === topicDetailTitle) {
        const replyCountElement = item.querySelector('.topic-replies');
        let replyCount = parseInt(replyCountElement.textContent.match(/\d+/)[0]);
        replyCount++;
        replyCountElement.textContent = `Відповідей: ${replyCount}`;
      }
    });
  }
  
  function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Add notification styles
    const notificationStyle = document.createElement('style');
    notificationStyle.textContent = `
      .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 16px;
        border-radius: var(--border-radius-md);
        color: white;
        font-weight: 500;
        z-index: 1000;
        box-shadow: var(--shadow-md);
        animation: notificationIn 0.3s ease, notificationOut 0.3s ease 3s forwards;
      }
      
      .notification.success {
        background-color: var(--color-success);
      }
      
      .notification.error {
        background-color: var(--color-error);
      }
      
      @keyframes notificationIn {
        from {
          transform: translateY(-20px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }
      
      @keyframes notificationOut {
        from {
          transform: translateY(0);
          opacity: 1;
        }
        to {
          transform: translateY(-20px);
          opacity: 0;
        }
      }
    `;
    
    document.head.appendChild(notificationStyle);
    
    // Remove notification after animation
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 3300);
  }
  
  function getMonthName(monthIndex) {
    const months = [
      'січня', 'лютого', 'березня', 'квітня', 'травня', 'червня',
      'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня'
    ];
    
    return months[monthIndex];
  }
});