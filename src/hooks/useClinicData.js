import { useState, useEffect, useCallback } from 'react';
import api from '../lib/api';

export function useClinic() {
  const [clinic, setClinic] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/clinic').then((res) => setClinic(res.data)).finally(() => setLoading(false));
  }, []);

  const updateClinic = useCallback(async (patch) => {
    const { data } = await api.patch('/api/clinic', patch);
    setClinic(data);
    return data;
  }, []);

  return { clinic, loading, updateClinic };
}

export function usePatients(query = '') {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    const { data } = await api.get('/api/patients', { params: query ? { q: query } : {} });
    setPatients(data);
    setLoading(false);
  }, [query]);

  useEffect(() => { reload(); }, [reload]);

  const addPatient = useCallback(async (patient) => {
    const { data } = await api.post('/api/patients', patient);
    setPatients((prev) => [data, ...prev]);
    return data;
  }, []);

  return { patients, loading, addPatient, reload };
}

export function usePatientDetail(patientId) {
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    if (!patientId) return;
    setLoading(true);
    const { data } = await api.get(`/api/patients/${patientId}`);
    setPatient(data);
    setLoading(false);
  }, [patientId]);

  useEffect(() => { reload(); }, [reload]);

  return { patient, loading, reload };
}

export function useVisits(patientId) {
  const addVisit = useCallback(async (visit) => {
    const { data } = await api.post('/api/visits', { patient_id: patientId, ...visit });
    return data;
  }, [patientId]);

  return { addVisit };
}

export function usePrescriptions(patientId) {
  const [lastRx, setLastRx] = useState(null);

  const fetchLast = useCallback(async () => {
    try {
      const { data } = await api.get('/api/prescriptions/last', { params: { patient_id: patientId } });
      setLastRx(data);
    } catch {
      setLastRx(null);
    }
  }, [patientId]);

  useEffect(() => { if (patientId) fetchLast(); }, [patientId, fetchLast]);

  const createPrescription = useCallback(async (visitId, medicines) => {
    const { data } = await api.post('/api/prescriptions', {
      patient_id: patientId,
      visit_id: visitId,
      medicines,
    });
    setLastRx(data);
    return data;
  }, [patientId]);

  const sharePrescription = useCallback(async (rxId) => {
    await api.post(`/api/prescriptions/${rxId}/share`);
  }, []);

  return { lastRx, createPrescription, sharePrescription };
}

export function useQueue() {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    const { data } = await api.get('/api/queue/today');
    setTokens(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    reload();
    const interval = setInterval(reload, 15000); // simple polling, no websocket needed for MVP
    return () => clearInterval(interval);
  }, [reload]);

  const issueToken = useCallback(async (patientId) => {
    await api.post('/api/queue/token', { patient_id: patientId || null });
    reload();
  }, [reload]);

  const updateStatus = useCallback(async (tokenId, status) => {
    await api.patch(`/api/queue/token/${tokenId}`, { status });
    reload();
  }, [reload]);

  return { tokens, loading, issueToken, updateStatus };
}

export function useBilling(range = 'day') {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    const { data } = await api.get('/api/billing/summary', { params: { range } });
    setSummary(data);
    setLoading(false);
  }, [range]);

  useEffect(() => { reload(); }, [reload]);

  const recordPayment = useCallback(async (visitId, amount, paymentMode) => {
    await api.post('/api/billing', { visit_id: visitId, amount, payment_mode: paymentMode });
    reload();
  }, [reload]);

  return { summary, loading, recordPayment };
}
