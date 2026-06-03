import { Team, ApiResponse } from './types';

const BASE = '/api';

export async function getStandings(): Promise<ApiResponse<Team[]>> {
  const res = await fetch(`${BASE}/standings`);
  if (!res.ok) {
    throw new Error('Failed to fetch standings');
  }
  return res.json() as Promise<ApiResponse<Team[]>>;
}

export async function submitString(input: string): Promise<ApiResponse<Team[]>> {
  const res = await fetch(`${BASE}/submit/string`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ input }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to submit string');
  }
  return res.json() as Promise<ApiResponse<Team[]>>;
}

export async function submitFile(file: File): Promise<ApiResponse<Team[]>> {
  const form = new FormData();
  form.append('file', file);
  const res = await fetch(`${BASE}/submit/file`, {
    method: 'POST',
    body: form,
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to submit file');
  }
  return res.json() as Promise<ApiResponse<Team[]>>;
}

export async function resetStandings(): Promise<ApiResponse<void>> {
  const res = await fetch(`${BASE}/reset`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    throw new Error('Failed to reset standings');
  }
  return res.json() as Promise<ApiResponse<void>>;
}
