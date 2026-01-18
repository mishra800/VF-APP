@echo off
echo Setting up Android environment...

REM Add Android SDK tools to PATH for this session
set PATH=%PATH%;C:\Users\abhis\AppData\Local\Android\Sdk\platform-tools
set PATH=%PATH%;C:\Users\abhis\AppData\Local\Android\Sdk\emulator
set PATH=%PATH%;C:\Users\abhis\AppData\Local\Android\Sdk\cmdline-tools\latest\bin

REM Set Android environment variables
set ANDROID_HOME=C:\Users\abhis\AppData\Local\Android\Sdk
set ANDROID_SDK_ROOT=C:\Users\abhis\AppData\Local\Android\Sdk

echo Checking if emulator is running...
adb devices

echo Starting Metro bundler...
start "Metro" cmd /k "npm start"

echo Waiting 10 seconds for Metro to start...
timeout /t 10

echo Installing and running app on emulator...
npm run android

pause