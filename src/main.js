/* ============================================
   NATURGY KIOSK — ENTRY POINT
   ============================================ */

// ── Importar estilos ───
import './styles/global.css';
import './styles/screensaver.css';
import './styles/menu.css';
import './styles/viewer.css';

// ── Importar módulos ───
import { initScreensaver } from './screens/screensaver.js';
import { initMenu } from './screens/menu.js';
import { initViewer } from './screens/viewer.js';
import { initSecurity } from './utils/security.js';
import {
  initInactivity,
  resetInactivityTimer,
  pauseInactivity,
  resumeInactivity,
} from './utils/inactivity.js';

// ── Estado da aplicação ───
let currentScreen = 'screensaver';

/**
 * Navega entre as telas da aplicação com transição suave.
 * Gerencia: crossfade CSS, timer de inatividade, re-trigger de animações.
 *
 * @param {string} screenName - Nome da tela destino ('screensaver' | 'menu' | 'viewer')
 * @param {Object} data - Dados adicionais (ex: { url, title } para o viewer)
 */
function navigateTo(screenName, data = {}) {
  if (screenName === currentScreen) return;

  const previousScreen = currentScreen;
  currentScreen = screenName;

  // ── 1. Remover .active de todas as telas ───
  // Isso reseta animações CSS (cards do menu voltam ao estado inicial)
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));

  // ── 2. Forçar reflow para garantir reset de animações ───
  const targetScreen = document.getElementById(`screen-${screenName}`);
  void targetScreen.offsetWidth;

  // ── 3. Ativar tela de destino (dispara transição CSS + animações) ───
  requestAnimationFrame(() => {
    targetScreen.classList.add('active');
  });

  // ── 4. Gerenciar timer de inatividade ───
  if (screenName === 'screensaver') {
    pauseInactivity();
  } else {
    resumeInactivity();
    resetInactivityTimer();
  }

  // ── 5. Eventos específicos por tela ───

  // Carregar serviço no viewer
  if (screenName === 'viewer' && data.url && data.title) {
    window.dispatchEvent(new CustomEvent('viewer:load', { detail: data }));
  }

  // Limpeza ao sair do viewer (destruir iframe, limpar sessão)
  if (previousScreen === 'viewer' && screenName !== 'viewer') {
    window.dispatchEvent(new CustomEvent('viewer:cleanup'));
  }

  console.log(`[Navegação] ${previousScreen} → ${screenName}`);
}

// ── Inicialização ───
document.addEventListener('DOMContentLoaded', () => {
  // Segurança primeiro
  initSecurity();

  // Inicializar telas
  initScreensaver(navigateTo);
  initMenu(navigateTo);
  initViewer(navigateTo);

  // Inicializar watchdog de inatividade
  initInactivity(() => navigateTo('screensaver'));

  console.log('[Naturgy Kiosk] Aplicação inicializada ✓');
});
