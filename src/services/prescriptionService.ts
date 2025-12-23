import { apiRequest } from './api';
import { Prescription } from '@/types/hospital';

export const prescriptionService = {
  async getAll(): Promise<Prescription[]> {
    return apiRequest<Prescription[]>('/prescriptions');
  },

  async getById(prescriptionId: string): Promise<Prescription> {
    return apiRequest<Prescription>(`/prescriptions/${prescriptionId}`);
  },

  async getByDoctor(doctorName: string): Promise<Prescription[]> {
    return apiRequest<Prescription[]>(`/prescriptions/doctor/${encodeURIComponent(doctorName)}`);
  },

  async getByVisit(visitId: string): Promise<Prescription[]> {
    return apiRequest<Prescription[]>(`/prescriptions/visit/${visitId}`);
  },

  async getByPatient(patientId: string): Promise<Prescription[]> {
    return apiRequest<Prescription[]>(`/prescriptions/patient/${patientId}`);
  },

  async create(prescription: Prescription): Promise<{ success: boolean; prescription: Prescription }> {
    return apiRequest('/prescriptions', {
      method: 'POST',
      body: prescription,
    });
  },

  async update(prescriptionId: string, prescription: Partial<Prescription>): Promise<{ success: boolean; prescription: Prescription }> {
    return apiRequest(`/prescriptions/${prescriptionId}`, {
      method: 'PUT',
      body: prescription,
    });
  },

  async delete(prescriptionId: string): Promise<{ success: boolean }> {
    return apiRequest(`/prescriptions/${prescriptionId}`, {
      method: 'DELETE',
    });
  },

  async bulkCreate(prescriptions: Prescription[]): Promise<{ success: number; errors: string[] }> {
    return apiRequest('/prescriptions/bulk', {
      method: 'POST',
      body: { prescriptions },
    });
  },
};
