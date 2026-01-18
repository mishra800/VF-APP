@echo off
echo Quick APK Build Script
echo =====================

REM Set Android environment
set ANDROID_HOME=%LOCALAPPDATA%\Android\Sdk
set PATH=%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\tools;%PATH%

echo Navigating to android folder...
cd android

echo Building APK (this may take a few minutes)...
gradlew assembleDebug

if %errorlevel% equ 0 (
    echo.
    echo SUCCESS! APK built successfully!
    echo Location: android\app\build\outputs\apk\debug\app-debug.apk
    
    REM Copy to root for easy access
    copy "app\build\outputs\apk\debug\app-debug.apk" "..\CarSeizureApp.apk"
    echo Copied to: CarSeizureApp.apk
) else (
    echo.
    echo BUILD FAILED! Check the error messages above.
)

pause