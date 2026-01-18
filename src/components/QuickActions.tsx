import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface QuickActionsProps {
  onNewReport: () => void;
  onViewReports: () => void;
  onHelp: () => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({
  onNewReport,
  onViewReports,
  onHelp,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quick Actions</Text>
      
      <View style={styles.actionsGrid}>
        <TouchableOpacity style={styles.actionButton} onPress={onNewReport}>
          <Text style={styles.actionIcon}>📝</Text>
          <Text style={styles.actionText}>New Report</Text>
          <Text style={styles.actionSubtext}>Create seizure report</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={onViewReports}>
          <Text style={styles.actionIcon}>📋</Text>
          <Text style={styles.actionText}>My Reports</Text>
          <Text style={styles.actionSubtext}>View all reports</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={onHelp}>
          <Text style={styles.actionIcon}>❓</Text>
          <Text style={styles.actionText}>Help</Text>
          <Text style={styles.actionSubtext}>Get assistance</Text>
        </TouchableOpacity>
      </View>
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
    textAlign: 'center',
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  actionIcon: {
    fontSize: 30,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
  },
  actionSubtext: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
  },
});

export default QuickActions;