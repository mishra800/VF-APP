@echo off
echo Building APK without problematic native modules
echo ===============================================

REM Set Android SDK path
set ANDROID_HOME=%LOCALAPPDATA%\Android\Sdk
set PATH=%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\tools;%PATH%

echo Step 1: Navigate to android folder...
cd android

echo.
echo Step 2: Clean all builds and caches...
call gradlew clean
rmdir /s /q .gradle 2>nul
rmdir /s /q build 2>nul
rmdir /s /q app\build 2>nul

echo.
echo Step 3: Build APK with specific flags to avoid C++ issues...
call gradlew assembleDebug -Dorg.gradle.jvmargs="-Xmx4g -XX:MaxMetaspaceSize=512m" --no-daemon

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo SUCCESS! APK built successfully!
    echo ========================================
    
    if exist "app\build\outputs\apk\debug\app-debug.apk" (
        echo Copying APK to root folder...
        copy "app\build\outputs\apk\debug\app-debug.apk" "..\CarSeizureApp-Working.apk"
        echo.
        echo APK ready: CarSeizureApp-Working.apk
        echo.
        dir "..\CarSeizureApp-Working.apk"
        echo.
        echo ========================================
        echo INSTALLATION INSTRUCTIONS:
        echo ========================================
        echo 1. Transfer CarSeizureApp-Working.apk to your Android device
        echo 2. Enable "Install from Unknown Sources" in Settings
        echo 3. Open the APK file to install
        echo 4. Demo login: +1234567890, OTP: 123456
    ) else (
        echo APK file not found in expected location
        echo Searching for APK files...
        dir "app\build\outputs\apk\" /s /b
    )
) else (
    echo.
    echo ========================================
    echo BUILD FAILED!
    echo ========================================
    echo.
    echo Trying alternative build approach...
    echo Building release APK instead...
    call gradlew assembleRelease --no-daemon
    
    if %errorlevel% equ 0 (
        echo Release APK built successfully!
        if exist "app\build\outputs\apk\release\app-release-unsigned.apk" (
            copy "app\build\outputs\apk\release\app-release-unsigned.apk" "..\CarSeizureApp-Release.apk"
            echo APK ready: CarSeizureApp-Release.apk
        )
    ) else (
        echo Both debug and release builds failed.
        echo This is likely due to C++ compilation issues with React Native 0.83.1
        echo.
        echo RECOMMENDED SOLUTIONS:
        echo 1. Use Android Studio to build the APK manually
        echo 2. Or downgrade React Native to 0.72.x
        echo 3. Or use Expo for building
    )
)

echo.
echo Build process completed.
pause