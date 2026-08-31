/* ============================================
   BLINDAGEM DE SEGURANÇA — MODO QUIOSQUE
   ============================================ */

/**
 * Inicializa todas as proteções de segurança para o modo quiosque.
 * Bloqueia: menu de contexto, atalhos de teclado, drag & drop, seleção.
 */
export function initSecurity() {
  // ── Desabilitar menu de contexto (clique direito / toque longo) ───
  window.addEventListener('contextmenu', (e) => e.preventDefault());

  // ── Bloquear teclas de atalho do sistema ───
  window.addEventListener('keydown', (e) => {
    const blockedKeys = ['F5', 'F11', 'F12'];

    if (
      blockedKeys.includes(e.key) ||
      // Ctrl + tecla
      (e.ctrlKey && ['r', 'u', 'p', 's', 'w', 'j', 'l', 'g', 'f'].includes(e.key.toLowerCase())) ||
      // Ctrl + Shift + tecla (DevTools)
      (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(e.key.toLowerCase())) ||
      // Alt + tecla
      (e.altKey && ['F4', 'Tab'].includes(e.key))
    ) {
      e.preventDefault();
      e.stopPropagation();
    }
  });

  // ── Prevenir drag & drop ───
  window.addEventListener('dragstart', (e) => e.preventDefault());
  window.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
  });
  window.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
  });

  // ── Prevenir seleção de texto por duplo toque ───
  let lastTouchTime = 0;
  window.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTouchTime < 300) {
      e.preventDefault();
    }
    lastTouchTime = now;
  }, { passive: false });

  console.log('[Kiosk Security] Blindagem inicializada');
}
