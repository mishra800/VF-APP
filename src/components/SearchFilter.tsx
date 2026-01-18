import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import { CarSeizure } from '../types';

interface SearchFilterProps {
  visible: boolean;
  onClose: () => void;
  onFilter: (filteredReports: CarSeizure[]) => void;
  reports: CarSeizure[];
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  visible,
  onClose,
  onFilter,
  reports,
}) => {
  const [searchText, setSearchText] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const statusOptions = [
    { value: 'all', label: 'All Reports', icon: '📋', color: '#6c757d' },
    { value: 'pending', label: 'Waiting', icon: '⏳', color: '#ffc107' },
    { value: 'approved', label: 'Approved', icon: '✅', color: '#28a745' },
    { value: 'rejected', label: 'Rejected', icon: '❌', color: '#dc3545' },
    { value: 'reviewed', label: 'Reviewed', icon: '👀', color: '#17a2b8' },
  ];

  const applyFilter = () => {
    let filtered = [...reports];

    // Filter by search text
    if (searchText.trim()) {
      const searchLower = searchText.toLowerCase();
      filtered = filtered.filter(report =>
        report.carDetails.make.toLowerCase().includes(searchLower) ||
        report.carDetails.model.toLowerCase().includes(searchLower) ||
        report.carDetails.licensePlate.toLowerCase().includes(searchLower) ||
        report.seizureDetails.location.toLowerCase().includes(searchLower) ||
        report.seizureDetails.reason.toLowerCase().includes(searchLower)
      );
    }

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(report => report.status === selectedStatus);
    }

    onFilter(filtered);
    onClose();
  };

  const clearFilters = () => {
    setSearchText('');
    setSelectedStatus('all');
    onFilter(reports);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>🔍 Search & Filter</Text>
          </View>

          <View style={styles.content}>
            {/* Search Input */}
            <View style={styles.searchSection}>
              <Text style={styles.sectionTitle}>🔍 Search Reports</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Search by car, plate, location..."
                value={searchText}
                onChangeText={setSearchText}
                placeholderTextColor="#999"
              />
            </View>

            {/* Status Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.sectionTitle}>📊 Filter by Status</Text>
              <View style={styles.statusGrid}>
                {statusOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.statusOption,
                      selectedStatus === option.value && styles.selectedStatus,
                      { borderColor: option.color },
                    ]}
                    onPress={() => setSelectedStatus(option.value)}
                  >
                    <Text style={styles.statusIcon}>{option.icon}</Text>
                    <Text
                      style={[
                        styles.statusLabel,
                        selectedStatus === option.value && { color: option.color },
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Results Preview */}
            <View style={styles.previewSection}>
              <Text style={styles.previewText}>
                📋 Found: {
                  searchText || selectedStatus !== 'all' 
                    ? 'Apply filter to see results'
                    : `${reports.length} reports`
                }
              </Text>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.applyButton} onPress={applyFilter}>
              <Text style={styles.applyButtonText}>🔍 Apply Filter</Text>
            </TouchableOpacity>

            <View style={styles.bottomButtons}>
              <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
                <Text style={styles.clearButtonText}>Clear All</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
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
    width: '90%',
    maxHeight: '80%',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    padding: 20,
  },
  searchSection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
  },
  filterSection: {
    marginBottom: 25,
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statusOption: {
    width: '48%',
    padding: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#f8f9fa',
  },
  selectedStatus: {
    backgroundColor: '#fff',
    borderWidth: 2,
  },
  statusIcon: {
    fontSize: 20,
    marginBottom: 5,
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  previewSection: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  previewText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  buttonContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  applyButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  clearButton: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    marginRight: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  clearButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    marginLeft: 10,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 14,
  },
});

export default SearchFilter;