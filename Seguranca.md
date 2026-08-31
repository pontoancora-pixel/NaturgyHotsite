```markdown
# ESPECIFICAÇÕES TÉCNICAS: BLINDAGEM, SEGURANÇA E UX PARA MODO QUIOSQUE

## 📌 1. Objetivo deste Documento
Definir e implementar regras de blindagem no front-end, contingências para carregamento de páginas externas e proteções contra mau uso para totens/TVs touchscreen verticais em ambiente de evento público.

---

## 🛡️ 2. Blindagem de Toque e Gestos Indesejados (CSS / UI)

Implementar regras estritas de CSS global para desativar qualquer comportamento padrão de navegador que possa expor a interface do sistema operacional:

```css
/* Bloqueio global de seleção de texto, arraste e zoom por gesto */
html, body {
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
  touch-action: pan-y; /* Permite scroll vertical sem disparar pinch-to-zoom */
  overscroll-behavior-y: none; /* Desativa pull-to-refresh e efeito elástico */
  position: fixed;
  width: 100%;
  height: 100%;
  overflow: hidden;
  margin: 0;
  padding: 0;
}

/* Impede o arraste de elementos de mídia */
img, video {
  pointer-events: none;
  -webkit-user-drag: none;
  user-drag: none;
}

```

---

## 🔒 3. Prevenção de Ações de Sistema e Teclado (JavaScript)

* **Menu de Contexto:** Desabilitar totalmente o evento de clique longo / botão direito em toda a aplicação:
```javascript
window.addEventListener('contextmenu', (e) => e.preventDefault());

```


* **Bloqueio de Teclas de Atalho:** Interceptar atalhos que possam revelar ferramentas de desenvolvedor, recarregar página ou fechar o modo quiosque:
```javascript
window.addEventListener('keydown', (e) => {
  const blockedKeys = ['F5', 'F11', 'F12'];
  if (
    blockedKeys.includes(e.key) ||
    (e.ctrlKey && ['r', 'u', 'p', 's', 'w', 'j', 'shift'].includes(e.key.toLowerCase()))
  ) {
    e.preventDefault();
  }
});

```



---

## 🌐 4. Contingência de Iframe e Restrições de Segurança (X-Frame-Options / CSP)

* **Problema:** O portal Minha Naturgy pode possuir cabeçalhos HTTP que impeçam o carregamento direto em `<iframe src="...">`.
* **Implementação Técnica Requerida:**
1. Adicionar tratamento para falhas de carregamento no frame (`onerror` / verificação de `onload`).
2. Implementar fallback visual elegante caso a URL seja rejeitada pelo servidor de origem (mensagem orientativa com QR Code de apoio para acesso via celular).
3. Prever botão de **"Recarregar Página"** sutil no cabeçalho da Tela 3 para recuperar eventuais quedas pontuais de conexão sem reiniciar a aplicação inteira.



---

## 🧹 5. Limpeza de Sessão, Cache e Privacidade dos Visitantes

* Como os visitantes podem preencher dados de consulta (CPF, código de cliente, e-mail), nenhuma informação pessoal pode persistir para o próximo usuário da fila.
* **Ações ao Clicar em "Voltar ao Menu" ou ao Disparar o Reset de Inatividade:**
1. Limpar imediatamente a propriedade `src` do iframe (`iframe.src = 'about:blank'`).
2. Forçar a destruição ou descarregamento do nó do iframe do DOM para expurgar dados em memória.
3. Resetar qualquer estado local (timers, índices selecionados) antes de voltar para o Screensaver.



---

## ⏱️ 6. Gestão do Temporizador Global de Inatividade (Watchdog)

* Monitorar eventos globais de toque (`touchstart`, `pointerdown`, `click`).
* Configurar timeout padrão de **45 a 60 segundos**.
* O temporizador deve ser pausado na **Tela 1 (Screensaver)** e ativado automaticamente ao entrar nas **Telas 2 e 3**.
* Toda interação reinicia o contador para garantir que usuários ativos não sejam interrompidos no meio de uma leitura.

---

## ⚡ 7. Otimização de Performance e Assets Locais

* **Vídeo do Screensaver:**
* Deve utilizar tag nativa com parâmetros de performance: `autoplay`, `muted`, `loop`, `playsinline`, `preload="auto"`.
* Garantir que o loop seja contínuo, sem engasgos de memória em execuções prolongadas (mais de 8 horas contínuas de operação).


* **Armazenamento de Assets Críticos:** Todos os ícones, logos, fontes e vídeos devem ser servidos localmente a partir da pasta `/public/assets` para garantir renderização imediata mesmo sob oscilações de rede.

