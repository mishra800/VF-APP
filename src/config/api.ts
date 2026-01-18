// API Configuration
export const API_CONFIG = {
  BASE_URL: __DEV__ 
    ? 'http://localhost:3000/api' // Development
    : 'https://your-production-api.com/api', // Production
  
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      SIGNUP: '/auth/signup',
      VERIFY_OTP: '/auth/verify-otp',
      REFRESH_TOKEN: '/auth/refresh',
      LOGOUT: '/auth/logout',
    },
    SEIZURES: {
      CREATE: '/seizures',
      GET_ALL: '/seizures',
      GET_BY_ID: '/seizures/:id',
      UPDATE_STATUS: '/seizures/:id/status',
      GET_USER_SEIZURES: '/seizures/user/:userId',
    },
    UPLOAD: {
      MEDIA: '/upload/media',
    },
  },
  
  TIMEOUT: 10000, // 10 seconds
};

// HTTP Client Configuration
export const HTTP_CONFIG = {
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};