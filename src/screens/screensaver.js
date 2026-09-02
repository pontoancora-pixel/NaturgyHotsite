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
    <!-- Vídeo de fundo em loop contínuo (chama acesa) -->
    <video
      class="screensaver__video screensaver__video--loop"
      muted loop playsinline
      preload="auto"
      aria-hidden="true"
    >
      <source src="/assets/videos/screensaver2.mp4" type="video/mp4">
    </video>

    <!-- Vídeo de introdução (boca acendendo) -->
    <video
      class="screensaver__video screensaver__video--intro"
      autoplay muted playsinline
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

  // ── Referências aos vídeos ───
  const videoIntro = screen.querySelector('.screensaver__video--intro');
  const videoLoop = screen.querySelector('.screensaver__video--loop');

  /**
   * Inicia a sequência: roda o vídeo de ignição (intro) primeiro
   * e deixa o vídeo de loop preparado.
   */
  function startScreensaverSequence() {
    videoIntro.classList.remove('is-hidden');
    videoIntro.currentTime = 0;

    videoLoop.pause();
    videoLoop.currentTime = 0;

    videoIntro.play().catch(() => {});
  }

  // ── Transição suave da intro para o loop ───
  videoIntro.addEventListener('ended', () => {
    videoLoop.currentTime = 0;
    videoLoop.play().then(() => {
      videoIntro.classList.add('is-hidden');
      // Pausa a intro em segundo plano para liberar memória/CPU
      setTimeout(() => {
        if (videoIntro.classList.contains('is-hidden')) {
          videoIntro.pause();
        }
      }, 300);
    }).catch(() => {
      videoIntro.classList.add('is-hidden');
    });
  });

  // Garantir que o loop reinicia com segurança em execuções longas (8h+)
  videoLoop.addEventListener('ended', () => {
    videoLoop.currentTime = 0;
    videoLoop.play().catch(() => {});
  });

  // Iniciar sequência na primeira carga
  startScreensaverSequence();

  // ── Handler de toque — qualquer toque vai para o menu ───
  function handleTouch(e) {
    // Prevenir duplo-toque acidental
    e.preventDefault();
    navigateTo('menu');
  }

  screen.addEventListener('click', handleTouch);
  screen.addEventListener('touchstart', handleTouch, { passive: false });

  // ── Observa quando a tela fica ativa/inativa ───
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === 'class') {
        if (screen.classList.contains('active')) {
          startScreensaverSequence();
        } else {
          // Pausar ambos os vídeos quando o usuário estiver no menu/viewer
          videoIntro.pause();
          videoLoop.pause();
        }
      }
    });
  });

  observer.observe(screen, { attributes: true });

  console.log('[Screensaver] Inicializado');
}
