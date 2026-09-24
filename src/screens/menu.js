/* ============================================
   TELA 2: MENU PRINCIPAL (GRID DE SERVIÇOS)
   ============================================ */

import services from '../data/services.json';

/**
 * Inicializa a tela de menu com grid de cards de serviços.
 * Cada card redireciona para o viewer com a URL do serviço.
 * @param {Function} navigateTo - Função de navegação entre telas
 */
export function initMenu(navigateTo) {
  const screen = document.getElementById('screen-menu');

  // ── Gerar HTML dos cards ───
  const cardsHTML = services.map(service => `
    <div class="menu__card" data-service-id="${service.id}" role="button" tabindex="0" aria-label="${service.title}">
      <div class="menu__card-icon-wrapper">
        <img
          class="menu__card-icon"
          src="${service.icon}"
          alt=""
          draggable="false"
          loading="eager"
        >
      </div>
      <div class="menu__card-content">
        <h3 class="menu__card-title">${service.title}</h3>
        <p class="menu__card-description">${service.description}</p>
      </div>
    </div>
  `).join('');

  // ── Renderizar conteúdo ───
  screen.innerHTML = `
    <div class="menu__header-band">
      <img
        class="menu__logo"
        src="/assets/logos/logo2.svg"
        alt="Minha Naturgy"
        draggable="false"
      >
      <p class="menu__subtitle">Selecione um serviço</p>
    </div>

    <div class="menu__cards-area">
      <div class="menu__grid" role="list">
        ${cardsHTML}
      </div>

      <div class="menu__actions">
        <button
          id="menu-btn-close"
          class="menu__close-btn"
          aria-label="Fechar e reiniciar o site"
          title="Fechar e reiniciar o site"
        >
          <svg class="menu__close-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>
  `;

  // ── Handlers de clique nos cards ───
  screen.querySelectorAll('.menu__card').forEach(card => {
    const serviceId = card.dataset.serviceId;
    const service = services.find(s => s.id === serviceId);

    if (!service) return;

    function handleCardClick(e) {
      e.preventDefault();
      navigateTo('viewer', {
        url: service.url || '',
        qrCode: service.qrCode || '',
        staticImage: service.staticImage || '',
        title: service.title,
        description: service.description || '',
      });
    }

    card.addEventListener('click', handleCardClick);
    card.addEventListener('touchstart', (e) => {
      // Apenas feedback visual no touchstart, navegação no click
    }, { passive: true });
  });

  // ── Handler do botão fechar / reiniciar (volta à Tela 1 - Screensaver) ───
  const closeBtn = screen.querySelector('#menu-btn-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo('screensaver');
    });
  }

  console.log(`[Menu] Inicializado — ${services.length} serviços carregados`);
}
