import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import Home from '../../app/page';
import * as api from '../../lib/api';

jest.mock('../../lib/api', () => ({
  getStandings: jest.fn(),
  submitString: jest.fn(),
  submitFile: jest.fn(),
  resetStandings: jest.fn(),
}));

describe('Home Page Component', () => {
  const mockStandings = [
    { name: 'Spain', mp: 1, w: 1, l: 0, p: 3 },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (api.getStandings as jest.Mock).mockResolvedValue({ success: true, data: mockStandings });
  });

  it('fetches and renders standings on mount', async () => {
    await act(async () => {
      render(<Home />);
    });
    
    expect(api.getStandings).toHaveBeenCalledTimes(1);
    expect(await screen.findByText('Spain')).toBeInTheDocument();
  });

  it('shows error toast if fetchStandings fails on mount', async () => {
    (api.getStandings as jest.Mock).mockRejectedValueOnce(new Error('Failed connection'));
    
    await act(async () => {
      render(<Home />);
    });

    expect(await screen.findByText('Failed connection')).toBeInTheDocument();
  });

  it('switches tabs between string input and file upload', async () => {
    await act(async () => {
      render(<Home />);
    });
    await screen.findByText('Spain');

    // Initially, string input tab should be active
    expect(screen.getByLabelText(/Enter Match Results/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/Upload Input File/i)).not.toBeInTheDocument();

    // Click "Upload File" tab
    const fileTabBtn = screen.getByRole('button', { name: /Upload File/i });
    fireEvent.click(fileTabBtn);

    // Now, file upload should be active
    expect(screen.getByLabelText(/Upload Input File/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/Enter Match Results/i)).not.toBeInTheDocument();
  });

  it('handles match string submission successfully', async () => {
    const updatedStandings = [
      ...mockStandings,
      { name: 'Germany', mp: 1, w: 0, l: 1, p: 0 },
    ];
    (api.submitString as jest.Mock).mockResolvedValue({ success: true, data: updatedStandings });

    await act(async () => {
      render(<Home />);
    });
    await screen.findByText('Spain');

    const textarea = screen.getByRole('textbox');
    const submitBtn = screen.getByRole('button', { name: /Submit Results/i });

    fireEvent.change(textarea, { target: { value: 'Germany;Spain;loss' } });
    
    await act(async () => {
      fireEvent.click(submitBtn);
    });

    expect(api.submitString).toHaveBeenCalledWith('Germany;Spain;loss');
    
    expect(await screen.findByText('Germany')).toBeInTheDocument();
    expect(screen.getByText('Results updated!')).toBeInTheDocument();
  });

  it('shows error toast when submitString fails', async () => {
    (api.submitString as jest.Mock).mockResolvedValueOnce({ success: false, message: 'Invalid parsing error' });
    
    await act(async () => {
      render(<Home />);
    });
    await screen.findByText('Spain');

    const textarea = screen.getByRole('textbox');
    const submitBtn = screen.getByRole('button', { name: /Submit Results/i });

    fireEvent.change(textarea, { target: { value: 'invalid line' } });
    
    await act(async () => {
      fireEvent.click(submitBtn);
    });

    expect(await screen.findByText('Invalid parsing error')).toBeInTheDocument();
  });

  it('shows unexpected error toast when submitString throws exception', async () => {
    (api.submitString as jest.Mock).mockRejectedValueOnce(new Error('Network error'));
    
    await act(async () => {
      render(<Home />);
    });
    await screen.findByText('Spain');

    const textarea = screen.getByRole('textbox');
    const submitBtn = screen.getByRole('button', { name: /Submit Results/i });

    fireEvent.change(textarea, { target: { value: 'Germany;Spain;win' } });
    
    await act(async () => {
      fireEvent.click(submitBtn);
    });

    expect(await screen.findByText('Network error')).toBeInTheDocument();
  });

  it('handles file upload successfully', async () => {
    (api.submitFile as jest.Mock).mockResolvedValueOnce({ success: true, data: mockStandings });

    await act(async () => {
      render(<Home />);
    });
    await screen.findByText('Spain');

    // Switch to file tab
    const fileTabBtn = screen.getByRole('button', { name: /Upload File/i });
    fireEvent.click(fileTabBtn);

    // Select file
    const file = new File(['Germany;Spain;win'], 'results.txt', { type: 'text/plain' });
    const fileInput = screen.getByLabelText(/Upload Input File/i);
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Submit
    const uploadBtn = document.getElementById('btn-upload-file') as HTMLButtonElement;
    await act(async () => {
      fireEvent.click(uploadBtn);
    });

    expect(api.submitFile).toHaveBeenCalledWith(file);
    expect(await screen.findByText('results.txt processed!')).toBeInTheDocument();
  });

  it('shows error toast when file upload fails', async () => {
    (api.submitFile as jest.Mock).mockResolvedValueOnce({ success: false, message: 'Bad file format' });

    await act(async () => {
      render(<Home />);
    });
    await screen.findByText('Spain');

    const fileTabBtn = screen.getByRole('button', { name: /Upload File/i });
    fireEvent.click(fileTabBtn);

    const file = new File([''], 'empty.txt');
    const fileInput = screen.getByLabelText(/Upload Input File/i);
    fireEvent.change(fileInput, { target: { files: [file] } });

    const uploadBtn = document.getElementById('btn-upload-file') as HTMLButtonElement;
    await act(async () => {
      fireEvent.click(uploadBtn);
    });

    expect(await screen.findByText('Bad file format')).toBeInTheDocument();
  });

  it('shows error toast when file upload throws unexpected error', async () => {
    (api.submitFile as jest.Mock).mockRejectedValueOnce(new Error('Internal upload fail'));

    await act(async () => {
      render(<Home />);
    });
    await screen.findByText('Spain');

    const fileTabBtn = screen.getByRole('button', { name: /Upload File/i });
    fireEvent.click(fileTabBtn);

    const file = new File([''], 'empty.txt');
    const fileInput = screen.getByLabelText(/Upload Input File/i);
    fireEvent.change(fileInput, { target: { files: [file] } });

    const uploadBtn = document.getElementById('btn-upload-file') as HTMLButtonElement;
    await act(async () => {
      fireEvent.click(uploadBtn);
    });

    expect(await screen.findByText('Internal upload fail')).toBeInTheDocument();
  });

  it('handles reset standings request after confirmation', async () => {
    // Mock window.confirm
    const confirmSpy = jest.spyOn(window, 'confirm').mockImplementation(() => true);
    (api.resetStandings as jest.Mock).mockResolvedValue({ success: true });

    await act(async () => {
      render(<Home />);
    });
    await screen.findByText('Spain');

    const resetBtn = screen.getByRole('button', { name: /Reset/i });
    
    await act(async () => {
      fireEvent.click(resetBtn);
    });

    expect(confirmSpy).toHaveBeenCalledWith('Reset all standings?');
    expect(api.resetStandings).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      expect(screen.queryByText('Spain')).not.toBeInTheDocument();
    });
    expect(screen.getByText('Standings reset')).toBeInTheDocument();

    confirmSpy.mockRestore();
  });

  it('cancels reset standings if confirmation is rejected', async () => {
    const confirmSpy = jest.spyOn(window, 'confirm').mockImplementation(() => false);
    
    await act(async () => {
      render(<Home />);
    });
    await screen.findByText('Spain');

    const resetBtn = screen.getByRole('button', { name: /Reset/i });
    
    await act(async () => {
      fireEvent.click(resetBtn);
    });

    expect(confirmSpy).toHaveBeenCalledWith('Reset all standings?');
    expect(api.resetStandings).not.toHaveBeenCalled();
    expect(screen.getByText('Spain')).toBeInTheDocument();

    confirmSpy.mockRestore();
  });

  it('shows error toast when reset standings api call fails', async () => {
    const confirmSpy = jest.spyOn(window, 'confirm').mockImplementation(() => true);
    (api.resetStandings as jest.Mock).mockRejectedValueOnce(new Error('Reset connection failure'));

    await act(async () => {
      render(<Home />);
    });
    await screen.findByText('Spain');

    const resetBtn = screen.getByRole('button', { name: /Reset/i });
    
    await act(async () => {
      fireEvent.click(resetBtn);
    });

    expect(await screen.findByText('Reset connection failure')).toBeInTheDocument();
    confirmSpy.mockRestore();
  });

  it('closes the toast notification automatically after 1 second', async () => {
    jest.useFakeTimers();
    (api.submitString as jest.Mock).mockResolvedValueOnce({ success: true, data: mockStandings });

    await act(async () => {
      render(<Home />);
    });
    await screen.findByText('Spain');

    const textarea = screen.getByRole('textbox');
    const submitBtn = screen.getByRole('button', { name: /Submit Results/i });
    fireEvent.change(textarea, { target: { value: 'Germany;Spain;win' } });
    
    await act(async () => {
      fireEvent.click(submitBtn);
    });

    // Toast is visible
    expect(screen.getByText('Results updated!')).toBeInTheDocument();

    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(1100);
    });

    // Toast should be gone
    expect(screen.queryByText('Results updated!')).not.toBeInTheDocument();

    jest.useRealTimers();
  });
});
