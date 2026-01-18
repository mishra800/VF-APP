import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import { CarSeizure } from '../types';

interface Notification {
  id: string;
  type: 'status_change' | 'reminder' | 'system';
  title: string;
  message: string;
  date: string;
  read: boolean;
  icon: string;
}

interface NotificationCenterProps {
  seizures: CarSeizure[];
  visible: boolean;
  onClose: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({
  seizures,
  visible,
  onClose,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    generateNotifications();
  }, [seizures]);

  const generateNotifications = () => {
    const notifs: Notification[] = [];

    // Status change notifications
    seizures
      .filter(s => s.reviewedAt)
      .forEach(seizure => {
        const statusIcon = seizure.status === 'approved' ? '✅' : 
                          seizure.status === 'rejected' ? '❌' : '👀';
        
        notifs.push({
          id: `status-${seizure.id}`,
          type: 'status_change',
          title: `Report ${seizure.status}`,
          message: `Your report for ${seizure.carDetails.make} ${seizure.carDetails.model} has been ${seizure.status}`,
          date: seizure.reviewedAt!,
          read: false,
          icon: statusIcon,
        });
      });

    // Reminder notifications for pending reports
    const pendingReports = seizures.filter(s => s.status === 'pending');
    if (pendingReports.length > 0) {
      notifs.push({
        id: 'pending-reminder',
        type: 'reminder',
        title: 'Reports Under Review',
        message: `You have ${pendingReports.length} report(s) waiting for review`,
        date: new Date().toISOString(),
        read: false,
        icon: '⏳',
      });
    }

    // System notifications
    notifs.push({
      id: 'welcome',
      type: 'system',
      title: 'Welcome to Vehicle Force! 👋',
      message: 'Your reports help keep our community safe. Thank you for your service!',
      date: new Date().toISOString(),
      read: false,
      icon: '🎉',
    });

    // Sort by date (newest first)
    notifs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    setNotifications(notifs);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>🔔 Notifications</Text>
            {unreadCount > 0 && (
              <TouchableOpacity onPress={markAllAsRead}>
                <Text style={styles.markAllRead}>Mark all read</Text>
              </TouchableOpacity>
            )}
          </View>

          <ScrollView style={styles.notificationList}>
            {notifications.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>🔔</Text>
                <Text style={styles.emptyText}>No notifications</Text>
                <Text style={styles.emptySubtext}>You're all caught up!</Text>
              </View>
            ) : (
              notifications.map((notification) => (
                <TouchableOpacity
                  key={notification.id}
                  style={[
                    styles.notificationItem,
                    !notification.read && styles.unreadNotification,
                  ]}
                  onPress={() => markAsRead(notification.id)}
                >
                  <View style={styles.notificationIcon}>
                    <Text style={styles.iconText}>{notification.icon}</Text>
                  </View>
                  <View style={styles.notificationContent}>
                    <Text style={styles.notificationTitle}>
                      {notification.title}
                    </Text>
                    <Text style={styles.notificationMessage}>
                      {notification.message}
                    </Text>
                    <Text style={styles.notificationDate}>
                      {new Date(notification.date).toLocaleDateString()} at{' '}
                      {new Date(notification.date).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                  </View>
                  {!notification.read && <View style={styles.unreadDot} />}
                </TouchableOpacity>
              ))
            )}
          </ScrollView>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 20,
    margin: 20,
    maxHeight: '80%',
    width: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  markAllRead: {
    color: '#007bff',
    fontSize: 14,
    fontWeight: '500',
  },
  notificationList: {
    maxHeight: 400,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  unreadNotification: {
    backgroundColor: '#f8f9ff',
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 18,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    lineHeight: 20,
  },
  notificationDate: {
    fontSize: 12,
    color: '#999',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#007bff',
    marginTop: 8,
  },
  closeButton: {
    padding: 20,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  closeButtonText: {
    color: '#007bff',
    fontSize: 16,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 15,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
});

export default NotificationCenter;