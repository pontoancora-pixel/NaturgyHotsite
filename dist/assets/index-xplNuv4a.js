(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))r(t);new MutationObserver(t=>{for(const i of t)if(i.type==="childList")for(const o of i.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&r(o)}).observe(document,{childList:!0,subtree:!0});function a(t){const i={};return t.integrity&&(i.integrity=t.integrity),t.referrerPolicy&&(i.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?i.credentials="include":t.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function r(t){if(t.ep)return;t.ep=!0;const i=a(t);fetch(t.href,i)}})();function A(n){const e=document.getElementById("screen-screensaver");e.innerHTML=`
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
  `;const a=e.querySelector(".screensaver__video");a.addEventListener("ended",()=>{a.currentTime=0,a.play().catch(()=>{})});function r(i){i.preventDefault(),n("menu")}e.addEventListener("click",r),e.addEventListener("touchstart",r,{passive:!1}),new MutationObserver(i=>{i.forEach(o=>{o.attributeName==="class"&&e.classList.contains("active")&&a.play().catch(()=>{})})}).observe(e,{attributes:!0}),console.log("[Screensaver] Inicializado")}const g=[{id:"atualizacao-cadastral",title:"Atualização Cadastral",description:"Atualize seus dados para a nova Nota Fiscal Eletrônica.",icon:"/assets/icons/atualizacao-cadastral.png",url:"https://www.minhanaturgy.com.br/hc/pt-br"},{id:"quite-sua-divida",title:"Quite sua Dívida",description:"Quite sua dívida de gás e tire o peso da rotina.",icon:"/assets/icons/quite-sua-divida.png",url:"https://www.minhanaturgy.com.br/hc/pt-br"},{id:"minhas-faturas",title:"Minhas Faturas",description:"Emitir segunda via e consultar contas em aberto.",icon:"/assets/icons/minhas-faturas.png",url:"https://www.minhanaturgy.com.br/hc/pt-br"},{id:"pix-codigo-de-barras",title:"Pix e Código de Barras",description:"Pague a fatura com pix ou código de barras.",icon:"/assets/icons/pix-codigo-de-barras.png",url:"https://www.minhanaturgy.com.br/hc/pt-br"},{id:"simulador-de-consumo",title:"Simulador de Consumo",description:"Entenda como é calculado o valor da sua conta de gás.",icon:"/assets/icons/simulador-de-consumo.png",url:"https://www.minhanaturgy.com.br/hc/pt-br"},{id:"contestacao-fatura",title:"Contestação de Fatura",description:"Contestar aumento no valor de sua conta.",icon:"/assets/icons/contestacao-fatura.png",url:"https://www.minhanaturgy.com.br/hc/pt-br"}];function B(n){const e=document.getElementById("screen-menu"),a=g.map(r=>`
    <div class="menu__card" data-service-id="${r.id}" role="button" tabindex="0" aria-label="${r.title}">
      <div class="menu__card-icon-wrapper">
        <img
          class="menu__card-icon"
          src="${r.icon}"
          alt=""
          draggable="false"
          loading="eager"
        >
      </div>
      <h3 class="menu__card-title">${r.title}</h3>
      <p class="menu__card-description">${r.description}</p>
    </div>
  `).join("");e.innerHTML=`
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
        ${a}
      </div>
    </div>
  `,e.querySelectorAll(".menu__card").forEach(r=>{const t=r.dataset.serviceId,i=g.find(c=>c.id===t);if(!i)return;function o(c){c.preventDefault(),n("viewer",{url:i.url,title:i.title})}r.addEventListener("click",o),r.addEventListener("touchstart",c=>{},{passive:!0})}),console.log(`[Menu] Inicializado — ${g.length} serviços carregados`)}function $(n){const e=document.getElementById("screen-viewer");e.innerHTML=`
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
  `;let a="",r="",t=null,i=null,o=0;const c=2,T=12e3,b=document.getElementById("viewer-title"),d=document.getElementById("viewer-loading"),p=document.getElementById("viewer-error"),C=document.getElementById("viewer-error-message"),M=document.getElementById("viewer-iframe-wrapper");function S(s){return window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"?s:`/api/proxy?url=${encodeURIComponent(s)}`}function v(s,l){a=s,r=l,b.textContent=l,d.classList.remove("hidden"),p.classList.remove("active"),E(),t=document.createElement("iframe"),t.className="viewer__iframe",t.setAttribute("sandbox","allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"),t.setAttribute("referrerpolicy","no-referrer-when-downgrade"),t.setAttribute("allow","clipboard-write");const w=S(s);t.src=w,t.addEventListener("load",()=>{clearTimeout(i),d.classList.add("hidden"),o=0}),t.addEventListener("error",()=>{clearTimeout(i),k()}),i=setTimeout(()=>{d.classList.add("hidden")},T),M.appendChild(t)}function k(){d.classList.add("hidden"),o<c?(o++,console.log(`[Viewer] Tentativa ${o}/${c}...`),setTimeout(()=>{v(a,r)},1500)):x("A página não pôde ser carregada. Verifique a conexão e tente novamente.")}function x(s){d.classList.add("hidden"),C.textContent=s,p.classList.add("active")}function E(){clearTimeout(i),t&&(t.src="about:blank",t.remove(),t=null)}function L(){E(),a="",r="",o=0,b.textContent="",d.classList.remove("hidden"),p.classList.remove("active")}document.getElementById("viewer-back").addEventListener("click",()=>{L(),n("menu")}),document.getElementById("viewer-reload").addEventListener("click",()=>{a&&(o=0,v(a,r))}),document.getElementById("viewer-retry").addEventListener("click",()=>{a&&(o=0,v(a,r))}),window.addEventListener("viewer:load",s=>{const{url:l,title:w}=s.detail;o=0,v(l,w)}),window.addEventListener("viewer:cleanup",()=>{L()}),console.log("[Viewer] Inicializado")}function O(){window.addEventListener("contextmenu",e=>e.preventDefault()),window.addEventListener("keydown",e=>{(["F5","F11","F12"].includes(e.key)||e.ctrlKey&&["r","u","p","s","w","j","l","g","f"].includes(e.key.toLowerCase())||e.ctrlKey&&e.shiftKey&&["i","j","c"].includes(e.key.toLowerCase())||e.altKey&&["F4","Tab"].includes(e.key))&&(e.preventDefault(),e.stopPropagation())}),window.addEventListener("dragstart",e=>e.preventDefault()),window.addEventListener("drop",e=>{e.preventDefault(),e.stopPropagation()}),window.addEventListener("dragover",e=>{e.preventDefault(),e.stopPropagation()});let n=0;window.addEventListener("touchend",e=>{const a=Date.now();a-n<300&&e.preventDefault(),n=a},{passive:!1}),console.log("[Kiosk Security] Blindagem inicializada")}const I=60*1e3,D=["touchstart","pointerdown","click","mousemove"];let _=null,u=!0,h=null;function z(){u||y()}function y(){clearTimeout(_),_=setTimeout(()=>{!u&&h&&(console.log("[Inatividade] Timeout atingido — resetando para screensaver"),h())},I)}function N(n){h=n,D.forEach(e=>{window.addEventListener(e,z,{passive:!0})}),console.log(`[Inatividade] Inicializado — timeout de ${I/1e3}s`)}function P(){u||y()}function q(){u=!0,clearTimeout(_)}function F(){u=!1,y()}let f="screensaver";function m(n,e={}){if(n===f)return;const a=f;f=n,document.querySelectorAll(".screen").forEach(t=>t.classList.remove("active"));const r=document.getElementById(`screen-${n}`);r.offsetWidth,requestAnimationFrame(()=>{r.classList.add("active")}),n==="screensaver"?q():(F(),P()),n==="viewer"&&e.url&&e.title&&window.dispatchEvent(new CustomEvent("viewer:load",{detail:e})),a==="viewer"&&n!=="viewer"&&window.dispatchEvent(new CustomEvent("viewer:cleanup")),console.log(`[Navegação] ${a} → ${n}`)}document.addEventListener("DOMContentLoaded",()=>{O(),A(m),B(m),$(m),N(()=>m("screensaver")),console.log("[Naturgy Kiosk] Aplicação inicializada ✓")});
