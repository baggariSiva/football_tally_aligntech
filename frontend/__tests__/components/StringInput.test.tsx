import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import StringInput from '../../components/StringInput';

describe('StringInput Component', () => {
  const defaultProps = {
    onSubmit: jest.fn(),
    loading: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<StringInput {...defaultProps} />);
    
    expect(screen.getByLabelText(/Enter Match Results/i)).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Submit Results/i })).toBeInTheDocument();
  });

  it('has a non-expandable textarea (resize-none class)', () => {
    render(<StringInput {...defaultProps} />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveClass('resize-none');
  });

  it('disables the submit button if textarea is empty or whitespace only', () => {
    render(<StringInput {...defaultProps} />);
    const submitBtn = screen.getByRole('button', { name: /Submit Results/i });
    const textarea = screen.getByRole('textbox');

    // Initial state (empty)
    expect(submitBtn).toBeDisabled();

    // Type spaces only
    fireEvent.change(textarea, { target: { value: '   ' } });
    expect(submitBtn).toBeDisabled();

    // Type text
    fireEvent.change(textarea, { target: { value: 'Germany;Spain;win' } });
    expect(submitBtn).not.toBeDisabled();
  });

  it('calls onSubmit with trimmed input on button click and clears input', () => {
    render(<StringInput {...defaultProps} />);
    const submitBtn = screen.getByRole('button', { name: /Submit Results/i });
    const textarea = screen.getByRole('textbox');

    fireEvent.change(textarea, { target: { value: '\n Germany;Spain;win \n' } });
    fireEvent.click(submitBtn);

    expect(defaultProps.onSubmit).toHaveBeenCalledWith('Germany;Spain;win');
    expect(textarea.value).toBe('');
  });

  it('disables the textarea and submit button when loading is true', () => {
    render(<StringInput {...defaultProps} loading={true} />);
    const submitBtn = screen.getByRole('button', { name: /Processing.../i });
    const textarea = screen.getByRole('textbox');

    expect(textarea).toBeDisabled();
    expect(submitBtn).toBeDisabled();
  });
});
