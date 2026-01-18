@echo off
echo ========================================
echo Expo APK Builder - Most Reliable Method
echo ========================================

REM Check if we're in the right directory
if not exist "package.json" (
    echo Error: package.json not found. Make sure you're in the CarSeizureApp directory.
    pause
    exit /b 1
)

echo Step 1: Installing Expo CLI...
npm install -g @expo/cli eas-cli

echo.
echo Step 2: Installing Expo dependencies...
npx expo install

echo.
echo Step 3: Creating Expo configuration...
if not exist "app.json" (
    echo Creating app.json...
    echo {
    echo   "expo": {
    echo     "name": "Car Seizure App",
    echo     "slug": "car-seizure-app",
    echo     "version": "1.0.0",
    echo     "orientation": "portrait",
    echo     "icon": "./assets/icon.png",
    echo     "userInterfaceStyle": "light",
    echo     "splash": {
    echo       "image": "./assets/splash.png",
    echo       "resizeMode": "contain",
    echo       "backgroundColor": "#ffffff"
    echo     },
    echo     "assetBundlePatterns": [
    echo       "**/*"
    echo     ],
    echo     "ios": {
    echo       "supportsTablet": true
    echo     },
    echo     "android": {
    echo       "adaptiveIcon": {
    echo         "foregroundImage": "./assets/adaptive-icon.png",
    echo         "backgroundColor": "#FFFFFF"
    echo       },
    echo       "package": "com.carseizureapp"
    echo     },
    echo     "web": {
    echo       "favicon": "./assets/favicon.png"
    echo     }
    echo   }
    echo } > app.json
)

echo.
echo Step 4: Building APK with Expo...
npx expo run:android --variant debug

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo SUCCESS! APK built with Expo!
    echo ========================================
    echo.
    echo The APK should be available in:
    echo android\app\build\outputs\apk\debug\app-debug.apk
    echo.
    if exist "android\app\build\outputs\apk\debug\app-debug.apk" (
        copy "android\app\build\outputs\apk\debug\app-debug.apk" "CarSeizureApp-Expo.apk"
        echo APK copied to: CarSeizureApp-Expo.apk
        echo File size:
        dir "CarSeizureApp-Expo.apk"
    )
) else (
    echo.
    echo Expo build failed. Trying EAS Build (cloud build)...
    echo.
    echo Step 5: Setting up EAS Build...
    npx eas build:configure
    
    echo.
    echo Step 6: Building APK with EAS (cloud)...
    npx eas build --platform android --profile preview
    
    echo.
    echo EAS Build submitted. Check your Expo dashboard for the APK download link.
    echo Visit: https://expo.dev/accounts/[your-account]/projects/car-seizure-app/builds
)

echo.
echo Build process completed!
pause