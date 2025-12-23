const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// GET patients
export async function fetchPatients() {
  const res = await fetch(`${API_BASE_URL}/patients`);
  if (!res.ok) throw new Error("Failed to fetch patients");
  return res.json();
}

// ADD patient
export async function createPatient(patient: any) {
  const res = await fetch(`${API_BASE_URL}/patients`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(patient),
  });

  if (!res.ok) throw new Error("Failed to create patient");
  return res.json();
}
