import { getStandings, submitString, submitFile, resetStandings } from '../../lib/api';

describe('API helper functions', () => {
  const mockFetch = jest.fn();
  global.fetch = mockFetch;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getStandings returns successful response data', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: [{ name: 'Spain', mp: 1, w: 1, l: 0, p: 3 }] }),
    });

    const res = await getStandings();
    expect(mockFetch).toHaveBeenCalledWith('/api/standings');
    expect(res.success).toBe(true);
    expect(res.data[0].name).toBe('Spain');
  });

  it('getStandings throws error if fetch fails', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
    });

    await expect(getStandings()).rejects.toThrow('Failed to fetch standings');
  });

  it('submitString posts and returns standings data', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: [] }),
    });

    const res = await submitString('Spain;Germany;win');
    expect(mockFetch).toHaveBeenCalledWith('/api/submit/string', expect.objectContaining({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input: 'Spain;Germany;win' }),
    }));
    expect(res.success).toBe(true);
  });

  it('submitString throws error if fetch fails', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Invalid input syntax' }),
    });

    await expect(submitString('invalid')).rejects.toThrow('Invalid input syntax');
  });

  it('submitFile posts formData and returns standings data', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: [] }),
    });

    const file = new File(['Spain;Germany;win'], 'matches.txt', { type: 'text/plain' });
    const res = await submitFile(file);
    
    expect(mockFetch).toHaveBeenCalledWith('/api/submit/file', expect.objectContaining({
      method: 'POST',
      body: expect.any(FormData),
    }));
    expect(res.success).toBe(true);
  });

  it('submitFile throws error if fetch fails', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'File format not supported' }),
    });

    const file = new File([''], 'empty.txt');
    await expect(submitFile(file)).rejects.toThrow('File format not supported');
  });

  it('resetStandings posts delete and returns success', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    const res = await resetStandings();
    expect(mockFetch).toHaveBeenCalledWith('/api/reset', expect.objectContaining({
      method: 'DELETE',
    }));
    expect(res.success).toBe(true);
  });

  it('resetStandings throws error if fetch fails', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
    });

    await expect(resetStandings()).rejects.toThrow('Failed to reset standings');
  });
});
