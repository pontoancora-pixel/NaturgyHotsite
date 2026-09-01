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
        url: service.url,
        title: service.title,
      });
    }

    card.addEventListener('click', handleCardClick);
    card.addEventListener('touchstart', (e) => {
      // Apenas feedback visual no touchstart, navegação no click
    }, { passive: true });
  });

  console.log(`[Menu] Inicializado — ${services.length} serviços carregados`);
}
