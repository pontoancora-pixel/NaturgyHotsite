/* ============================================
   WATCHDOG DE INATIVIDADE
   ============================================ */

const INACTIVITY_TIMEOUT = 60 * 1000; // 60 segundos
const INTERACTION_EVENTS = ['touchstart', 'pointerdown', 'click', 'mousemove'];

let timeoutId = null;
let isPaused = true;
let resetCallback = null;

/**
 * Handler chamado a cada interação do usuário.
 * Reinicia o timer de inatividade.
 */
function onInteraction() {
  if (isPaused) return;
  resetTimer();
}

/**
 * Reinicia o timer de contagem regressiva.
 */
function resetTimer() {
  clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    if (!isPaused && resetCallback) {
      console.log('[Inatividade] Timeout atingido — resetando para screensaver');
      resetCallback();
    }
  }, INACTIVITY_TIMEOUT);
}

/**
 * Inicializa o watchdog de inatividade.
 * @param {Function} onReset - Callback executado quando o timeout é atingido
 */
export function initInactivity(onReset) {
  resetCallback = onReset;

  INTERACTION_EVENTS.forEach(event => {
    window.addEventListener(event, onInteraction, { passive: true });
  });

  console.log(`[Inatividade] Inicializado — timeout de ${INACTIVITY_TIMEOUT / 1000}s`);
}

/**
 * Reinicia o timer manualmente (chamado ao navegar entre telas).
 */
export function resetInactivityTimer() {
  if (!isPaused) {
    resetTimer();
  }
}

/**
 * Pausa o watchdog (usado na Tela 1 - Screensaver).
 */
export function pauseInactivity() {
  isPaused = true;
  clearTimeout(timeoutId);
}

/**
 * Retoma o watchdog (usado nas Telas 2 e 3).
 */
export function resumeInactivity() {
  isPaused = false;
  resetTimer();
}
