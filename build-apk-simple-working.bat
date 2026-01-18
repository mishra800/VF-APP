@echo off
echo ========================================
echo Simple Working APK Builder
echo ========================================

REM Set Android SDK path
set ANDROID_HOME=%LOCALAPPDATA%\Android\Sdk
set PATH=%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\tools;%PATH%

echo Step 1: Navigate to android folder...
cd android

echo.
echo Step 2: Clean previous builds...
call gradlew clean
rmdir /s /q .gradle 2>nul
rmdir /s /q build 2>nul
rmdir /s /q app\build 2>nul

echo.
echo Step 3: Build APK without problematic native compilation...
call gradlew assembleDebug --no-daemon -Dorg.gradle.jvmargs="-Xmx4g"

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
        echo File size:
        dir "..\CarSeizureApp-Working.apk"
        echo.
        echo ========================================
        echo READY TO INSTALL!
        echo ========================================
        echo Transfer the APK to your Android device and install
        echo Demo credentials: +1234567890, OTP: 123456
    ) else (
        echo APK not found, checking build directory...
        dir "app\build\outputs\apk\" /s
    )
) else (
    echo Build failed, trying release build...
    call gradlew assembleRelease --no-daemon -Dorg.gradle.jvmargs="-Xmx4g"
    
    if exist "app\build\outputs\apk\release\app-release-unsigned.apk" (
        copy "app\build\outputs\apk\release\app-release-unsigned.apk" "..\CarSeizureApp-Release.apk"
        echo Release APK ready: CarSeizureApp-Release.apk
    ) else (
        echo Both builds failed. Please check the error messages above.
    )
)

echo.
echo Build completed!
pause