@echo off
echo ========================================
echo ULTIMATE APK Builder - Multiple Methods
echo ========================================

REM Set Android SDK path
set ANDROID_HOME=C:\Users\abhis\AppData\Local\Android\Sdk
set PATH=%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\tools;%PATH%

echo Android SDK: %ANDROID_HOME%
echo Available NDK versions:
dir "%ANDROID_HOME%\ndk"

echo.
echo ========================================
echo METHOD 1: Direct Gradle Build
echo ========================================

cd android

echo Step 1: Clean everything...
call gradlew clean
rmdir /s /q .gradle 2>nul
rmdir /s /q build 2>nul
rmdir /s /q app\build 2>nul

echo.
echo Step 2: Building with optimized settings...
call gradlew assembleDebug --no-daemon --stacktrace -Dorg.gradle.jvmargs="-Xmx6g -XX:MaxMetaspaceSize=2g"

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo METHOD 1 SUCCESS!
    echo ========================================
    
    if exist "app\build\outputs\apk\debug\app-debug.apk" (
        copy "app\build\outputs\apk\debug\app-debug.apk" "..\CarSeizureApp-Method1.apk"
        echo APK ready: CarSeizureApp-Method1.apk
        goto :success
    )
)

echo.
echo ========================================
echo METHOD 2: Release Build
echo ========================================

call gradlew assembleRelease --no-daemon --stacktrace -Dorg.gradle.jvmargs="-Xmx6g"

if %errorlevel% equ 0 (
    if exist "app\build\outputs\apk\release\app-release-unsigned.apk" (
        copy "app\build\outputs\apk\release\app-release-unsigned.apk" "..\CarSeizureApp-Method2.apk"
        echo APK ready: CarSeizureApp-Method2.apk
        goto :success
    )
)

echo.
echo ========================================
echo METHOD 3: Expo CLI Build
echo ========================================

cd ..

echo Installing Expo CLI...
npm install -g @expo/cli

echo Building with Expo...
npx expo run:android --variant debug

if %errorlevel% equ 0 (
    if exist "android\app\build\outputs\apk\debug\app-debug.apk" (
        copy "android\app\build\outputs\apk\debug\app-debug.apk" "CarSeizureApp-Method3.apk"
        echo APK ready: CarSeizureApp-Method3.apk
        goto :success
    )
)

echo.
echo ========================================
echo METHOD 4: React Native CLI
echo ========================================

echo Building with React Native CLI...
npx react-native run-android --variant=debug

if %errorlevel% equ 0 (
    if exist "android\app\build\outputs\apk\debug\app-debug.apk" (
        copy "android\app\build\outputs\apk\debug\app-debug.apk" "CarSeizureApp-Method4.apk"
        echo APK ready: CarSeizureApp-Method4.apk
        goto :success
    )
)

echo.
echo ========================================
echo ALL METHODS FAILED
echo ========================================
echo.
echo MANUAL SOLUTION:
echo 1. Open Android Studio
echo 2. Open project: %CD%\android
echo 3. Build > Generate Signed Bundle/APK
echo 4. Choose APK, then Debug
echo.
echo OR try online build services:
echo - Expo EAS Build: https://expo.dev
echo - AppCenter: https://appcenter.ms
echo.
goto :end

:success
echo.
echo ========================================
echo SUCCESS! APK BUILT SUCCESSFULLY!
echo ========================================
echo.
echo INSTALLATION INSTRUCTIONS:
echo 1. Transfer the APK file to your Android device
echo 2. Enable "Install from Unknown Sources" in Settings
echo 3. Open the APK file to install
echo.
echo DEMO CREDENTIALS:
echo Admin: +1234567890, OTP: 123456
echo User:  +1234567891, OTP: 123456
echo.
echo App Features:
echo - Car seizure form with photo capture
echo - Admin and user dashboards
echo - Offline support
echo - QR code scanning
echo - Voice commands
echo.

:end
echo Build process completed.
pause