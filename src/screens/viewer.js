/* ============================================
   TELA 3: VISUALIZADOR DE SERVIÇO (IFRAME)
   ============================================ */

/**
 * Inicializa a tela do visualizador de serviço com iframe controlado.
 * Inclui: header fixo, loading state, fallback de erro, proxy para bypass de X-Frame-Options.
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
        <button class="viewer__btn viewer__btn--reload" id="viewer-reload" aria-label="Recarregar página">
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
          <div class="viewer__error-icon">⚠️</div>
          <h3 class="viewer__error-title">Não foi possível carregar</h3>
          <p class="viewer__error-message" id="viewer-error-message">
            Ocorreu um erro ao carregar a página.
          </p>
          <button class="viewer__btn viewer__error-retry" id="viewer-retry">
            ↻ Tentar novamente
          </button>
        </div>
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
  const LOAD_TIMEOUT_MS = 12000;

  // ── Referências DOM ───
  const titleEl = document.getElementById('viewer-title');
  const loadingEl = document.getElementById('viewer-loading');
  const errorEl = document.getElementById('viewer-error');
  const errorMsgEl = document.getElementById('viewer-error-message');
  const iframeWrapper = document.getElementById('viewer-iframe-wrapper');

  /**
   * Determina a URL a ser usada no iframe.
   * Em produção (Vercel), usa o proxy para contornar X-Frame-Options.
   * Em desenvolvimento local, tenta carregamento direto.
   */
  function getIframeUrl(originalUrl) {
    const isLocalhost = window.location.hostname === 'localhost' ||
                        window.location.hostname === '127.0.0.1';

    // Em produção, usar proxy; em localhost, tentar direto
    if (!isLocalhost) {
      return `/api/proxy?url=${encodeURIComponent(originalUrl)}`;
    }
    return originalUrl;
  }

  /**
   * Carrega um serviço no iframe.
   */
  function loadService(url, title) {
    currentUrl = url;
    currentTitle = title;
    titleEl.textContent = title;

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

    const iframeUrl = getIframeUrl(url);
    currentIframe.src = iframeUrl;

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

    // ── Timeout: se não carregar em X segundos ───
    loadTimeout = setTimeout(() => {
      // Esconder loading mas não mostrar erro (pode ser lentidão normal)
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
      // Retry automático após breve delay
      setTimeout(() => {
        loadService(currentUrl, currentTitle);
      }, 1500);
    } else {
      showError('A página não pôde ser carregada. Verifique a conexão e tente novamente.');
    }
  }

  /**
   * Exibe mensagem de erro.
   */
  function showError(message) {
    loadingEl.classList.add('hidden');
    errorMsgEl.textContent = message;
    errorEl.classList.add('active');
  }

  /**
   * Destrói o iframe atual — limpeza completa de sessão.
   * Remove o nó do DOM para expurgar dados em memória (CPF, e-mail, etc).
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

  // ── Eventos customizados ───

  // Recebe dados do serviço selecionado
  window.addEventListener('viewer:load', (e) => {
    const { url, title } = e.detail;
    retryCount = 0;
    loadService(url, title);
  });

  // Limpeza quando sai da tela (inatividade ou navegação)
  window.addEventListener('viewer:cleanup', () => {
    cleanup();
  });

  console.log('[Viewer] Inicializado');
}
