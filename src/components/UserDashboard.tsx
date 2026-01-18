import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  ScrollView,
} from 'react-native';
import { User, CarSeizure } from '../types';
import SeizureService from '../services/SeizureService';
import AuthService from '../services/AuthService';
import VFLogo from './VFLogo';
import QuickActions from './QuickActions';
import SimpleStats from './SimpleStats';
import FloatingActionButton from './FloatingActionButton';
import RecentActivity from './RecentActivity';
import NotificationCenter from './NotificationCenter';
import SearchFilter from './SearchFilter';
import QRScanner from './QRScanner';
import VoiceCommand from './VoiceCommand';

interface UserDashboardProps {
  user: User;
  navigation: any;
  onLogout: () => void;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ user, navigation, onLogout }) => {
  const [seizures, setSeizures] = useState<CarSeizure[]>([]);
  const [filteredSeizures, setFilteredSeizures] = useState<CarSeizure[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearchFilter, setShowSearchFilter] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showVoiceCommand, setShowVoiceCommand] = useState(false);

  useEffect(() => {
    loadUserSeizures();
  }, []);

  useEffect(() => {
    setFilteredSeizures(seizures);
  }, [seizures]);

  const loadUserSeizures = async () => {
    try {
      const seizureService = SeizureService.getInstance();
      const userSeizures = await seizureService.getUserSeizures(user.id);
      setSeizures(userSeizures);
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

  const handleHelp = () => {
    navigation.navigate('Help');
  };

  const handleViewReports = () => {
    // Scroll to reports section or show reports
    Alert.alert('📋 Your Reports', 'Scroll down to see all your reports below!');
  };

  const handleNotifications = () => {
    setShowNotifications(true);
  };

  const handleSearch = () => {
    setShowSearchFilter(true);
  };

  const handleQRScan = () => {
    setShowQRScanner(true);
  };

  const handleVoiceCommand = () => {
    setShowVoiceCommand(true);
  };

  const handleQRResult = (data: string) => {
    Alert.alert('QR Scanned', `VIN: ${data}`, [
      {
        text: 'Create Report',
        onPress: () => navigation.navigate('CarSeizureForm', { scannedVIN: data }),
      },
    ]);
  };

  const handleVoiceResult = (text: string) => {
    Alert.alert('Voice Recognized', text, [
      {
        text: 'Create Report',
        onPress: () => navigation.navigate('CarSeizureForm', { voiceText: text }),
      },
    ]);
  };

  const handleFilterResults = (filtered: CarSeizure[]) => {
    setFilteredSeizures(filtered);
  };

  const getStats = () => {
    const total = seizures.length;
    const pending = seizures.filter(s => s.status === 'pending').length;
    const approved = seizures.filter(s => s.status === 'approved').length;
    
    return { total, pending, approved };
  };

  const stats = getStats();

  const getStatusColor = (status: CarSeizure['status']) => {
    switch (status) {
      case 'pending': return '#ffc107';
      case 'reviewed': return '#17a2b8';
      case 'approved': return '#28a745';
      case 'rejected': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getStatusEmoji = (status: CarSeizure['status']) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'reviewed': return '👀';
      case 'approved': return '✅';
      case 'rejected': return '❌';
      default: return '📄';
    }
  };
  const renderSeizureItem = ({ item }: { item: CarSeizure }) => (
    <TouchableOpacity
      style={styles.seizureCard}
      onPress={() => navigation.navigate('SeizureDetails', { seizure: item })}
    >
      <View style={styles.seizureHeader}>
        <Text style={styles.seizureTitle}>
          🚗 {item.carDetails.make} {item.carDetails.model}
        </Text>
        <View style={styles.statusContainer}>
          <Text style={styles.statusEmoji}>{getStatusEmoji(item.status)}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
          </View>
        </View>
      </View>
      <Text style={styles.seizureLocation}>📍 {item.seizureDetails.location}</Text>
      <Text style={styles.seizureDate}>
        📅 {new Date(item.createdAt).toLocaleDateString()}
      </Text>
      <Text style={styles.licensePlate}>
        🔢 Plate: {item.carDetails.licensePlate}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <VFLogo size={35} />
          <View style={styles.headerText}>
            <Text style={styles.welcomeText}>Welcome, {user.username}! 👋</Text>
            <Text style={styles.roleText}>Vehicle Force - User</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.notificationButton} onPress={handleNotifications}>
            <Text style={styles.notificationIcon}>🔔</Text>
            <View style={styles.notificationBadge}>
              <Text style={styles.badgeText}>3</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      <SimpleStats
        totalReports={stats.total}
        pendingReports={stats.pending}
        approvedReports={stats.approved}
      />

      <QuickActions
        onNewReport={() => navigation.navigate('CarSeizureForm')}
        onViewReports={handleViewReports}
        onHelp={handleHelp}
      />

      <RecentActivity seizures={seizures} />

      <View style={styles.reportsHeader}>
        <Text style={styles.sectionTitle}>📋 Your Reports</Text>
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchIcon}>🔍</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.seizuresSection}>
        {filteredSeizures.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📝</Text>
            <Text style={styles.emptyText}>No reports found</Text>
            <Text style={styles.emptySubtext}>
              {seizures.length === 0 
                ? 'Tap "New Report" above to create your first report'
                : 'Try adjusting your search filters'
              }
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredSeizures}
            renderItem={renderSeizureItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
          />
        )}
      </View>

      {/* Floating Action Button */}
      <FloatingActionButton
        onNewReport={() => navigation.navigate('CarSeizureForm')}
        onQRScan={handleQRScan}
        onVoiceReport={handleVoiceCommand}
      />

      {/* Modals */}
      <NotificationCenter
        seizures={seizures}
        visible={showNotifications}
        onClose={() => setShowNotifications(false)}
      />

      <SearchFilter
        visible={showSearchFilter}
        onClose={() => setShowSearchFilter(false)}
        onFilter={handleFilterResults}
        reports={seizures}
      />

      <QRScanner
        visible={showQRScanner}
        onClose={() => setShowQRScanner(false)}
        onScanResult={handleQRResult}
      />

      <VoiceCommand
        visible={showVoiceCommand}
        onClose={() => setShowVoiceCommand(false)}
        onVoiceResult={handleVoiceResult}
      />
    </ScrollView>
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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
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
  notificationButton: {
    position: 'relative',
    padding: 8,
    marginRight: 10,
  },
  notificationIcon: {
    fontSize: 24,
  },
  notificationBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#dc3545',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  logoutButton: {
    padding: 8,
  },
  logoutText: {
    color: '#dc3545',
    fontSize: 16,
    fontWeight: '500',
  },
  reportsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  searchButton: {
    padding: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  searchIcon: {
    fontSize: 18,
  },
  seizuresSection: {
    paddingHorizontal: 5,
    marginBottom: 100, // Space for floating action button
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
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusEmoji: {
    fontSize: 18,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    color: '#fff',
    fontSize: 10,
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
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 15,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 15,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 8,
    fontWeight: '500',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

export default UserDashboard;