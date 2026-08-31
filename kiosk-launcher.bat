@echo off
REM ============================================
REM  NATURGY KIOSK LAUNCHER
REM  Abre Chrome em modo quiosque com bypass de iframe
REM ============================================
REM
REM  COMO USAR:
REM  1. Edite a URL abaixo com o endereço Vercel ou local
REM  2. Execute este arquivo no computador do totem
REM  3. Para sair: Alt+F4 ou Ctrl+Alt+Del
REM
REM  IMPORTANTE: --disable-web-security permite que o iframe
REM  carregue qualquer site sem restrição de X-Frame-Options.
REM  Use APENAS no totem dedicado, nunca para navegação normal.
REM ============================================

SET KIOSK_URL=http://localhost:3000
SET CHROME_PROFILE=C:\NaturgyKiosk\ChromeProfile

REM Criar pasta do perfil se não existir
if not exist "%CHROME_PROFILE%" mkdir "%CHROME_PROFILE%"

REM Fechar instâncias anteriores do Chrome
taskkill /f /im chrome.exe 2>nul

REM Aguardar fechamento
timeout /t 2 /nobreak >nul

REM Lançar Chrome em modo quiosque
SET CHROME_PATH="C:\Program Files\Google\Chrome\Application\chrome.exe"
if not exist %CHROME_PATH% SET CHROME_PATH="C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"

start "" %CHROME_PATH% ^
  --kiosk ^
  --disable-web-security ^
  --disable-site-isolation-trials ^
  --disable-features=IsolateOrigins,site-per-process,BlockInsecurePrivateNetworkRequests ^
  --user-data-dir="%CHROME_PROFILE%" ^
  --disable-translate ^
  --disable-extensions ^
  --disable-pinch ^
  --overscroll-history-navigation=disabled ^
  --noerrdialogs ^
  --disable-infobars ^
  --disable-session-crashed-bubble ^
  --autoplay-policy=no-user-gesture-required ^
  "%KIOSK_URL%"

echo Naturgy Kiosk iniciado em %KIOSK_URL%
