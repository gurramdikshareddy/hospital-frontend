import { apiRequest } from './api';
import { Patient } from '@/types/hospital';

export const patientService = {
  async getAll(): Promise<Patient[]> {
    return apiRequest<Patient[]>('/patients');
  },

  async getById(patientId: string): Promise<Patient> {
    return apiRequest<Patient>(`/patients/${patientId}`);
  },

  async create(patient: Patient): Promise<{ success: boolean; patient: Patient }> {
    return apiRequest('/patients', {
      method: 'POST',
      body: patient,
    });
  },

  async update(patientId: string, patient: Partial<Patient>): Promise<{ success: boolean; patient: Patient }> {
    return apiRequest(`/patients/${patientId}`, {
      method: 'PUT',
      body: patient,
    });
  },

  async delete(patientId: string): Promise<{ success: boolean }> {
    return apiRequest(`/patients/${patientId}`, {
      method: 'DELETE',
    });
  },

  async bulkCreate(patients: Patient[]): Promise<{ success: number; errors: string[] }> {
    return apiRequest('/patients/bulk', {
      method: 'POST',
      body: { patients },
    });
  },

  async checkIdExists(patientId: string): Promise<boolean> {
    try {
      await apiRequest(`/patients/${patientId}/exists`);
      return true;
    } catch {
      return false;
    }
  },
};
