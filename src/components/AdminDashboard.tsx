import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
} from 'react-native';
import { User, CarSeizure } from '../types';
import SeizureService from '../services/SeizureService';
import AuthService from '../services/AuthService';
import VFLogo from './VFLogo';

interface AdminDashboardProps {
  user: User;
  navigation: any;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, navigation, onLogout }) => {
  const [seizures, setSeizures] = useState<CarSeizure[]>([]);
  const [_loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'reviewed'>('all');

  useEffect(() => {
    loadAllSeizures();
  }, []);

  const loadAllSeizures = async () => {
    try {
      const seizureService = SeizureService.getInstance();
      const allSeizures = await seizureService.getAllSeizures();
      setSeizures(allSeizures);
    } catch (error) {
      console.error('Error loading seizures:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          onPress: async () => {
            await AuthService.getInstance().logout();
            onLogout();
          },
        },
      ]
    );
  };

  const updateSeizureStatus = async (seizureId: string, status: CarSeizure['status']) => {
    try {
      const seizureService = SeizureService.getInstance();
      const success = await seizureService.updateSeizureStatus(seizureId, status, user.id);
      
      if (success) {
        await loadAllSeizures();
        Alert.alert('Success', `Seizure report ${status} successfully`);
      } else {
        Alert.alert('Error', 'Failed to update seizure status');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update seizure status');
    }
  };

  const getStatusColor = (status: CarSeizure['status']) => {
    switch (status) {
      case 'pending': return '#ffc107';
      case 'reviewed': return '#17a2b8';
      case 'approved': return '#28a745';
      case 'rejected': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const filteredSeizures = seizures.filter(seizure => {
    if (filter === 'all') return true;
    if (filter === 'pending') return seizure.status === 'pending';
    if (filter === 'reviewed') return seizure.status !== 'pending';
    return true;
  });

  const getStats = () => {
    const total = seizures.length;
    const pending = seizures.filter(s => s.status === 'pending').length;
    const approved = seizures.filter(s => s.status === 'approved').length;
    const rejected = seizures.filter(s => s.status === 'rejected').length;
    
    return { total, pending, approved, rejected };
  };

  const stats = getStats();

  const renderSeizureItem = ({ item }: { item: CarSeizure }) => (
    <View style={styles.seizureCard}>
      <TouchableOpacity
        onPress={() => navigation.navigate('SeizureDetails', { seizure: item, isAdmin: true })}
      >
        <View style={styles.seizureHeader}>
          <Text style={styles.seizureTitle}>
            {item.carDetails.make} {item.carDetails.model}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
          </View>
        </View>
        <Text style={styles.seizureLocation}>{item.seizureDetails.location}</Text>
        <Text style={styles.seizureDate}>
          Submitted: {new Date(item.createdAt).toLocaleDateString()}
        </Text>
        <Text style={styles.licensePlate}>
          License: {item.carDetails.licensePlate}
        </Text>
      </TouchableOpacity>
      
      {item.status === 'pending' && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.approveButton]}
            onPress={() => updateSeizureStatus(item.id, 'approved')}
          >
            <Text style={styles.actionButtonText}>Approve</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.rejectButton]}
            onPress={() => updateSeizureStatus(item.id, 'rejected')}
          >
            <Text style={styles.actionButtonText}>Reject</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.reviewButton]}
            onPress={() => updateSeizureStatus(item.id, 'reviewed')}
          >
            <Text style={styles.actionButtonText}>Mark Reviewed</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <VFLogo size={35} />
          <View style={styles.headerText}>
            <Text style={styles.welcomeText}>Admin Dashboard</Text>
            <Text style={styles.roleText}>Vehicle Force - {user.username}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.total}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statNumber, { color: '#ffc107' }]}>{stats.pending}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statNumber, { color: '#28a745' }]}>{stats.approved}</Text>
          <Text style={styles.statLabel}>Approved</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statNumber, { color: '#dc3545' }]}>{stats.rejected}</Text>
          <Text style={styles.statLabel}>Rejected</Text>
        </View>
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'all' && styles.activeFilter]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.activeFilterText]}>
            All ({seizures.length})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.filterButton, filter === 'pending' && styles.activeFilter]}
          onPress={() => setFilter('pending')}
        >
          <Text style={[styles.filterText, filter === 'pending' && styles.activeFilterText]}>
            Pending ({stats.pending})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.filterButton, filter === 'reviewed' && styles.activeFilter]}
          onPress={() => setFilter('reviewed')}
        >
          <Text style={[styles.filterText, filter === 'reviewed' && styles.activeFilterText]}>
            Reviewed ({stats.approved + stats.rejected})
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.seizuresSection}>
        {filteredSeizures.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No seizure reports found</Text>
          </View>
        ) : (
          <FlatList
            data={filteredSeizures}
            renderItem={renderSeizureItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerText: {
    marginLeft: 12,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  roleText: {
    fontSize: 14,
    color: '#666',
  },
  logoutButton: {
    padding: 8,
  },
  logoutText: {
    color: '#dc3545',
    fontSize: 16,
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  filterButton: {
    flex: 1,
    padding: 10,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    marginHorizontal: 2,
    borderRadius: 6,
  },
  activeFilter: {
    backgroundColor: '#007bff',
  },
  filterText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  activeFilterText: {
    color: '#fff',
  },
  seizuresSection: {
    flex: 1,
    paddingHorizontal: 20,
  },
  seizureCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  seizureHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  seizureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  seizureLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  seizureDate: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  licensePlate: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
    marginHorizontal: 2,
  },
  approveButton: {
    backgroundColor: '#28a745',
  },
  rejectButton: {
    backgroundColor: '#dc3545',
  },
  reviewButton: {
    backgroundColor: '#17a2b8',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});

export default AdminDashboard;