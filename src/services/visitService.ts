import { apiRequest } from './api';
import { Visit } from '@/types/hospital';

export const visitService = {
  async getAll(): Promise<Visit[]> {
    return apiRequest<Visit[]>('/visits');
  },

  async getById(visitId: string): Promise<Visit> {
    return apiRequest<Visit>(`/visits/${visitId}`);
  },

  async getByPatient(patientId: string): Promise<Visit[]> {
    return apiRequest<Visit[]>(`/visits/patient/${patientId}`);
  },

  async getByDoctor(doctorName: string): Promise<Visit[]> {
    return apiRequest<Visit[]>(`/visits/doctor/${encodeURIComponent(doctorName)}`);
  },

  async create(visit: Visit): Promise<{ success: boolean; visit: Visit }> {
    return apiRequest('/visits', {
      method: 'POST',
      body: visit,
    });
  },

  async update(visitId: string, visit: Partial<Visit>): Promise<{ success: boolean; visit: Visit }> {
    return apiRequest(`/visits/${visitId}`, {
      method: 'PUT',
      body: visit,
    });
  },

  async delete(visitId: string): Promise<{ success: boolean }> {
    return apiRequest(`/visits/${visitId}`, {
      method: 'DELETE',
    });
  },

  async bulkCreate(visits: Visit[]): Promise<{ success: number; errors: string[] }> {
    return apiRequest('/visits/bulk', {
      method: 'POST',
      body: { visits },
    });
  },

  async checkIdExists(visitId: string): Promise<boolean> {
    try {
      await apiRequest(`/visits/${visitId}/exists`);
      return true;
    } catch {
      return false;
    }
  },
};
