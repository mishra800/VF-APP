@echo off
echo Building APK without NDK...

REM Clean previous builds
gradlew.bat clean

REM Build without NDK
gradlew.bat assembleRelease -PREACT_NATIVE_NDK_VERSION="" -Pandroid.useDeprecatedNdk=true

if %ERRORLEVEL% EQU 0 (
    echo.
    echo SUCCESS! APK built successfully!
    echo APK location: app\build\outputs\apk\release\app-release.apk
    echo.
    explorer app\build\outputs\apk\release\
) else (
    echo Build failed. Trying alternative approach...
    gradlew.bat assembleRelease --no-daemon -x bundleReleaseJsAndAssets
)

pause