import AsyncStorage from '@react-native-async-storage/async-storage';
// Note: NetInfo would be imported here for real network detection
// import NetInfo from '@react-native-community/netinfo';
import { CarSeizure } from '../types';

interface PendingAction {
  id: string;
  type: 'CREATE_SEIZURE' | 'UPDATE_STATUS' | 'UPLOAD_MEDIA';
  data: any;
  timestamp: string;
  retryCount: number;
}

class OfflineService {
  private static instance: OfflineService;
  private isOnline: boolean = true;
  private syncInProgress: boolean = false;
  
  static getInstance(): OfflineService {
    if (!OfflineService.instance) {
      OfflineService.instance = new OfflineService();
    }
    return OfflineService.instance;
  }

  constructor() {
    this.initializeNetworkListener();
  }

  private initializeNetworkListener() {
    // For now, we'll simulate network detection
    // In a real app, uncomment the NetInfo code below:
    
    /*
    NetInfo.addEventListener(state => {
      const wasOffline = !this.isOnline;
      this.isOnline = state.isConnected ?? false;
      
      // If we just came back online, sync pending actions
      if (wasOffline && this.isOnline) {
        this.syncPendingActions();
      }
    });
    */
    
    // Mock network status for demo
    this.isOnline = true;
  }

  async isConnected(): Promise<boolean> {
    // For now, return mock status
    // In a real app, uncomment the NetInfo code below:
    
    /*
    const state = await NetInfo.fetch();
    return state.isConnected ?? false;
    */
    
    return true; // Mock: always connected
  }

  async addPendingAction(action: Omit<PendingAction, 'id' | 'timestamp' | 'retryCount'>): Promise<void> {
    const pendingAction: PendingAction = {
      ...action,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      retryCount: 0,
    };

    const existingActions = await this.getPendingActions();
    const updatedActions = [...existingActions, pendingAction];
    
    await AsyncStorage.setItem('pendingActions', JSON.stringify(updatedActions));
  }

  async getPendingActions(): Promise<PendingAction[]> {
    try {
      const actionsStr = await AsyncStorage.getItem('pendingActions');
      return actionsStr ? JSON.parse(actionsStr) : [];
    } catch {
      return [];
    }
  }

  async removePendingAction(actionId: string): Promise<void> {
    const actions = await this.getPendingActions();
    const filteredActions = actions.filter(action => action.id !== actionId);
    await AsyncStorage.setItem('pendingActions', JSON.stringify(filteredActions));
  }

  async syncPendingActions(): Promise<void> {
    if (this.syncInProgress || !this.isOnline) {
      return;
    }

    this.syncInProgress = true;
    
    try {
      const pendingActions = await this.getPendingActions();
      
      for (const action of pendingActions) {
        try {
          await this.executePendingAction(action);
          await this.removePendingAction(action.id);
        } catch (error) {
          console.error('Failed to sync action:', action.id, error);
          
          // Increment retry count
          action.retryCount++;
          
          // Remove action if it has failed too many times
          if (action.retryCount >= 3) {
            await this.removePendingAction(action.id);
            console.warn('Removing action after 3 failed attempts:', action.id);
          }
        }
      }
    } finally {
      this.syncInProgress = false;
    }
  }

  private async executePendingAction(action: PendingAction): Promise<void> {
    // This would integrate with your actual API service
    // For now, we'll just simulate the execution
    
    switch (action.type) {
      case 'CREATE_SEIZURE':
        // await SeizureService.getInstance().submitSeizureToAPI(action.data);
        console.log('Syncing seizure creation:', action.data);
        break;
        
      case 'UPDATE_STATUS':
        // await SeizureService.getInstance().updateStatusOnAPI(action.data);
        console.log('Syncing status update:', action.data);
        break;
        
      case 'UPLOAD_MEDIA':
        // await MediaService.getInstance().uploadToAPI(action.data);
        console.log('Syncing media upload:', action.data);
        break;
    }
  }

  // Cache management for offline data
  async cacheSeizureData(seizures: CarSeizure[]): Promise<void> {
    await AsyncStorage.setItem('cachedSeizures', JSON.stringify(seizures));
  }

  async getCachedSeizureData(): Promise<CarSeizure[]> {
    try {
      const cachedStr = await AsyncStorage.getItem('cachedSeizures');
      return cachedStr ? JSON.parse(cachedStr) : [];
    } catch {
      return [];
    }
  }

  async clearCache(): Promise<void> {
    await AsyncStorage.multiRemove(['cachedSeizures', 'pendingActions']);
  }
}

export default OfflineService;