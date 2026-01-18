# Vehicle Force - Quick Setup Guide

## 1. Install Dependencies
```bash
npm install
```

## 2. iOS Setup (macOS only)
```bash
cd ios && pod install && cd ..
```

## 3. Start Metro Bundler
```bash
npx react-native start
```

## 4. Run the App

### Android
```bash
npx react-native run-android
```

### iOS (macOS only)
```bash
npx react-native run-ios
```

## Demo Credentials

### User Login
- Phone: `+1234567891` or Username: `user1`
- OTP: `123456`

### Admin Login  
- Phone: `+1234567890` or Username: `admin`
- OTP: `123456`

## App Features

### User Features
- Login with phone/username + OTP
- Create car seizure reports
- Add photos and videos
- Track report status
- Custom VF branding throughout

### Admin Features
- Review all seizure reports
- Approve/reject reports
- View statistics dashboard
- Filter reports by status

## Branding Updates

The app now features "VF" (Vehicle Force) branding:
- Custom VF logo on all screens
- Updated app name to "Vehicle Force"
- Blue gradient design theme
- Consistent branding across navigation

## Custom App Icons

To update the app icons with VF branding:
1. Check `ICON_INSTRUCTIONS.md` for detailed steps
2. Use the provided SVG template
3. Generate icons using online tools like appicon.co
4. Replace default icons in Android and iOS folders

## Troubleshooting

If you encounter issues:

1. **Clear cache**: `npx react-native start --reset-cache`
2. **Clean Android**: `cd android && ./gradlew clean && cd ..`
3. **Clean iOS**: `cd ios && rm -rf build && cd ..`
4. **Reinstall**: `rm -rf node_modules && npm install`