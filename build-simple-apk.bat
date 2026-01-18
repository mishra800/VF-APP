@echo off
echo Simple APK Builder
echo ==================

REM Set Android SDK path
set ANDROID_HOME=%LOCALAPPDATA%\Android\Sdk
set PATH=%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\tools;%PATH%

echo Current directory: %CD%
echo Android SDK: %ANDROID_HOME%

echo.
echo Step 1: Navigate to android folder...
cd android

echo.
echo Step 2: Clean previous builds...
call gradlew clean

echo.
echo Step 3: Build debug APK...
call gradlew assembleDebug

echo.
echo Checking for APK file...
if exist "app\build\outputs\apk\debug\app-debug.apk" (
    echo SUCCESS! APK found!
    echo Copying APK to root folder...
    copy "app\build\outputs\apk\debug\app-debug.apk" "..\CarSeizureApp.apk"
    echo.
    echo APK ready: CarSeizureApp.apk
    echo File size:
    dir "..\CarSeizureApp.apk"
) else (
    echo APK not found. Checking build directory...
    dir "app\build\outputs\apk\" /s
)

echo.
echo Build completed!
pause