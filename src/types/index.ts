export interface User {
  id: string;
  username: string;
  phoneNumber: string;
  role: 'user' | 'admin';
}

export interface CarSeizure {
  id: string;
  userId: string;
  carDetails: {
    make: string;
    model: string;
    year: string;
    color: string;
    licensePlate: string;
    vin?: string;
  };
  seizureDetails: {
    location: string;
    reason: string;
    date: string;
    time: string;
    notes?: string;
  };
  media: {
    photos: string[];
    videos: string[];
  };
  status: 'pending' | 'reviewed' | 'approved' | 'rejected';
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}