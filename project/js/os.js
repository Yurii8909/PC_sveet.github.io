// Operating Systems page specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
  // Filter OS by category
  const tabButtons = document.querySelectorAll('.tab-btn');
  const osItems = document.querySelectorAll('.os-item');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Update active button
      tabButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      
      const category = this.getAttribute('data-category');
      
      // Filter OS items
      osItems.forEach(item => {
        const itemCategories = item.getAttribute('data-category')?.split(' ') || [];
        
        if (category === 'all' || itemCategories.includes(category)) {
          item.classList.remove('hidden');
          // Apply fade-in animation
          item.style.animation = 'none';
          item.offsetHeight; // Trigger reflow
          item.style.animation = 'fadeInUp 0.8s ease forwards';
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });
  
  // Handle OS download and purchase actions
  const actionButtons = document.querySelectorAll('.os-actions .btn');
  
  actionButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      
      const action = this.getAttribute('href').substring(1);
      const osName = this.closest('.os-item').querySelector('h3').textContent;
      
      // Show modal dialog based on action
      if (action.includes('buy')) {
        showPurchaseModal(osName);
      } else if (action.includes('download')) {
        showDownloadModal(osName);
      } else if (action.includes('trial')) {
        showTrialModal(osName);
      } else if (action.includes('info')) {
        showInfoModal(osName);
      }
    });
  });
  
  // Modal implementations
  function createModal(title, content, buttons) {
    // Create modal backdrop
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    
    // Create modal container
    const modal = document.createElement('div');
    modal.className = 'modal';
    
    // Create modal header
    const header = document.createElement('div');
    header.className = 'modal-header';
    
    const titleElement = document.createElement('h3');
    titleElement.textContent = title;
    
    const closeButton = document.createElement('button');
    closeButton.className = 'modal-close';
    closeButton.innerHTML = '&times;';
    closeButton.addEventListener('click', () => {
      closeModal(backdrop);
    });
    
    header.appendChild(titleElement);
    header.appendChild(closeButton);
    
    // Create modal body
    const body = document.createElement('div');
    body.className = 'modal-body';
    body.innerHTML = content;
    
    // Create modal footer with buttons
    const footer = document.createElement('div');
    footer.className = 'modal-footer';
    
    buttons.forEach(buttonConfig => {
      const button = document.createElement('button');
      button.textContent = buttonConfig.text;
      button.className = buttonConfig.class || 'btn';
      
      if (buttonConfig.action === 'close') {
        button.addEventListener('click', () => {
          closeModal(backdrop);
        });
      } else if (typeof buttonConfig.action === 'function') {
        button.addEventListener('click', () => {
          buttonConfig.action();
          closeModal(backdrop);
        });
      }
      
      footer.appendChild(button);
    });
    
    // Assemble modal
    modal.appendChild(header);
    modal.appendChild(body);
    modal.appendChild(footer);
    backdrop.appendChild(modal);
    
    // Add to document
    document.body.appendChild(backdrop);
    
    // Add modal styles
    const modalStyles = `
      .modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        animation: fadeIn 0.3s ease;
      }
      
      .modal {
        background-color: white;
        border-radius: var(--border-radius-lg);
        width: 90%;
        max-width: 500px;
        max-height: 90vh;
        overflow: auto;
        box-shadow: var(--shadow-lg);
        animation: scaleIn 0.3s ease;
      }
      
      .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--spacing-md) var(--spacing-lg);
        border-bottom: 1px solid var(--color-border);
      }
      
      .modal-header h3 {
        margin: 0;
      }
      
      .modal-close {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: var(--color-text-tertiary);
      }
      
      .modal-body {
        padding: var(--spacing-lg);
      }
      
      .modal-footer {
        padding: var(--spacing-md) var(--spacing-lg);
        border-top: 1px solid var(--color-border);
        display: flex;
        justify-content: flex-end;
        gap: var(--spacing-sm);
      }
      
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes scaleIn {
        from { transform: scale(0.9); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
      }
    `;
    
    const styleElement = document.createElement('style');
    styleElement.textContent = modalStyles;
    document.head.appendChild(styleElement);
    
    return backdrop;
  }
  
  function closeModal(modalBackdrop) {
    modalBackdrop.style.animation = 'fadeOut 0.3s ease forwards';
    
    const modal = modalBackdrop.querySelector('.modal');
    modal.style.animation = 'scaleOut 0.3s ease forwards';
    
    const closeAnimation = `
      @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
      }
      
      @keyframes scaleOut {
        from { transform: scale(1); opacity: 1; }
        to { transform: scale(0.9); opacity: 0; }
      }
    `;
    
    const styleElement = document.createElement('style');
    styleElement.textContent = closeAnimation;
    document.head.appendChild(styleElement);
    
    setTimeout(() => {
      if (document.body.contains(modalBackdrop)) {
        document.body.removeChild(modalBackdrop);
      }
    }, 300);
  }
  
  function showPurchaseModal(osName) {
    let price = "Ціна недоступна";
    let buttonText = "Купити";
    
    if (osName.includes("Windows 11")) {
      price = "3500 грн";
    } else if (osName.includes("Windows Server")) {
      price = "20000 грн";
    }
    
    const content = `
      <p>Ви збираєтесь придбати ${osName}.</p>
      <p>Ціна: <strong>${price}</strong></p>
      <p>Для придбання ліцензійної копії вам потрібно буде перейти на офіційний сайт виробника.</p>
      <div class="form-group mt-md">
        <label for="purchase-email">Електронна пошта для отримання ліцензії:</label>
        <input type="email" id="purchase-email" placeholder="your@email.com">
      </div>
    `;
    
    createModal(`Придбання ${osName}`, content, [
      { text: 'Скасувати', action: 'close', class: 'btn btn-secondary' },
      { text: buttonText, action: function() {
        alert(`Це демонстраційний сайт. В реальній версії тут був би перехід до оплати ${osName}.`);
      }, class: 'btn btn-primary' }
    ]);
  }
  
  function showDownloadModal(osName) {
    let downloadSize = "Невідомий розмір";
    let downloadLink = "#";
    
    if (osName.includes("macOS")) {
      downloadSize = "12.2 ГБ";
      downloadLink = "#macos-download-link";
    } else if (osName.includes("Ubuntu")) {
      downloadSize = "3.6 ГБ";
      downloadLink = "#ubuntu-download-link";
    }
    
    const content = `
      <p>Ви збираєтесь завантажити ${osName}.</p>
      <p>Розмір файлу: <strong>${downloadSize}</strong></p>
      <p>Перед встановленням ознайомтесь з системними вимогами та інструкцією з встановлення.</p>
      <div class="download-options mt-md">
        <h4>Варіанти завантаження:</h4>
        <div class="download-option">
          <input type="radio" id="download-direct" name="download-type" checked>
          <label for="download-direct">Пряме завантаження</label>
        </div>
        <div class="download-option">
          <input type="radio" id="download-torrent" name="download-type">
          <label for="download-torrent">Торрент</label>
        </div>
      </div>
    `;
    
    createModal(`Завантаження ${osName}`, content, [
      { text: 'Скасувати', action: 'close', class: 'btn btn-secondary' },
      { text: 'Завантажити', action: function() {
        alert(`Це демонстраційний сайт. В реальній версії тут було б завантаження ${osName}.`);
      }, class: 'btn btn-primary' }
    ]);
  }
  
  function showTrialModal(osName) {
    let trialPeriod = "30 днів";
    
    if (osName.includes("Windows Server")) {
      trialPeriod = "180 днів";
    }
    
    const content = `
      <p>Ви збираєтесь завантажити пробну версію ${osName}.</p>
      <p>Період пробної версії: <strong>${trialPeriod}</strong></p>
      <p>Після завершення пробного періоду вам потрібно буде придбати ліцензію для продовження використання.</p>
      <div class="form-group mt-md">
        <label for="trial-email">Електронна пошта для отримання інструкцій:</label>
        <input type="email" id="trial-email" placeholder="your@email.com">
      </div>
    `;
    
    createModal(`Пробна версія ${osName}`, content, [
      { text: 'Скасувати', action: 'close', class: 'btn btn-secondary' },
      { text: 'Завантажити', action: function() {
        alert(`Це демонстраційний сайт. В реальній версії тут було б завантаження пробної версії ${osName}.`);
      }, class: 'btn btn-primary' }
    ]);
  }
  
  function showInfoModal(osName) {
    let infoContent = "Детальна інформація недоступна.";
    
    if (osName.includes("macOS")) {
      infoContent = `
        <h4>Про macOS Ventura</h4>
        <p>macOS Ventura - це операційна система від Apple для комп'ютерів Mac. Вона пропонує інноваційні функції, які допомагають користувачам бути більш продуктивними.</p>
        <h4>Ключові особливості:</h4>
        <ul>
          <li>Stage Manager для організації вікон</li>
          <li>Continuity Camera для використання iPhone як веб-камери</li>
          <li>Оновлений Mail та Safari</li>
          <li>Розширені можливості для спільної роботи</li>
        </ul>
        <p>Для встановлення macOS Ventura потрібен сумісний Mac. Оновлення безкоштовне для всіх власників сумісних комп'ютерів.</p>
      `;
    } else if (osName.includes("Ubuntu")) {
      infoContent = `
        <h4>Про Ubuntu 22.04 LTS</h4>
        <p>Ubuntu 22.04 LTS (Jammy Jellyfish) - це версія Ubuntu з довгостроковою підтримкою, яка отримуватиме оновлення до 2027 року.</p>
        <h4>Ключові особливості:</h4>
        <ul>
          <li>Робочий стіл GNOME 42</li>
          <li>Ядро Linux 5.15</li>
          <li>Підтримка новітнього обладнання</li>
          <li>Покращена продуктивність та безпека</li>
          <li>Повна підтримка Wayland</li>
        </ul>
        <p>Ubuntu - це безкоштовна операційна система з відкритим кодом, яка підтримується спільнотою та компанією Canonical.</p>
      `;
    }
    
    createModal(`Інформація про ${osName}`, infoContent, [
      { text: 'Закрити', action: 'close', class: 'btn btn-primary' }
    ]);
  }
  
  // Handle URL hash for direct OS navigation
  function handleOsHash() {
    const hash = window.location.hash;
    if (hash) {
      const targetOs = document.querySelector(hash);
      if (targetOs) {
        // Expand the target OS if it's hidden
        const category = targetOs.getAttribute('data-category')?.split(' ')[0] || 'all';
        
        // Find and click the appropriate tab button
        const tabButton = document.querySelector(`.tab-btn[data-category="${category}"]`);
        if (tabButton && !tabButton.classList.contains('active')) {
          tabButton.click();
        }
        
        // Scroll to the OS item
        setTimeout(() => {
          targetOs.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
        
        // Highlight the OS item
        targetOs.classList.add('highlighted');
        
        const style = document.createElement('style');
        style.textContent = `
          .os-item.highlighted {
            box-shadow: 0 0 0 3px var(--color-primary);
          }
        `;
        document.head.appendChild(style);
      }
    }
  }
  
  // Check for hash on page load
  handleOsHash();
  
  // Check for hash changes
  window.addEventListener('hashchange', handleOsHash);
});