@echo off
echo Setting up Android environment...

REM Set Android SDK path
set ANDROID_HOME=%LOCALAPPDATA%\Android\Sdk
set ANDROID_SDK_ROOT=%LOCALAPPDATA%\Android\Sdk

REM Add Android tools to PATH
set PATH=%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\tools;%ANDROID_HOME%\tools\bin;%PATH%

echo Android SDK Path: %ANDROID_HOME%
echo.

echo Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo Building APK...
cd android

echo Running Gradle clean...
call gradlew clean
if %errorlevel% neq 0 (
    echo Gradle clean failed
    pause
    exit /b 1
)

echo.
echo Building debug APK...
call gradlew assembleDebug
if %errorlevel% neq 0 (
    echo APK build failed
    pause
    exit /b 1
)

echo.
echo ========================================
echo APK BUILD SUCCESSFUL!
echo ========================================
echo.
echo Your APK is located at:
echo %cd%\app\build\outputs\apk\debug\app-debug.apk
echo.

REM Copy APK to root folder for easy access
copy "app\build\outputs\apk\debug\app-debug.apk" "..\CarSeizureApp-debug.apk"
if %errorlevel% equ 0 (
    echo APK copied to: CarSeizureApp-debug.apk
)

echo.
echo Build completed successfully!
pause