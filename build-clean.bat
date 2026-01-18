@echo off
echo Cleaning Android build...

REM Set environment variables
set PATH=%PATH%;C:\Users\abhis\AppData\Local\Android\Sdk\platform-tools
set ANDROID_HOME=C:\Users\abhis\AppData\Local\Android\Sdk

cd android

echo Cleaning Gradle cache...
gradlew.bat clean

echo Cleaning build directories...
rmdir /s /q build 2>nul
rmdir /s /q app\build 2>nul
rmdir /s /q .gradle 2>nul

echo Building release APK...
gradlew.bat assembleRelease

if %ERRORLEVEL% EQU 0 (
    echo.
    echo SUCCESS! APK built successfully!
    echo APK location: android\app\build\outputs\apk\release\app-release.apk
    echo.
    pause
) else (
    echo.
    echo BUILD FAILED! Trying alternative approach...
    echo.
    
    echo Trying to build without NDK...
    gradlew.bat assembleRelease -PREACT_NATIVE_NDK_VERSION=""
    
    if %ERRORLEVEL% EQU 0 (
        echo SUCCESS with alternative approach!
        echo APK location: android\app\build\outputs\apk\release\app-release.apk
    ) else (
        echo Both approaches failed. Please check the error messages above.
    )
    pause
)