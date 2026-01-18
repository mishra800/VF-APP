import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
  actionData?: any;
}

class NotificationService {
  private static instance: NotificationService;
  private listeners: ((notifications: Notification[]) => void)[] = [];
  
  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // Subscribe to notification updates
  subscribe(callback: (notifications: Notification[]) => void): () => void {
    this.listeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  private notifyListeners(notifications: Notification[]) {
    this.listeners.forEach(listener => listener(notifications));
  }

  async addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): Promise<void> {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false,
    };

    const existing = await this.getNotifications();
    const updated = [newNotification, ...existing];
    
    await AsyncStorage.setItem('notifications', JSON.stringify(updated));
    this.notifyListeners(updated);
  }

  async getNotifications(): Promise<Notification[]> {
    try {
      const notificationsStr = await AsyncStorage.getItem('notifications');
      return notificationsStr ? JSON.parse(notificationsStr) : [];
    } catch {
      return [];
    }
  }

  async markAsRead(notificationId: string): Promise<void> {
    const notifications = await this.getNotifications();
    const updated = notifications.map(notification =>
      notification.id === notificationId
        ? { ...notification, read: true }
        : notification
    );
    
    await AsyncStorage.setItem('notifications', JSON.stringify(updated));
    this.notifyListeners(updated);
  }

  async markAllAsRead(): Promise<void> {
    const notifications = await this.getNotifications();
    const updated = notifications.map(notification => ({
      ...notification,
      read: true,
    }));
    
    await AsyncStorage.setItem('notifications', JSON.stringify(updated));
    this.notifyListeners(updated);
  }

  async getUnreadCount(): Promise<number> {
    const notifications = await this.getNotifications();
    return notifications.filter(n => !n.read).length;
  }

  async clearNotifications(): Promise<void> {
    await AsyncStorage.removeItem('notifications');
    this.notifyListeners([]);
  }

  // Predefined notification templates
  async notifySeizureStatusChange(seizureId: string, status: string, carInfo: string): Promise<void> {
    const statusEmojis = {
      approved: '✅',
      rejected: '❌',
      reviewed: '👀',
      pending: '⏳',
    };

    await this.addNotification({
      title: `${statusEmojis[status as keyof typeof statusEmojis]} Report ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      message: `Your seizure report for ${carInfo} has been ${status}.`,
      type: status === 'approved' ? 'success' : status === 'rejected' ? 'error' : 'info',
      actionData: { seizureId, type: 'VIEW_SEIZURE' },
    });
  }

  async notifyNewSeizureSubmitted(seizureId: string, carInfo: string): Promise<void> {
    await this.addNotification({
      title: '📝 New Report Submitted',
      message: `Seizure report for ${carInfo} has been submitted successfully.`,
      type: 'success',
      actionData: { seizureId, type: 'VIEW_SEIZURE' },
    });
  }

  async notifySystemMessage(title: string, message: string): Promise<void> {
    await this.addNotification({
      title,
      message,
      type: 'info',
    });
  }
}

export default NotificationService;