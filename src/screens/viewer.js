/* ============================================
   TELA 3: VISUALIZADOR DE SERVIÇO (IFRAME)
   ============================================ */

/**
 * Inicializa a tela do visualizador de serviço com iframe controlado.
 * Inclui: header fixo, loading state, fallback com QR Code para celular,
 * modal de QR Code, recarregamento e limpeza de sessão.
 * @param {Function} navigateTo - Função de navegação entre telas
 */
export function initViewer(navigateTo) {
  const screen = document.getElementById('screen-viewer');

  // ── Renderizar estrutura ───
  screen.innerHTML = `
    <header class="viewer__header">
      <div class="viewer__header-left">
        <img
          class="viewer__logo"
          src="/assets/logos/logo1.svg"
          alt="Naturgy"
          draggable="false"
        >
        <div class="viewer__divider"></div>
        <h2 class="viewer__title" id="viewer-title">Carregando...</h2>
      </div>
      <div class="viewer__header-actions">
        <button class="viewer__btn viewer__btn--qr" id="viewer-qr-btn" aria-label="Abrir no celular via QR Code" title="Acessar no celular">
          📱 Levar no Celular
        </button>
        <button class="viewer__btn viewer__btn--reload" id="viewer-reload" aria-label="Recarregar página" title="Recarregar">
          ↻ Recarregar
        </button>
        <button class="viewer__btn viewer__btn--back" id="viewer-back" aria-label="Voltar ao menu">
          ← Voltar ao Menu
        </button>
      </div>
    </header>

    <div class="viewer__iframe-container">
      <div class="viewer__iframe-wrapper" id="viewer-iframe-wrapper">
        <div class="viewer__loading" id="viewer-loading">
          <div class="viewer__spinner"></div>
          <p class="viewer__loading-text">Carregando serviço...</p>
        </div>

        <div class="viewer__error" id="viewer-error">
          <div class="viewer__error-icon">🛡️</div>
          <h3 class="viewer__error-title">Acesso Seguro Naturgy</h3>
          <p class="viewer__error-message" id="viewer-error-message">
            Caso o portal não carregue dentro do navegador, utilize o QR Code abaixo para acessar direto no seu celular:
          </p>
          <div class="viewer__error-qr-card">
            <img class="viewer__qr-image" id="viewer-error-qr" alt="QR Code do serviço" />
            <p class="viewer__qr-instruction">Aponte a câmera do smartphone</p>
          </div>
          <div class="viewer__error-actions">
            <a class="viewer__btn viewer__btn--external" id="viewer-external-link" target="_blank" rel="noopener noreferrer">
              ↗ Abrir em Nova Aba
            </a>
            <button class="viewer__btn viewer__btn--retry" id="viewer-retry">
              ↻ Tentar Novamente
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de QR Code para leitura no celular -->
    <div class="viewer__modal-overlay" id="viewer-qr-modal">
      <div class="viewer__modal-content">
        <button class="viewer__modal-close" id="viewer-qr-modal-close" aria-label="Fechar modal">✕</button>
        <div class="viewer__modal-header">
          <span class="viewer__modal-icon">📱</span>
          <h3 class="viewer__modal-title">Acesse no seu Celular</h3>
        </div>
        <p class="viewer__modal-subtitle" id="viewer-qr-service-name">Minha Naturgy</p>
        <div class="viewer__modal-qr-box">
          <img class="viewer__modal-qr-image" id="viewer-modal-qr-img" alt="QR Code" />
        </div>
        <p class="viewer__modal-desc">Escaneie o código com a câmera do seu smartphone para continuar a navegação de onde você estiver.</p>
        <button class="viewer__btn viewer__btn--modal-done" id="viewer-qr-modal-done">Concluído</button>
      </div>
    </div>
  `;

  // ── Estado interno ───
  let currentUrl = '';
  let currentTitle = '';
  let currentIframe = null;
  let loadTimeout = null;
  let retryCount = 0;
  const MAX_RETRIES = 2;
  const LOAD_TIMEOUT_MS = 8000;

  // ── Referências DOM ───
  const titleEl = document.getElementById('viewer-title');
  const loadingEl = document.getElementById('viewer-loading');
  const errorEl = document.getElementById('viewer-error');
  const errorMsgEl = document.getElementById('viewer-error-message');
  const iframeWrapper = document.getElementById('viewer-iframe-wrapper');
  const errorQrEl = document.getElementById('viewer-error-qr');
  const externalLinkEl = document.getElementById('viewer-external-link');

  // Modal QR
  const qrModal = document.getElementById('viewer-qr-modal');
  const qrModalBtn = document.getElementById('viewer-qr-btn');
  const qrModalClose = document.getElementById('viewer-qr-modal-close');
  const qrModalDone = document.getElementById('viewer-qr-modal-done');
  const qrModalImg = document.getElementById('viewer-modal-qr-img');
  const qrModalServiceName = document.getElementById('viewer-qr-service-name');

  /**
   * Gera a URL do QR Code via API de alta velocidade
   */
  function getQrCodeUrl(url) {
    return `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=12&color=005c97&data=${encodeURIComponent(url)}`;
  }

  /**
   * Carrega um serviço no iframe.
   */
  function loadService(url, title) {
    currentUrl = url;
    currentTitle = title;
    titleEl.textContent = title;

    // Atualizar links de contingência e QR codes
    const qrUrl = getQrCodeUrl(url);
    if (errorQrEl) errorQrEl.src = qrUrl;
    if (externalLinkEl) externalLinkEl.href = url;
    if (qrModalImg) qrModalImg.src = qrUrl;
    if (qrModalServiceName) qrModalServiceName.textContent = title;

    // Mostrar loading, esconder erro
    loadingEl.classList.remove('hidden');
    errorEl.classList.remove('active');

    // Destruir iframe anterior (limpeza de sessão)
    destroyIframe();

    // Criar novo iframe
    currentIframe = document.createElement('iframe');
    currentIframe.className = 'viewer__iframe';
    currentIframe.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
    currentIframe.setAttribute('allow', 'clipboard-write; autoplay; fullscreen');
    currentIframe.src = url;

    // ── Evento de carregamento ───
    currentIframe.addEventListener('load', () => {
      clearTimeout(loadTimeout);
      loadingEl.classList.add('hidden');
      retryCount = 0;
    });

    // ── Evento de erro ───
    currentIframe.addEventListener('error', () => {
      clearTimeout(loadTimeout);
      handleLoadError();
    });

    // ── Timeout de carregamento ───
    loadTimeout = setTimeout(() => {
      loadingEl.classList.add('hidden');
    }, LOAD_TIMEOUT_MS);

    iframeWrapper.appendChild(currentIframe);
  }

  /**
   * Trata erros de carregamento do iframe.
   */
  function handleLoadError() {
    loadingEl.classList.add('hidden');

    if (retryCount < MAX_RETRIES) {
      retryCount++;
      console.log(`[Viewer] Tentativa ${retryCount}/${MAX_RETRIES}...`);
      setTimeout(() => {
        loadService(currentUrl, currentTitle);
      }, 1200);
    } else {
      showError('O portal Minha Naturgy possui políticas de segurança que exigem o modo Totem Quiosque ou acesso direto via celular.');
    }
  }

  /**
   * Exibe mensagem de erro e fallback de QR Code.
   */
  function showError(message) {
    loadingEl.classList.add('hidden');
    if (errorMsgEl) errorMsgEl.textContent = message;
    errorEl.classList.add('active');
  }

  /**
   * Destrói o iframe atual — limpeza completa de sessão.
   */
  function destroyIframe() {
    clearTimeout(loadTimeout);
    if (currentIframe) {
      currentIframe.src = 'about:blank';
      currentIframe.remove();
      currentIframe = null;
    }
  }

  /**
   * Limpeza completa ao sair da tela.
   */
  function cleanup() {
    destroyIframe();
    currentUrl = '';
    currentTitle = '';
    retryCount = 0;
    titleEl.textContent = '';
    loadingEl.classList.remove('hidden');
    errorEl.classList.remove('active');
    if (qrModal) qrModal.classList.remove('active');
  }

  // ── Event Listeners ───

  // Botão Voltar
  document.getElementById('viewer-back').addEventListener('click', () => {
    cleanup();
    navigateTo('menu');
  });

  // Botão Recarregar
  document.getElementById('viewer-reload').addEventListener('click', () => {
    if (currentUrl) {
      retryCount = 0;
      loadService(currentUrl, currentTitle);
    }
  });

  // Botão Tentar Novamente (no fallback de erro)
  document.getElementById('viewer-retry').addEventListener('click', () => {
    if (currentUrl) {
      retryCount = 0;
      loadService(currentUrl, currentTitle);
    }
  });

  // Modal QR Code
  qrModalBtn.addEventListener('click', () => {
    qrModal.classList.add('active');
  });

  qrModalClose.addEventListener('click', () => {
    qrModal.classList.remove('active');
  });

  qrModalDone.addEventListener('click', () => {
    qrModal.classList.remove('active');
  });

  qrModal.addEventListener('click', (e) => {
    if (e.target === qrModal) {
      qrModal.classList.remove('active');
    }
  });

  // ── Eventos customizados ───
  window.addEventListener('viewer:load', (e) => {
    const { url, title } = e.detail;
    retryCount = 0;
    loadService(url, title);
  });

  window.addEventListener('viewer:cleanup', () => {
    cleanup();
  });

  console.log('[Viewer] Inicializado com suporte a Kiosk e QR Code');
}

