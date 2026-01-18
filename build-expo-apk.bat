@echo off
echo Building APK using Expo
echo ========================

echo Step 1: Installing Expo CLI globally...
call npm install -g @expo/cli

echo.
echo Step 2: Installing EAS CLI...
call npm install -g eas-cli

echo.
echo Step 3: Creating Expo configuration...
call npx create-expo-app --template blank-typescript temp-expo
xcopy "temp-expo\app.json" "." /Y
rmdir /s /q temp-expo

echo.
echo Step 4: Building APK...
call npx expo build:android --type apk

echo.
echo APK build process initiated!
echo Check your Expo dashboard for build status.
echo Once complete, download the APK from the provided link.

pause