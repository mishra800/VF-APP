@echo off
echo ========================================
echo Vehicle Force Car Seizure App - Final Build
echo ========================================

REM Set environment variables
set PATH=%PATH%;C:\Users\abhis\AppData\Local\Android\Sdk\platform-tools
set ANDROID_HOME=C:\Users\abhis\AppData\Local\Android\Sdk

echo Step 1: Checking TypeScript compilation...
npx tsc --noEmit
if %ERRORLEVEL% NEQ 0 (
    echo TypeScript compilation failed!
    pause
    exit /b 1
)

echo Step 2: Running lint fixes...
npm run lint -- --fix

echo Step 3: Cleaning Android build...
cd android
gradlew.bat clean
rmdir /s /q build 2>nul
rmdir /s /q app\build 2>nul

echo Step 4: Building release APK...
gradlew.bat assembleRelease

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo SUCCESS! APK built successfully!
    echo ========================================
    echo APK location: android\app\build\outputs\apk\release\app-release.apk
    echo.
    echo Demo Credentials:
    echo Admin: +1234567890, OTP: 123456
    echo User:  +1234567891, OTP: 123456
    echo.
) else (
    echo.
    echo ========================================
    echo BUILD FAILED!
    echo ========================================
    echo Please use Android Studio to build:
    echo 1. Open Android Studio
    echo 2. Open project: %CD%
    echo 3. Build ^> Generate Signed Bundle/APK
    echo.
)

pause