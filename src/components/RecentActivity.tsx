import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { CarSeizure } from '../types';

interface RecentActivityProps {
  seizures: CarSeizure[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ seizures }) => {
  // Get recent activities (last 5 actions)
  const getRecentActivities = () => {
    const activities: any[] = [];
    
    // Sort seizures by creation date
    const sortedSeizures = [...seizures].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Add creation activities
    sortedSeizures.slice(0, 3).forEach(seizure => {
      activities.push({
        id: `created-${seizure.id}`,
        type: 'created',
        seizure,
        date: seizure.createdAt,
        icon: '📝',
        title: 'Report Created',
        description: `${seizure.carDetails.make} ${seizure.carDetails.model}`,
      });
    });

    // Add status change activities
    seizures
      .filter(s => s.reviewedAt)
      .sort((a, b) => new Date(b.reviewedAt!).getTime() - new Date(a.reviewedAt!).getTime())
      .slice(0, 2)
      .forEach(seizure => {
        const statusIcon = seizure.status === 'approved' ? '✅' : 
                          seizure.status === 'rejected' ? '❌' : '👀';
        
        activities.push({
          id: `status-${seizure.id}`,
          type: 'status_change',
          seizure,
          date: seizure.reviewedAt!,
          icon: statusIcon,
          title: `Report ${seizure.status}`,
          description: `${seizure.carDetails.make} ${seizure.carDetails.model}`,
        });
      });

    // Sort all activities by date and return top 5
    return activities
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  };

  const activities = getRecentActivities();

  if (activities.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>📅 Recent Activity</Text>
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📋</Text>
          <Text style={styles.emptyText}>No recent activity</Text>
          <Text style={styles.emptySubtext}>Your recent actions will appear here</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📅 Recent Activity</Text>
      <ScrollView style={styles.activityList} showsVerticalScrollIndicator={false}>
        {activities.map((activity, index) => (
          <View key={activity.id} style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <Text style={styles.iconText}>{activity.icon}</Text>
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>{activity.title}</Text>
              <Text style={styles.activityDescription}>{activity.description}</Text>
              <Text style={styles.activityDate}>
                {new Date(activity.date).toLocaleDateString()} at{' '}
                {new Date(activity.date).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </Text>
            </View>
            {index < activities.length - 1 && <View style={styles.separator} />}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  activityList: {
    maxHeight: 200,
  },
  activityItem: {
    flexDirection: 'row',
    paddingVertical: 12,
  },
  activityIcon: {
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
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  activityDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  activityDate: {
    fontSize: 12,
    color: '#999',
  },
  separator: {
    position: 'absolute',
    bottom: 0,
    left: 52,
    right: 0,
    height: 1,
    backgroundColor: '#e9ecef',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});

export default RecentActivity;