@echo off
echo Final APK Build Script
echo ======================

REM Set Android environment
set ANDROID_HOME=%LOCALAPPDATA%\Android\Sdk
set PATH=%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\tools;%PATH%

echo Step 1: Installing dependencies...
call npm install

echo.
echo Step 2: Navigating to android folder...
cd android

echo.
echo Step 3: Cleaning previous builds...
call gradlew clean

echo.
echo Step 4: Building APK (this may take several minutes)...
call gradlew assembleDebug

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo SUCCESS! APK built successfully!
    echo ========================================
    echo.
    echo APK Location: android\app\build\outputs\apk\debug\app-debug.apk
    
    REM Copy to root for easy access
    if exist "app\build\outputs\apk\debug\app-debug.apk" (
        copy "app\build\outputs\apk\debug\app-debug.apk" "..\CarSeizureApp.apk"
        echo.
        echo APK copied to root folder as: CarSeizureApp.apk
        echo File size:
        dir "..\CarSeizureApp.apk" | find "CarSeizureApp.apk"
    ) else (
        echo APK file not found in expected location
    )
) else (
    echo.
    echo ========================================
    echo BUILD FAILED!
    echo ========================================
    echo.
    echo Please check the error messages above.
    echo Common solutions:
    echo 1. Make sure Android SDK is properly installed
    echo 2. Check if Java version is compatible
    echo 3. Try running: gradlew clean assembleDebug --stacktrace
)

echo.
echo Build process completed.
pause