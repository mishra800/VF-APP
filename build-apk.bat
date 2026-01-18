@echo off
echo Setting up Android environment...
set ANDROID_HOME=C:\Users\abhis\AppData\Local\Android\Sdk
set PATH=%PATH%;%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\tools;%ANDROID_HOME%\tools\bin

echo Navigating to android directory...
cd android

echo Building release APK...
gradlew.bat assembleRelease

echo Build complete! APK location:
echo android\app\build\outputs\apk\release\app-release.apk

pause