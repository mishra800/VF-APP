@echo off
echo Compatible APK Build Script
echo ============================

REM Set Android environment
set ANDROID_HOME=%LOCALAPPDATA%\Android\Sdk
set PATH=%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\tools;%PATH%

echo Step 1: Cleaning all caches...
cd android
call gradlew clean
cd ..

echo.
echo Step 2: Clearing React Native cache...
call npx react-native start --reset-cache --port 8081 &
timeout /t 5
taskkill /f /im node.exe

echo.
echo Step 3: Installing dependencies...
call npm install

echo.
echo Step 4: Building APK with compatible settings...
cd android
call gradlew assembleDebug --no-daemon --stacktrace

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo SUCCESS! APK built successfully!
    echo ========================================
    echo.
    echo APK Location: android\app\build\outputs\apk\debug\app-debug.apk
    
    REM Copy to root for easy access
    if exist "app\build\outputs\apk\debug\app-debug.apk" (
        copy "app\build\outputs\apk\debug\app-debug.apk" "..\CarSeizureApp-Final.apk"
        echo.
        echo APK copied to root folder as: CarSeizureApp-Final.apk
        echo.
        echo File information:
        dir "..\CarSeizureApp-Final.apk"
        echo.
        echo ========================================
        echo APK READY FOR INSTALLATION!
        echo ========================================
        echo.
        echo To install on your Android device:
        echo 1. Enable "Unknown Sources" in device settings
        echo 2. Transfer CarSeizureApp-Final.apk to your device
        echo 3. Open the APK file to install
    ) else (
        echo APK file not found in expected location
        echo Checking alternative locations...
        dir "app\build\outputs\apk\" /s
    )
) else (
    echo.
    echo ========================================
    echo BUILD FAILED!
    echo ========================================
    echo.
    echo The build failed. This might be due to:
    echo 1. C++ compilation issues with React Native 0.83.1
    echo 2. NDK compatibility problems
    echo 3. Missing dependencies
    echo.
    echo ALTERNATIVE SOLUTION:
    echo Try using the existing build-no-ndk.bat script
    echo or consider downgrading React Native version.
)

echo.
echo Build process completed.
pause