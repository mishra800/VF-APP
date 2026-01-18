import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface SimpleStatsProps {
  totalReports: number;
  pendingReports: number;
  approvedReports: number;
}

const SimpleStats: React.FC<SimpleStatsProps> = ({
  totalReports,
  pendingReports,
  approvedReports,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>📊 Your Summary</Text>
      
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{totalReports}</Text>
          <Text style={styles.statLabel}>Total Reports</Text>
          <Text style={styles.statIcon}>📝</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={[styles.statNumber, { color: '#ffc107' }]}>{pendingReports}</Text>
          <Text style={styles.statLabel}>Waiting</Text>
          <Text style={styles.statIcon}>⏳</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={[styles.statNumber, { color: '#28a745' }]}>{approvedReports}</Text>
          <Text style={styles.statLabel}>Approved</Text>
          <Text style={styles.statIcon}>✅</Text>
        </View>
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
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 5,
  },
  statIcon: {
    fontSize: 16,
  },
});

export default SimpleStats;