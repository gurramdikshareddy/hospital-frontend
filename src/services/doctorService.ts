import { apiRequest } from './api';
import { Doctor } from '@/types/hospital';

export const doctorService = {
  async getAll(): Promise<Doctor[]> {
    return apiRequest<Doctor[]>('/doctors');
  },

  async getById(doctorId: string): Promise<Doctor> {
    return apiRequest<Doctor>(`/doctors/${doctorId}`);
  },

  async getByUserId(userId: string): Promise<Doctor> {
    return apiRequest<Doctor>(`/doctors/user/${userId}`);
  },

  async create(doctor: Doctor): Promise<{ success: boolean; doctor: Doctor }> {
    return apiRequest('/doctors', {
      method: 'POST',
      body: doctor,
    });
  },

  async update(doctorId: string, doctor: Partial<Doctor>): Promise<{ success: boolean; doctor: Doctor }> {
    return apiRequest(`/doctors/${doctorId}`, {
      method: 'PUT',
      body: doctor,
    });
  },

  async delete(doctorId: string): Promise<{ success: boolean }> {
    return apiRequest(`/doctors/${doctorId}`, {
      method: 'DELETE',
    });
  },

  async checkUserIdExists(userId: string): Promise<boolean> {
    try {
      await apiRequest(`/doctors/user/${userId}/exists`);
      return true;
    } catch {
      return false;
    }
  },
};
