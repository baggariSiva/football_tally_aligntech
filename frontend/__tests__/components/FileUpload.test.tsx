import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FileUpload from '../../components/FileUpload';

describe('FileUpload Component', () => {
  const defaultProps = {
    onUpload: jest.fn(),
    loading: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly in initial state', () => {
    render(<FileUpload {...defaultProps} />);
    
    expect(screen.getByLabelText(/Upload Input File/i)).toBeInTheDocument();
    expect(screen.getByText('Choose a .txt file')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Upload File/i })).toBeDisabled();
  });

  it('handles file selection', () => {
    render(<FileUpload {...defaultProps} />);
    
    // Simulate selecting a file
    const file = new File(['Germany;Spain;win'], 'results.txt', { type: 'text/plain' });
    const fileInput = screen.getByLabelText(/Upload Input File/i);
    
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    expect(screen.getByText('results.txt')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Upload File/i })).not.toBeDisabled();
  });

  it('calls onUpload and clears local state on upload click', () => {
    render(<FileUpload {...defaultProps} />);
    
    const file = new File(['Germany;Spain;win'], 'results.txt', { type: 'text/plain' });
    const fileInput = screen.getByLabelText(/Upload Input File/i);
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    const uploadBtn = screen.getByRole('button', { name: /Upload File/i });
    fireEvent.click(uploadBtn);
    
    expect(defaultProps.onUpload).toHaveBeenCalledWith(file);
    expect(screen.getByText('Choose a .txt file')).toBeInTheDocument();
    expect(uploadBtn).toBeDisabled();
  });

  it('renders upload text as Uploading... when loading is true', () => {
    render(<FileUpload {...defaultProps} loading={true} />);
    
    expect(screen.getByRole('button', { name: /Uploading.../i })).toBeDisabled();
  });
});
