// Compare page specific JavaScript
document.addEventListener('DOMContentLoaded', function() {
  const specsForm = document.getElementById('specs-form');
  const compareBtn = document.getElementById('compare-btn');
  const autoDetectBtn = document.getElementById('auto-detect');
  const resultsContainer = document.querySelector('.results-container');
  
  // CPU Database for comparison
  const cpuDatabase = {
    'intel': {
      'i3': { score: 50, generation: { '10': 55, '11': 60, '12': 65, '13': 70 }},
      'i5': { score: 70, generation: { '10': 75, '11': 80, '12': 85, '13': 90 }},
      'i7': { score: 85, generation: { '10': 87, '11': 90, '12': 92, '13': 95 }},
      'i9': { score: 95, generation: { '10': 96, '11': 97, '12': 98, '13': 100 }},
      'pentium': { score: 30 },
      'celeron': { score: 25 }
    },
    'amd': {
      'ryzen3': { score: 50, generation: { '3': 55, '4': 60, '5': 65, '7': 70 }},
      'ryzen5': { score: 70, generation: { '3': 75, '4': 80, '5': 85, '7': 90 }},
      'ryzen7': { score: 85, generation: { '3': 87, '4': 90, '5': 92, '7': 95 }},
      'ryzen9': { score: 95, generation: { '3': 96, '4': 97, '5': 98, '7': 100 }},
      'athlon': { score: 35 }
    }
  };

  // GPU Database for comparison
  const gpuDatabase = {
    'nvidia': {
      // Modern GPUs
      'rtx4090': 100, 'rtx4080': 97, 'rtx4070ti': 95, 'rtx4070': 93, 'rtx4060ti': 90, 'rtx4060': 88,
      'rtx3090': 96, 'rtx3080ti': 95, 'rtx3080': 93, 'rtx3070ti': 90, 'rtx3070': 88, 'rtx3060ti': 85, 'rtx3060': 83,
      'rtx2080ti': 92, 'rtx2080super': 90, 'rtx2080': 88, 'rtx2070super': 85, 'rtx2070': 83, 'rtx2060super': 80, 'rtx2060': 78,
      // GTX Series
      'gtx1660ti': 75, 'gtx1660super': 73, 'gtx1660': 70, 'gtx1650super': 65, 'gtx1650': 60,
      'gtx1080ti': 87, 'gtx1080': 85, 'gtx1070ti': 82, 'gtx1070': 80, 'gtx1060': 70,
      // Legacy
      'gtx980ti': 75, 'gtx980': 70, 'gtx970': 65, 'gtx960': 55, 'gtx950': 50
    },
    'amd': {
      // Modern RDNA 3
      'rx7900xtx': 98, 'rx7900xt': 95, 'rx7800xt': 93, 'rx7700xt': 90, 'rx7600': 85,
      // RDNA 2
      'rx6950xt': 96, 'rx6900xt': 95, 'rx6800xt': 93, 'rx6800': 90,
      'rx6750xt': 88, 'rx6700xt': 85, 'rx6650xt': 82, 'rx6600xt': 80, 'rx6600': 78,
      'rx6500xt': 70, 'rx6400': 60,
      // RDNA 1
      'rx5700xt': 85, 'rx5700': 82, 'rx5600xt': 78, 'rx5500xt': 70,
      // Legacy
      'rx590': 70, 'rx580': 65, 'rx570': 60, 'rx560': 50, 'rx550': 45
    },
    'intel': {
      'arc770': 85, 'arc750': 80, 'arc580': 70, 'arc380': 55,
      'uhd770': 30, 'uhd750': 28, 'uhd730': 25, 'uhd710': 20
    }
  };

  // OS Requirements with detailed specs
  const osRequirements = {
    // Windows Versions
    'windows11': {
      cpu: { min: 1, recommended: 2 },
      ram: { min: 4, recommended: 8 },
      storage: { min: 64, recommended: 128 },
      gpu: { min: 60, recommended: 80 },
      features: ['TPM 2.0', 'DirectX 12', 'UEFI, Secure Boot']
    },
    'windows10': {
      cpu: { min: 1, recommended: 2 },
      ram: { min: 2, recommended: 4 },
      storage: { min: 32, recommended: 64 },
      gpu: { min: 40, recommended: 60 },
      features: ['DirectX 9']
    },
    'windows7': {
      cpu: { min: 1, recommended: 2 },
      ram: { min: 1, recommended: 2 },
      storage: { min: 16, recommended: 32 },
      gpu: { min: 20, recommended: 40 },
      features: ['DirectX 9']
    },

    // macOS Versions
    'macosventura': {
      cpu: { min: 1.4, recommended: 2.4 },
      ram: { min: 8, recommended: 16 },
      storage: { min: 25, recommended: 50 },
      gpu: { min: 70, recommended: 85 },
      features: ['Apple Silicon / Intel (2017+)', 'Metal GPU']
    },
    'macosmonterey': {
      cpu: { min: 1.4, recommended: 2.0 },
      ram: { min: 4, recommended: 8 },
      storage: { min: 20, recommended: 40 },
      gpu: { min: 60, recommended: 75 },
      features: ['Intel (2015+)', 'Metal GPU']
    },

    // Linux Distributions - Ubuntu Family
    'ubuntu': {
      cpu: { min: 2, recommended: 2.4 },
      ram: { min: 4, recommended: 8 },
      storage: { min: 25, recommended: 50 },
      gpu: { min: 40, recommended: 60 },
      features: ['OpenGL 3.3+']
    },
    'kubuntu': {
      cpu: { min: 2, recommended: 2.4 },
      ram: { min: 4, recommended: 8 },
      storage: { min: 25, recommended: 50 },
      gpu: { min: 45, recommended: 65 },
      features: ['OpenGL 3.3+']
    },
    'xubuntu': {
      cpu: { min: 1, recommended: 2 },
      ram: { min: 2, recommended: 4 },
      storage: { min: 20, recommended: 40 },
      gpu: { min: 30, recommended: 50 },
      features: ['Basic GPU Support']
    },

    // Other Popular Linux Distributions
    'fedora': {
      cpu: { min: 2, recommended: 2.4 },
      ram: { min: 4, recommended: 8 },
      storage: { min: 20, recommended: 40 },
      gpu: { min: 40, recommended: 60 },
      features: ['OpenGL 3.3+']
    },
    'popos': {
      cpu: { min: 2, recommended: 2.4 },
      ram: { min: 4, recommended: 8 },
      storage: { min: 20, recommended: 40 },
      gpu: { min: 45, recommended: 65 },
      features: ['NVIDIA Support']
    },
    'manjaro': {
      cpu: { min: 2, recommended: 2.4 },
      ram: { min: 4, recommended: 8 },
      storage: { min: 30, recommended: 50 },
      gpu: { min: 40, recommended: 60 },
      features: ['OpenGL 3.3+']
    },
    'mint': {
      cpu: { min: 1, recommended: 2 },
      ram: { min: 2, recommended: 4 },
      storage: { min: 20, recommended: 40 },
      gpu: { min: 30, recommended: 50 },
      features: ['Basic GPU Support']
    },
    'elementary': {
      cpu: { min: 2, recommended: 2.4 },
      ram: { min: 4, recommended: 8 },
      storage: { min: 20, recommended: 40 },
      gpu: { min: 45, recommended: 65 },
      features: ['OpenGL 3.3+']
    },
    'zorin': {
      cpu: { min: 1, recommended: 2 },
      ram: { min: 2, recommended: 4 },
      storage: { min: 20, recommended: 40 },
      gpu: { min: 35, recommended: 55 },
      features: ['Basic GPU Support']
    },
    'arch': {
      cpu: { min: 2, recommended: 2.4 },
      ram: { min: 2, recommended: 4 },
      storage: { min: 20, recommended: 40 },
      gpu: { min: 30, recommended: 50 },
      features: ['Basic GPU Support']
    }
  };

  function calculateCpuScore(cpuModel) {
    const cpuInfo = cpuModel.toLowerCase();
    let score = 50; // Default score

    // Check Intel
    if (cpuInfo.includes('intel')) {
      for (const [series, data] of Object.entries(cpuDatabase.intel)) {
        if (cpuInfo.includes(series)) {
          score = data.score;
          // Check generation
          if (data.generation) {
            for (const [gen, genScore] of Object.entries(data.generation)) {
              if (cpuInfo.includes(gen)) {
                score = genScore;
                break;
              }
            }
          }
          break;
        }
      }
    }
    // Check AMD
    else if (cpuInfo.includes('amd') || cpuInfo.includes('ryzen')) {
      for (const [series, data] of Object.entries(cpuDatabase.amd)) {
        if (cpuInfo.includes(series.toLowerCase())) {
          score = data.score;
          // Check generation
          if (data.generation) {
            for (const [gen, genScore] of Object.entries(data.generation)) {
              if (cpuInfo.includes(gen)) {
                score = genScore;
                break;
              }
            }
          }
          break;
        }
      }
    }

    return score;
  }

  function calculateGpuScore(gpuModel) {
    const gpuInfo = gpuModel.toLowerCase();
    let score = 40; // Default score

    // Check each manufacturer
    for (const [brand, models] of Object.entries(gpuDatabase)) {
      if (gpuInfo.includes(brand) || 
          (brand === 'nvidia' && (gpuInfo.includes('gtx') || gpuInfo.includes('rtx'))) ||
          (brand === 'amd' && (gpuInfo.includes('radeon') || gpuInfo.includes('rx')))) {
        for (const [model, modelScore] of Object.entries(models)) {
          if (gpuInfo.includes(model.toLowerCase())) {
            score = modelScore;
            break;
          }
        }
      }
    }

    return score;
  }

  function calculateCompatibilityScore(os, specs) {
    const requirements = osRequirements[os];
    let score = 0;
    let details = {};

    // CPU Score
    const cpuScore = calculateCpuScore(specs.cpu);
    const cpuSpeedScore = (specs.cpuSpeed >= requirements.cpu.recommended) ? 100 :
                         (specs.cpuSpeed >= requirements.cpu.min) ? 70 : 40;
    details.cpu = Math.round((cpuScore + cpuSpeedScore) / 2);

    // RAM Score
    details.ram = (specs.ram >= requirements.ram.recommended) ? 100 :
                 (specs.ram >= requirements.ram.min) ? Math.round((specs.ram / requirements.ram.recommended) * 100) : 40;

    // Storage Score
    details.storage = (specs.storage >= requirements.storage.recommended) ? 100 :
                     (specs.storage >= requirements.storage.min) ? Math.round((specs.storage / requirements.storage.recommended) * 100) : 40;

    // GPU Score
    const gpuScore = calculateGpuScore(specs.gpu);
    details.gpu = (gpuScore >= requirements.gpu.recommended) ? 100 :
                 (gpuScore >= requirements.gpu.min) ? Math.round((gpuScore / requirements.gpu.recommended) * 100) : 40;

    // Calculate final score
    score = Math.round((details.cpu + details.ram + details.storage + details.gpu) / 4);

    // OS-specific adjustments
    if (os.includes('macos') && !specs.cpu.toLowerCase().includes('apple')) {
      score *= 0.5; // Heavy penalty for non-Apple hardware
    }

    return { total: score, details: details };
  }

  // Handle form submission
  if (specsForm) {
    specsForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const specs = {
        cpu: document.getElementById('cpu').value,
        cpuSpeed: parseFloat(document.getElementById('cpu-speed').value) || 0,
        ram: parseFloat(document.getElementById('ram').value) || 0,
        storage: parseFloat(document.getElementById('storage').value) || 0,
        gpu: document.getElementById('gpu').value,
        gpuMemory: parseFloat(document.getElementById('gpu-memory').value) || 0
      };

      // Calculate scores for all OS versions
      const allScores = [
        { name: 'Windows 11', score: calculateCompatibilityScore('windows11', specs) },
        { name: 'Windows 10', score: calculateCompatibilityScore('windows10', specs) },
        { name: 'Windows 7', score: calculateCompatibilityScore('windows7', specs) },
        { name: 'macOS Ventura', score: calculateCompatibilityScore('macosventura', specs) },
        { name: 'macOS Monterey', score: calculateCompatibilityScore('macosmonterey', specs) },
        { name: 'Ubuntu', score: calculateCompatibilityScore('ubuntu', specs) },
        { name: 'Kubuntu', score: calculateCompatibilityScore('kubuntu', specs) },
        { name: 'Xubuntu', score: calculateCompatibilityScore('xubuntu', specs) },
        { name: 'Fedora', score: calculateCompatibilityScore('fedora', specs) },
        { name: 'Pop!_OS', score: calculateCompatibilityScore('popos', specs) },
        { name: 'Manjaro', score: calculateCompatibilityScore('manjaro', specs) },
        { name: 'Linux Mint', score: calculateCompatibilityScore('mint', specs) },
        { name: 'Elementary OS', score: calculateCompatibilityScore('elementary', specs) },
        { name: 'Zorin OS', score: calculateCompatibilityScore('zorin', specs) },
        { name: 'Arch Linux', score: calculateCompatibilityScore('arch', specs) }
      ];

      displayDetailedResults(allScores, specs);
    });
  }

  function displayDetailedResults(allScores, specs) {
    const resultsContainer = document.querySelector('.results-container');
    const compatibilityList = document.querySelector('.os-compatibility-list');
    
    if (!compatibilityList) return;

    compatibilityList.innerHTML = '';
    
    // Sort by compatibility score
    allScores.sort((a, b) => b.score.total - a.score.total);

    allScores.forEach(result => {
      const osSection = document.createElement('div');
      osSection.className = 'os-compatibility-section';
      
      const details = result.score.details;
      
      osSection.innerHTML = `
        <h4>${result.name}</h4>
        <div class="overall-score">
          <div class="score-label">Загальна сумісність:</div>
          <div class="score-bar">
            <div class="score-progress" style="width: ${result.score.total}%"></div>
          </div>
          <div class="score-value">${result.score.total}%</div>
        </div>
        <div class="spec-details">
          <div class="spec-row">
            <div class="spec-label">Процесор</div>
            <div class="spec-value">
              <div class="spec-progress">
                <div class="spec-progress-bar" style="width: ${details.cpu}%"></div>
              </div>
              <div class="spec-percentage">${details.cpu}%</div>
            </div>
          </div>
          <div class="spec-row">
            <div class="spec-label">Оперативна пам'ять</div>
            <div class="spec-value">
              <div class="spec-progress">
                <div class="spec-progress-bar" style="width: ${details.ram}%"></div>
              </div>
              <div class="spec-percentage">${details.ram}%</div>
            </div>
          </div>
          <div class="spec-row">
            <div class="spec-label">Сховище</div>
            <div class="spec-value">
              <div class="spec-progress">
                <div class="spec-progress-bar" style="width: ${details.storage}%"></div>
              </div>
              <div class="spec-percentage">${details.storage}%</div>
            </div>
          </div>
          <div class="spec-row">
            <div class="spec-label">Відеокарта</div>
            <div class="spec-value">
              <div class="spec-progress">
                <div class="spec-progress-bar" style="width: ${details.gpu}%"></div>
              </div>
              <div class="spec-percentage">${details.gpu}%</div>
            </div>
          </div>
        </div>
      `;
      
      compatibilityList.appendChild(osSection);
    });

    // Show results container
    resultsContainer.style.display = 'block';
    setTimeout(() => {
      resultsContainer.classList.add('active');
    }, 50);

    // Update recommendation
    const recommendedOs = allScores[0];
    const recommendedOsElement = document.querySelector('.recommended-os');
    if (recommendedOsElement) {
      recommendedOsElement.innerHTML = `
        <h5>${recommendedOs.name}</h5>
        <p>Оцінка сумісності: ${recommendedOs.score.total}%</p>
        <p class="recommendation-reason">
          ${getRecommendationReason(recommendedOs.name, recommendedOs.score.total)}
        </p>
      `;
    }
  }

  function getRecommendationReason(osName, score) {
    if (score < 50) {
      return 'Ваш комп\'ютер не повністю відповідає вимогам. Рекомендується оновлення обладнання.';
    }
    
    switch (osName) {
      case 'Windows 11':
        return 'Найкраща сумісність з вашим обладнанням та широкі можливості для роботи і розваг.';
      case 'Windows 10':
        return 'Стабільна та перевірена система з хорошою підтримкою обладнання.';
      case 'Windows 7':
        return 'Базова сумісність, але рекомендується оновлення до новішої версії Windows.';
      case 'macOS Ventura':
        return 'Ваше обладнання добре підходить для macOS. Відмінний вибір для творчої роботи.';
      case 'macOS Monterey':
        return 'Хороша сумісність з macOS. Підходить для більшості завдань.';
      case 'Ubuntu':
        return 'Відмінна сумісність з Linux. Хороший вибір для розробки та повсякденного використання.';
      case 'Kubuntu':
        return 'Потужне робоче середовище KDE з хорошою підтримкою обладнання.';
      case 'Xubuntu':
        return 'Легка система з низькими вимогами до ресурсів.';
      case 'Pop!_OS':
        return 'Оптимізована для геймінгу та розробки з відмінною підтримкою NVIDIA.';
      case 'Fedora':
        return 'Сучасний дистрибутив з передовими технологіями та стабільною роботою.';
      case 'Manjaro':
        return 'Гнучка система з доступом до найновішого програмного забезпечення.';
      case 'Linux Mint':
        return 'Дружній до користувача дистрибутив з хорошою стабільністю.';
      case 'Elementary OS':
        return 'Елегантний та простий у використанні дистрибутив з фокусом на дизайн.';
      case 'Zorin OS':
        return 'Знайома для користувачів Windows система з хорошою сумісністю.';
      case 'Arch Linux':
        return 'Гнучка система для досвідчених користувачів з повним контролем над налаштуваннями.';
      default:
        return 'Хороша сумісність з вашим обладнанням.';
    }
  }

  // Auto-detect functionality
  if (autoDetectBtn) {
    autoDetectBtn.addEventListener('click', function() {
      // Simulate detection with realistic values
      document.getElementById('cpu').value = 'Intel Core i5-12400';
      document.getElementById('cpu-speed').value = '3.4';
      document.getElementById('ram').value = '16';
      document.getElementById('storage').value = '512';
      document.getElementById('gpu').value = 'NVIDIA RTX 3060';
      document.getElementById('gpu-memory').value = '12';
      
      animateDetection();
    });
  }

  function animateDetection() {
    const inputs = document.querySelectorAll('input');
    inputs.forEach((input, index) => {
      setTimeout(() => {
        input.style.backgroundColor = 'rgba(0, 102, 204, 0.1)';
        setTimeout(() => {
          input.style.backgroundColor = '';
        }, 500);
      }, index * 100);
    });
  }
});