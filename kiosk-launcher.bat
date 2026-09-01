@echo off
REM ============================================
REM  NATURGY KIOSK LAUNCHER
REM  Abre Chrome ou Edge em modo quiosque com bypass total de iframe
REM ============================================
REM
REM  COMO USAR:
REM  1. Deixe o servidor rodando (npm run dev)
REM  2. Execute este arquivo (duplo clique)
REM  3. Para sair do modo quiosque: Alt + F4
REM ============================================

setlocal enabledelayedexpansion

REM Definir URL (Padrao configurado no vite.config.js: http://localhost:3000)
SET "KIOSK_URL=http://localhost:3000"
if not "%~1"=="" SET "KIOSK_URL=%~1"

SET "SCRIPT_DIR=%~dp0"
SET "EXTENSION_DIR=%SCRIPT_DIR%kiosk-extension"
SET "CHROME_PROFILE=%LOCALAPPDATA%\NaturgyKiosk\ChromeProfile"

REM Criar pasta do perfil se nao existir
if not exist "%CHROME_PROFILE%" mkdir "%CHROME_PROFILE%"

REM Localizar executavel do Google Chrome ou Microsoft Edge
SET "BROWSER_PATH="
if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" SET "BROWSER_PATH=C:\Program Files\Google\Chrome\Application\chrome.exe"
if not defined BROWSER_PATH if exist "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" SET "BROWSER_PATH=C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
if not defined BROWSER_PATH if exist "%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe" SET "BROWSER_PATH=%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe"
if not defined BROWSER_PATH if exist "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" SET "BROWSER_PATH=C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if not defined BROWSER_PATH if exist "C:\Program Files\Microsoft\Edge\Application\msedge.exe" SET "BROWSER_PATH=C:\Program Files\Microsoft\Edge\Application\msedge.exe"

if not defined BROWSER_PATH (
  echo [ERRO] Google Chrome ou Edge nao foram encontrados no sistema.
  pause
  exit /b 1
)

echo ============================================
echo  Iniciando Totem Naturgy em Modo Quiosque...
echo  Navegador: %BROWSER_PATH%
echo  URL: %KIOSK_URL%
echo  Extensao: %EXTENSION_DIR%
echo ============================================

start "" "%BROWSER_PATH%" ^
  --kiosk ^
  --load-extension="%EXTENSION_DIR%" ^
  --disable-extensions-except="%EXTENSION_DIR%" ^
  --user-data-dir="%CHROME_PROFILE%" ^
  --disable-translate ^
  --disable-pinch ^
  --overscroll-history-navigation=disabled ^
  --noerrdialogs ^
  --disable-infobars ^
  --disable-session-crashed-bubble ^
  --autoplay-policy=no-user-gesture-required ^
  "%KIOSK_URL%"

echo Totem Naturgy iniciado com sucesso!

