import React, { createContext, useContext, useState, useCallback } from 'react';
import { Patient, Visit, Doctor, Prescription } from '@/types/hospital';

interface DataContextType {
  patients: Patient[];
  visits: Visit[];
  doctors: Doctor[];
  prescriptions: Prescription[];
  addPatient: (patient: Patient) => { success: boolean; error?: string };
  addVisit: (visit: Visit) => { success: boolean; error?: string };
  addDoctor: (doctor: Doctor) => { success: boolean; error?: string };
  addPrescription: (prescription: Prescription) => { success: boolean; error?: string };
  bulkAddPatients: (patients: Patient[]) => { success: number; errors: string[] };
  bulkAddVisits: (visits: Visit[]) => { success: number; errors: string[] };
  bulkAddPrescriptions: (prescriptions: Prescription[]) => { success: number; errors: string[] };
  getPatientById: (id: string) => Patient | undefined;
  getVisitsByPatient: (patientId: string) => Visit[];
  getVisitsByDoctor: (doctorName: string) => Visit[];
  getPrescriptionsByDoctor: (doctorName: string) => Prescription[];
  getPatientsByDoctor: (doctorName: string) => Patient[];
  generatePatientId: () => string;
  generateVisitId: () => string;
  generatePrescriptionId: () => string;
  isPatientIdUnique: (id: string) => boolean;
  isVisitIdUnique: (id: string) => boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Empty initial state - ready for MongoDB integration
export function DataProvider({ children }: { children: React.ReactNode }) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);

  const isPatientIdUnique = useCallback((id: string) => {
    return !patients.some(p => p.patient_id === id);
  }, [patients]);

  const isVisitIdUnique = useCallback((id: string) => {
    return !visits.some(v => v.visit_id === id);
  }, [visits]);

  const generatePatientId = useCallback(() => {
    const maxNum = patients.reduce((max, p) => {
      const num = parseInt(p.patient_id.replace('PAT', ''));
      return isNaN(num) ? max : Math.max(max, num);
    }, 0);
    return `PAT${String(maxNum + 1).padStart(3, '0')}`;
  }, [patients]);

  const generateVisitId = useCallback(() => {
    const maxNum = visits.reduce((max, v) => {
      const num = parseInt(v.visit_id.replace('VIS', ''));
      return isNaN(num) ? max : Math.max(max, num);
    }, 0);
    return `VIS${String(maxNum + 1).padStart(3, '0')}`;
  }, [visits]);

  const generatePrescriptionId = useCallback(() => {
    const maxNum = prescriptions.reduce((max, p) => {
      const num = parseInt(p.prescription_id.replace('PRE', ''));
      return isNaN(num) ? max : Math.max(max, num);
    }, 0);
    return `PRE${String(maxNum + 1).padStart(3, '0')}`;
  }, [prescriptions]);

  const addPatient = useCallback((patient: Patient) => {
    if (!isPatientIdUnique(patient.patient_id)) {
      return { success: false, error: 'Patient ID already exists' };
    }
    setPatients(prev => [...prev, patient]);
    return { success: true };
  }, [isPatientIdUnique]);

  const addVisit = useCallback((visit: Visit) => {
    if (!isVisitIdUnique(visit.visit_id)) {
      return { success: false, error: 'Visit ID already exists' };
    }
    if (!patients.some(p => p.patient_id === visit.patient_id)) {
      return { success: false, error: 'Patient not found' };
    }
    setVisits(prev => [...prev, visit]);
    return { success: true };
  }, [isVisitIdUnique, patients]);

  const addDoctor = useCallback((doctor: Doctor) => {
    if (doctors.some(d => d.user_id === doctor.user_id)) {
      return { success: false, error: 'Doctor User ID already exists' };
    }
    setDoctors(prev => [...prev, doctor]);
    // Add to auth system
    (window as any).__addDynamicDoctor?.({
      userId: doctor.user_id,
      password: doctor.password,
      role: 'doctor' as const,
      name: doctor.doctor_name,
      speciality: doctor.doctor_speciality
    });
    return { success: true };
  }, [doctors]);

  const addPrescription = useCallback((prescription: Prescription) => {
    setPrescriptions(prev => [...prev, prescription]);
    return { success: true };
  }, []);

  const bulkAddPatients = useCallback((newPatients: Patient[]) => {
    let successCount = 0;
    const errors: string[] = [];
    const validPatients: Patient[] = [];

    newPatients.forEach((patient, index) => {
      if (!isPatientIdUnique(patient.patient_id) && !validPatients.some(p => p.patient_id === patient.patient_id)) {
        errors.push(`Row ${index + 1}: Patient ID ${patient.patient_id} already exists`);
      } else {
        validPatients.push(patient);
        successCount++;
      }
    });

    if (validPatients.length > 0) {
      setPatients(prev => [...prev, ...validPatients]);
    }

    return { success: successCount, errors };
  }, [isPatientIdUnique]);

  const bulkAddVisits = useCallback((newVisits: Visit[]) => {
    let successCount = 0;
    const errors: string[] = [];
    const validVisits: Visit[] = [];

    newVisits.forEach((visit, index) => {
      if (!isVisitIdUnique(visit.visit_id) && !validVisits.some(v => v.visit_id === visit.visit_id)) {
        errors.push(`Row ${index + 1}: Visit ID ${visit.visit_id} already exists`);
      } else if (!patients.some(p => p.patient_id === visit.patient_id)) {
        errors.push(`Row ${index + 1}: Patient ID ${visit.patient_id} not found`);
      } else {
        validVisits.push(visit);
        successCount++;
      }
    });

    if (validVisits.length > 0) {
      setVisits(prev => [...prev, ...validVisits]);
    }

    return { success: successCount, errors };
  }, [isVisitIdUnique, patients]);

  const bulkAddPrescriptions = useCallback((newPrescriptions: Prescription[]) => {
    const successCount = newPrescriptions.length;
    const errors: string[] = [];

    if (newPrescriptions.length > 0) {
      setPrescriptions(prev => [...prev, ...newPrescriptions]);
    }

    return { success: successCount, errors };
  }, []);

  const getPatientById = useCallback((id: string) => {
    return patients.find(p => p.patient_id === id);
  }, [patients]);

  const getVisitsByPatient = useCallback((patientId: string) => {
    return visits.filter(v => v.patient_id === patientId);
  }, [visits]);

  const getVisitsByDoctor = useCallback((doctorName: string) => {
    return visits.filter(v => v.doctor_name === doctorName);
  }, [visits]);

  const getPrescriptionsByDoctor = useCallback((doctorName: string) => {
    return prescriptions.filter(p => p.doctor_name === doctorName);
  }, [prescriptions]);

  const getPatientsByDoctor = useCallback((doctorName: string) => {
    const patientIds = new Set(visits.filter(v => v.doctor_name === doctorName).map(v => v.patient_id));
    return patients.filter(p => patientIds.has(p.patient_id));
  }, [visits, patients]);

  return (
    <DataContext.Provider value={{
      patients,
      visits,
      doctors,
      prescriptions,
      addPatient,
      addVisit,
      addDoctor,
      addPrescription,
      bulkAddPatients,
      bulkAddVisits,
      bulkAddPrescriptions,
      getPatientById,
      getVisitsByPatient,
      getVisitsByDoctor,
      getPrescriptionsByDoctor,
      getPatientsByDoctor,
      generatePatientId,
      generateVisitId,
      generatePrescriptionId,
      isPatientIdUnique,
      isVisitIdUnique
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
