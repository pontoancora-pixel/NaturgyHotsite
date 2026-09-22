# 📋 CHECKLIST DE HOMOLOGAÇÃO: TOTEM VERTICAL 42" TOUCHSCREEN (WINDOWS)

Este checklist foi elaborado para a equipe de montagem e suporte técnico que operará os totens no dia do evento. Ele detalha exatamente **o que testar**, **o que deve acontecer**, **o que é uma falha** e **como corrigir no Windows**.

---

## 🖐️ 1. Bateria de Testes Físicos de Toque (Gestos na TV)

Execute estes 6 testes com as mãos diretamente na tela de 42" assim que o sistema iniciar:

| # | Teste / Movimento | O que DEVE acontecer | O que NÃO PODE acontecer (Falha) | Como corrigir no Windows |
|---|-------------------|----------------------|-----------------------------------|--------------------------|
| **1** | **Arrastar do topo para baixo** *(Swipe down do topo da moldura)* | Nada. A tela fica estável. | Aparece a barra de abas do Chrome, barra de títulos ou aviso *"Pressione F11 para sair"*. | Abrir via `--kiosk` pelo script `.bat`. Não usar F11 manual. |
| **2** | **Arrastar da borda direita para a esquerda** | Nada. A tela fica estável. | Abre a Central de Notificações / Barra Lateral do Windows. | Desativar Gestos de Borda (*Edge Swipes*) no Windows (ver seção 2). |
| **3** | **Arrastar da borda esquerda para a direita** | Nada. A tela fica estável. | Abre a Visão de Tarefas (*Task View* / Alt+Tab) mostrando a Área de Trabalho. | Desativar Gestos de Borda (*Edge Swipes*) no Windows (ver seção 2). |
| **4** | **Arrastar da borda inferior para cima** | Nada. A tela fica estável. | A Barra de Tarefas do Windows sobe revelando o botão Iniciar. | Configurar Barra de Tarefas para ocultar automaticamente e travar. |
| **5** | **Movimento de pinça (Pinch com 2 dedos)** | Nada. A tela não muda de tamanho. | A interface dá zoom in / zoom out desconfigurando o layout. | A flag `--disable-pinch` do script `.bat` e o CSS `touch-action: manipulation` impedem isso. |
| **6** | **Toque longo (Pressionar e segurar por 3s)** | Nada acontece. | Aparece um círculo de animação e abre menu com botão direito. | Desativar *"Pressionar e Manter Pressionado"* no Painel de Controle (ver seção 2). |

---

## ⚙️ 2. Como Ajustar os Problemas de Gestos no Windows

Se algum dos gestos acima disparar menus do sistema operacional:

### A. Desativar Gestos de Borda do Windows (Bordas Esquerda/Direita)
1. Pressione `Win + R`, digite `gpedit.msc` e tecle Enter.
2. Navegue até:
   `Configuração do Computador` → `Modelos Administrativos` → `Componentes do Windows` → `Interface do Usuário da Borda`.
3. Dê dois cliques em **"Permitir passar o dedo nas bordas"** (ou *Allow edge swipe*).
4. Marque como **Desabilitado** e clique em **OK**.
*(Nota: Em totens profissionais alugados, as empresas geralmente já deixam essa política desabilitada).*

### B. Desativar Animação de Botão Direito (Toque Longo)
1. Abra o `Painel de Controle` clássico do Windows.
2. Vá em **Caneta e Toque** (Pen and Touch).
3. Na aba **Toque**, selecione a opção **Pressionar e Manter Pressionado** (Press and Hold) e clique em **Configurações**.
4. **Desmarque** a caixa *"Habilitar pressionar e manter pressionado para clique com o botão direito"*.
5. Clique em **OK** e depois em **Aplicar**.

---

## ⌨️ 3. Teclado Virtual (Touch Keyboard)

### O Teste:
1. Navegue até a **Tela 2 (Menu)** e toque em qualquer serviço com iframe (ex: *Segunda Via* ou *Atualização Cadastral*).
2. Toque em um campo de texto (ex: CPF ou e-mail).

### O que deve acontecer:
* O teclado virtual touch do Windows deve subir automaticamente na base da tela para o visitante digitar.

### Possível Falha:
* O cursor pisca no campo, mas o teclado **não abre**. 
* **Por que acontece:** Como é um notebook conectado à TV, o Windows detecta que já existe um teclado físico conectado e desativa o teclado touch automático.

### Como Ajustar no Windows:
* **No Windows 10/11:**
  1. Vá em `Configurações` (`Win + I`) → `Hora e Idioma` (ou `Dispositivos`) → `Digitação`.
  2. Procure pela opção: **"Mostrar o teclado virtual quando não houver teclado conectado"** ou **"Mostrar o painel do teclado virtual quando não estiver no modo tablet e não houver um teclado conectado"** e marque como **ATIVADO**.
  3. Caso o notebook continue não abrindo sozinho, clique com o botão direito na barra de tarefas do Windows e marque **"Mostrar botão do teclado touch"**. O ícone do teclado ficará acessível se o operador precisar acionar.

---

## 🖥️ 4. Display, Resolução e Rotação da TV 42"

1. **Orientação da Tela:**
   * Clique com o botão direito na Área de Trabalho → `Configurações de Exibição`.
   * Em **Orientação da tela**, selecione **Retrato** (ou *Retrato Invertido*, dependendo de qual lado a TV foi montada fisicamente).
2. **Escala (DPI Scaling):**
   * Em `Escala e layout`, certifique-se de que a escala está em **100%**.
   * Se o Windows aplicar 150% ou 200% por padrão, os botões do hotsite podem ficar desproporcionalmente gigantes ou embaçados.
3. **Múltiplos Monitores:**
   * Se o notebook ficar com a tampa aberta do lado de fora:
   * Em `Vários Monitores`, escolha **"Mostrar somente em 2"** (a TV do totem), para evitar que janelas se percam na tela do notebook.

---

## ⚡ 5. Gestão de Energia e Suspensão

Como o totem ficará ligado o dia inteiro:

1. **Ação ao Fechar a Tampa:**
   * Se o notebook for ficar guardado dentro do gabinete/coluna do totem com a tampa fechada:
   * Painel de Controle → `Opções de Energia` → `Escolher a função do fechamento da tampa`.
   * Na coluna **Conectado à tomada**, mude para: **"Não fazer nada"**.
2. **Desligamento e Suspensão:**
   * `Suspender o computador:` **Nunca**.
   * `Desligar vídeo:` **Nunca**.
3. **Protetor de Tela do Windows:**
   * Desativado (o hotsite já possui seu próprio screensaver animado com vídeo da Naturgy).
4. **Windows Update:**
   * Pausar atualizações por 7 dias durante os dias de evento para não surgir pop-up de reinicialização.

---

## 🚀 6. Rotina Rápida de Abertura no Dia do Evento

### Primeira vez no notebook (Configuração Inicial - 30 segundos):
1. Execute o script **`configurar-extensao.bat`**.
2. Na janela que abrir, clique em **"Usar no Chrome"** para instalar o *Ignore X-Frame-Headers* no perfil do totem.
3. Feche a janela do navegador.

### Iniciar o Totem:
1. Ligar o notebook e a TV de 42".
2. Executar o script **`kiosk-launcher.bat`**.
3. O hotsite abrirá em tela cheia na URL oficial de produção (`https://naturgy-hotsite.vercel.app/`), com todos os iframes da Naturgy desbloqueados.
4. **Para a equipe técnica fechar o quiosque:** Pressionar `Alt + F4` no teclado do notebook.
