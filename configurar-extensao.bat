@echo off
REM ===================================================
REM  CONFIGURADOR DO PERFIL DO TOTEM NATURGY
REM  Abre o perfil do quiosque em modo janela normal
REM  para instalar a extensao "Ignore X-Frame-Headers"
REM ===================================================

setlocal enabledelayedexpansion

SET "CHROME_PROFILE=%LOCALAPPDATA%\NaturgyKiosk\ChromeProfile"
SET "EXTENSION_URL=https://chromewebstore.google.com/detail/ignore-x-frame-headers/gleekbfjekiniecknbkamfmkohkpodhe"

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

echo ===================================================
echo  Abrindo Perfil do Totem Naturgy...
echo  Local do Perfil: %CHROME_PROFILE%
echo ===================================================
echo.
echo  INSTRUCOES:
echo  1. Na janela que vai abrir, clique no botao "Usar no Chrome" (ou Instalar).
echo  2. Apos confirmar a instalacao, feche a janela do navegador.
echo  3. Em seguida, execute "kiosk-launcher.bat" para iniciar o Totem!
echo ===================================================
echo.

start "" "%BROWSER_PATH%" --user-data-dir="%CHROME_PROFILE%" "%EXTENSION_URL%"

exit /b 0
