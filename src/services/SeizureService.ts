import AsyncStorage from '@react-native-async-storage/async-storage';
import { CarSeizure } from '../types';

class SeizureService {
  private static instance: SeizureService;
  
  static getInstance(): SeizureService {
    if (!SeizureService.instance) {
      SeizureService.instance = new SeizureService();
    }
    return SeizureService.instance;
  }

  async submitSeizure(seizureData: Omit<CarSeizure, 'id' | 'createdAt' | 'status'>): Promise<{ success: boolean; seizureId?: string }> {
    try {
      const seizureId = Date.now().toString();
      const seizure: CarSeizure = {
        ...seizureData,
        id: seizureId,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      // Get existing seizures
      const existingSeizures = await this.getAllSeizures();
      const updatedSeizures = [...existingSeizures, seizure];
      
      await AsyncStorage.setItem('seizures', JSON.stringify(updatedSeizures));
      
      return { success: true, seizureId };
    } catch (error) {
      console.error('Error submitting seizure:', error);
      return { success: false };
    }
  }

  async getAllSeizures(): Promise<CarSeizure[]> {
    try {
      const seizuresStr = await AsyncStorage.getItem('seizures');
      return seizuresStr ? JSON.parse(seizuresStr) : [];
    } catch {
      return [];
    }
  }

  async getUserSeizures(userId: string): Promise<CarSeizure[]> {
    const allSeizures = await this.getAllSeizures();
    return allSeizures.filter(seizure => seizure.userId === userId);
  }

  async updateSeizureStatus(seizureId: string, status: CarSeizure['status'], reviewedBy: string): Promise<boolean> {
    try {
      const seizures = await this.getAllSeizures();
      const seizureIndex = seizures.findIndex(s => s.id === seizureId);
      
      if (seizureIndex !== -1) {
        seizures[seizureIndex] = {
          ...seizures[seizureIndex],
          status,
          reviewedAt: new Date().toISOString(),
          reviewedBy,
        };
        
        await AsyncStorage.setItem('seizures', JSON.stringify(seizures));
        return true;
      }
      
      return false;
    } catch {
      return false;
    }
  }

  async getSeizureById(seizureId: string): Promise<CarSeizure | null> {
    const seizures = await this.getAllSeizures();
    return seizures.find(s => s.id === seizureId) || null;
  }
}

export default SeizureService;