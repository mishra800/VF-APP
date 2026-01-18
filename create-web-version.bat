@echo off
echo Creating React Native Web version...

REM Install React Native Web dependencies
npm install react-native-web react-dom @expo/webpack-config

REM Create web build
npx expo start --web

echo Web version will open in your browser!
echo You can then use browser tools to create a PWA or package it.
pause