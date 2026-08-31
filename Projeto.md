# BRIEFING & ESPECIFICAÇÃO DE DESENVOLVIMENTO: TOTEM INTERATIVO (MODO QUIOSQUE)

## 📌 1. Visão Geral do Projeto
Desenvolvimento de uma aplicação web interativa em tela única (Single Page Application - SPA) projetada especificamente para operar em **Modo Quiosque (Kiosk Mode)** em TVs Touchscreen verticais de 42 polegadas (proporção 9:16 / resolução 1080x1920) durante um evento corporativo com estande institucional da Naturgy.

A aplicação tem como objetivo apresentar e permitir a navegação guiada por serviços da plataforma **Minha Naturgy** de forma ágil, fluida e autônoma.

---

## 🛠️ 2. Stack Tecnológica & Requisitos
* **Ambiente:** Aplicação Web SPA (Next.js / React / TypeScript com Tailwind CSS ou HTML5/CSS3/JS modular limpo).
* **Orientação:** Estritamente Vertical / Portrait (1080px largura × 1920px altura).
* **Modo Quiosque:** Sem scroll desnecessário, sem recarregamento completo de página, transições suaves entre estados.
* **Organização de Arquivos / Pastas:**
Crie as pastas necessárias para posterior inclusão dos seguintes arquivos :
  * `/public/assets/videos/` -> Vídeos da chama em loop e acendimento.
  * `/public/assets/logos/` -> `logo1.png` (Naturgy institucional) e `logo2.png` (Minha Naturgy).
  * `/public/assets/icons/` -> SVGs/PNGs dos ícones temáticos de cada serviço.
  * `/public/assets/textos.md` -> Arquivo dedicado contendo a lista estruturada de títulos, descrições e URLs de cada botão/serviço para fácil edição posterior.

---

## 📱 3. Fluxo de Navegação & Estrutura das Telas

### 🟢 Tela 1: Descanso (Screensaver Interativo)
* **Objetivo:** Atrair os visitantes do evento quando o totem estiver ocioso.
* **Fundo:** Vídeo em loop contínuo de uma chama de fogão a gás elegante sobre fundo preto/escuro (`/public/assets/videos/screensaver.mp4`).
* **Topo Esquerdo:** Exibição da `logo1.png` (Naturgy institucional) com tamanho discreto e margem de respiro.
* **Área Inferior:** Texto animado/pulsante centralizado: **"TOQUE PARA COMEÇAR"** em fonte sem serifa marcante e legível.
* **Interação:** Qualquer toque em qualquer parte da tela transiciona suavemente para a **Tela 2**.

---

### ⚪ Tela 2: Menu Principal (Grid de Serviços)
* **Objetivo:** Apresentar a grade de serviços da plataforma Minha Naturgy.
* **Fundo:** Branco limpo com sombras suaves e estética corporativa moderna.
* **Topo / Cabeçalho:**
  * `logo2.png` (Minha Naturgy) centralizada verticalmente acima dos cards, com excelente definição.
* **Corpo Central (Grid de Cards):**
  * Disposição em **Grid de 3 colunas** com cards grandes e toque amplo.
  * Cada card deve conter:
    * Ícone temático no topo/lateral (`/public/assets/icons/icon-X.svg`).
    * Título em destaque (tipografia bold/semi-bold).
    * Texto de apoio/descrição breve.
    * Efeito visual de *feedback* ao toque (efeito clique/press).
  * O conteúdo dos cards (título, descrição, ícone e URL de destino) deve ser mapeado a partir do arquivo/configuração derivado de `textos.md`.
* **Interação:** Ao tocar em qualquer card, a aplicação direciona para a **Tela 3**, passando a URL e o título do serviço selecionado.

---

### 🔵 Tela 3: Visualizador de Serviço (Moldura Temática & Iframe)
* **Objetivo:** Exibir a página real do serviço selecionado dentro de uma moldura segura e controlada.
* **Cabeçalho Fixo (Header do Quiosque):**
  * Posicionado no topo com altura fixa e destaque visual.
  * Canto esquerdo: `logo1.png` em tamanho reduzido + Título do serviço ativo (ex: *"Atualização Cadastral"*).
  * Canto direito: Botão de ação grande e destacado: **`← Voltar ao Menu`** (para retornar à Tela 2).
* **Corpo Principal (Frame de Exibição):**
  * Container estilizado com borda temática, cantos arredondados e sombra elegante.
  * Elemento `<iframe>` ocupando 100% do espaço restante útil, carregando dinamicamente a URL do link selecionado.
* **Temporizador Global de Reset (Inatividade):**
  * Monitorar qualquer interação de toque na tela.
  * Caso a tela fique sem toques por um tempo pré-configurado (ex: 60 segundos), a aplicação deve:
    1. Limpar a URL do iframe (`src = ''` ou `about:blank`).
    2. Resetar o estado da aplicação e retornar automaticamente para a **Tela 1 (Screensaver)**.

---

## 🚀 4. Entregáveis Imediatos
1. Estrutura de diretórios criada com as pastas de `assets` (`videos`, `logos`, `icons`).
2. Criação do arquivo `textos.md` estruturado em formato Markdown/JSON pronto para inclusão de novos itens.
3. Componentes/estruturas das 3 telas implementadas com controle de transição de estado e lógica de reset por inatividade.