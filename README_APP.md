# Vehicle Force - Car Seizure Management App

A React Native application for managing car seizure reports with user and admin functionality. The app features custom "VF" (Vehicle Force) branding throughout the interface.

## Features

### User Features
- **Authentication**: Login with phone number or username + OTP verification
- **Car Seizure Reporting**: Submit detailed car seizure reports with:
  - Car details (make, model, year, color, license plate, VIN)
  - Seizure details (location, reason, date, time, notes)
  - Photo and video capture/upload
- **Report Management**: View submitted reports and their status
- **Status Tracking**: Track report status (pending, reviewed, approved, rejected)

### Admin Features
- **Dashboard**: Overview of all seizure reports with statistics
- **Report Review**: Review submitted reports with detailed information
- **Status Management**: Approve, reject, or mark reports as reviewed
- **Media Viewing**: Access photos and videos submitted with reports
- **Filtering**: Filter reports by status (all, pending, reviewed)

## Branding

The app features custom "VF" (Vehicle Force) branding:
- Custom VF logo component used throughout the app
- Blue gradient design (#007bff to #0056b3)
- Consistent branding on all screens
- App name changed to "Vehicle Force"

## Demo Credentials

### User Account
- **Phone**: +1234567891
- **Username**: user1
- **OTP**: 123456

### Admin Account
- **Phone**: +1234567890
- **Username**: admin
- **OTP**: 123456

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Installation Steps

1. **Clone and navigate to the project**:
   ```bash
   cd CarSeizureApp
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **iOS Setup** (macOS only):
   ```bash
   cd ios && pod install && cd ..
   ```

4. **Android Setup**:
   - Ensure Android Studio is installed
   - Start an Android emulator or connect a physical device

### Running the App

#### Android
```bash
npx react-native run-android
```

#### iOS (macOS only)
```bash
npx react-native run-ios
```

## App Structure

```
src/
├── components/           # React Native components
│   ├── LoginScreen.tsx
│   ├── SignupScreen.tsx
│   ├── OTPScreen.tsx
│   ├── UserDashboard.tsx
│   ├── AdminDashboard.tsx
│   ├── CarSeizureForm.tsx
│   └── SeizureDetails.tsx
├── navigation/          # Navigation configuration
│   └── AppNavigator.tsx
├── services/           # Business logic and API services
│   ├── AuthService.ts
│   └── SeizureService.ts
└── types/             # TypeScript type definitions
    └── index.ts
```

## Key Dependencies

- **@react-navigation/native**: Navigation framework
- **@react-navigation/stack**: Stack navigation
- **react-native-image-picker**: Camera and gallery access
- **@react-native-async-storage/async-storage**: Local data storage
- **@twotalltotems/react-native-otp-input**: OTP input component
- **react-native-safe-area-context**: Safe area handling
- **react-native-screens**: Native screen optimization

## Usage Flow

### User Flow
1. **Login**: Enter phone number or username
2. **OTP Verification**: Enter 6-digit OTP (use 123456 for demo)
3. **Dashboard**: View submitted reports and create new ones
4. **New Report**: Fill car and seizure details, add photos/videos
5. **Submit**: Submit report for admin review

### Admin Flow
1. **Login**: Use admin credentials
2. **Dashboard**: View statistics and all reports
3. **Review**: Click on reports to view details
4. **Action**: Approve, reject, or mark as reviewed

## Data Storage

The app uses AsyncStorage for local data persistence:
- User authentication data
- Seizure reports
- Media files (stored as URIs)

## Development Notes

### Mock Data
- The app includes mock authentication and data services
- OTP is hardcoded to "123456" for demo purposes
- User and admin accounts are predefined

### Media Handling
- Photos and videos are handled through react-native-image-picker
- Media files are stored locally with URI references
- In production, implement cloud storage integration

### Security Considerations
- Implement proper JWT token handling
- Add API integration for backend services
- Implement proper media upload to cloud storage
- Add input validation and sanitization

## Future Enhancements

1. **Backend Integration**: Connect to real API services
2. **Push Notifications**: Notify users of status changes
3. **Offline Support**: Handle offline scenarios
4. **Advanced Media**: Video playback, image zoom
5. **Export Features**: PDF reports, data export
6. **Search & Filter**: Advanced search capabilities
7. **Geolocation**: Auto-capture location data
8. **Biometric Auth**: Fingerprint/Face ID support

## Troubleshooting

### Common Issues

1. **Metro bundler issues**:
   ```bash
   npx react-native start --reset-cache
   ```

2. **Android build issues**:
   ```bash
   cd android && ./gradlew clean && cd ..
   ```

3. **iOS build issues**:
   ```bash
   cd ios && rm -rf build && cd ..
   ```

4. **Permission issues**: Ensure camera and storage permissions are granted

## License

This project is for demonstration purposes.