@echo off
echo Simple APK Build Script (No NDK)
echo =================================

REM Set Android environment
set ANDROID_HOME=%LOCALAPPDATA%\Android\Sdk
set PATH=%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\tools;%PATH%

echo Cleaning previous builds...
cd android
call gradlew clean

echo Building APK without NDK...
call gradlew assembleDebug -x bundleDebugJsAndAssets

if %errorlevel% equ 0 (
    echo.
    echo SUCCESS! APK built successfully!
    echo Location: android\app\build\outputs\apk\debug\app-debug.apk
    
    REM Copy to root for easy access
    copy "app\build\outputs\apk\debug\app-debug.apk" "..\CarSeizureApp.apk"
    echo Copied to: CarSeizureApp.apk
) else (
    echo.
    echo BUILD FAILED! Trying alternative approach...
    echo.
    echo Trying with --no-daemon flag...
    call gradlew assembleDebug --no-daemon -x bundleDebugJsAndAssets
    
    if %errorlevel% equ 0 (
        echo SUCCESS with --no-daemon!
        copy "app\build\outputs\apk\debug\app-debug.apk" "..\CarSeizureApp.apk"
        echo Copied to: CarSeizureApp.apk
    ) else (
        echo BUILD STILL FAILED! Check error messages above.
    )
)

pause