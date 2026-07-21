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

// query can be a plain string (name/phone search) or { token: 'N' } for
// today's token-number search.
export function usePatients(query = '') {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    const params = typeof query === 'object' ? query : (query ? { q: query } : {});
    const { data } = await api.get('/api/patients', { params });
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

  const updateVisitStatus = useCallback(async (visitId, status) => {
    const { data } = await api.patch(`/api/visits/${visitId}`, { status });
    return data;
  }, []);

  return { addVisit, updateVisitStatus };
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

  const createPrescription = useCallback(async (visitId, medicines, advice) => {
    const { data } = await api.post('/api/prescriptions', {
      patient_id: patientId,
      visit_id: visitId,
      medicines,
      advice,
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

  // billing can be { amount, payment_mode } (simple) or
  // { consultation_fee, other_charges, discount, payment_mode } (itemized)
  const recordPayment = useCallback(async (visitId, billing) => {
    await api.post('/api/billing', { visit_id: visitId, ...billing });
    reload();
  }, [reload]);

  const markPaid = useCallback(async (billingId) => {
    await api.patch(`/api/billing/${billingId}`, { payment_status: 'paid' });
    reload();
  }, [reload]);

  return { summary, loading, recordPayment, markPaid };
}

export function useReports(days = 7) {
  const [daily, setDaily] = useState([]);
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get('/api/reports/daily', { params: { days } }),
      api.get('/api/reports/pending-payments'),
    ]).then(([dailyRes, pendingRes]) => {
      setDaily(dailyRes.data);
      setPending(pendingRes.data);
      setLoading(false);
    });
  }, [days]);

  return { daily, pending, loading };
}
