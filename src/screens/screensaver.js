/* ============================================
   TELA 1: SCREENSAVER (DESCANSO)
   ============================================ */

/**
 * Inicializa a tela de screensaver com vídeo de chama em loop.
 * Qualquer toque transiciona para o menu.
 * @param {Function} navigateTo - Função de navegação entre telas
 */
export function initScreensaver(navigateTo) {
  const screen = document.getElementById('screen-screensaver');

  // ── Renderizar conteúdo ───
  screen.innerHTML = `
    <video
      class="screensaver__video"
      autoplay muted loop playsinline
      preload="auto"
      aria-hidden="true"
    >
      <source src="/assets/videos/screensaver.mp4" type="video/mp4">
    </video>

    <img
      class="screensaver__logo"
      src="/assets/logos/logo1.svg"
      alt="Naturgy"
      draggable="false"
    >

    <div class="screensaver__cta">
      <p class="screensaver__cta-text">Toque para começar</p>
    </div>

    <div class="screensaver__glow" aria-hidden="true"></div>
  `;

  // ── Referência ao vídeo ───
  const video = screen.querySelector('.screensaver__video');

  // Garantir que o vídeo reinicia corretamente em loops longos (8h+)
  video.addEventListener('ended', () => {
    video.currentTime = 0;
    video.play().catch(() => {});
  });

  // ── Handler de toque — qualquer toque vai para o menu ───
  function handleTouch(e) {
    // Prevenir duplo-toque acidental
    e.preventDefault();
    navigateTo('menu');
  }

  screen.addEventListener('click', handleTouch);
  screen.addEventListener('touchstart', handleTouch, { passive: false });

  // ── Garantir que o vídeo está sempre rodando ───
  // Observa quando a tela fica ativa e reinicia o vídeo se necessário
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === 'class') {
        if (screen.classList.contains('active')) {
          video.play().catch(() => {});
        }
      }
    });
  });

  observer.observe(screen, { attributes: true });

  console.log('[Screensaver] Inicializado');
}
