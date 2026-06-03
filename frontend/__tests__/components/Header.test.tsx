import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from '../../components/Header';

describe('Header Component', () => {
  const defaultProps = {
    onReset: jest.fn(),
    loading: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders header text and description', () => {
    render(<Header {...defaultProps} />);
    
    // Check main title
    expect(screen.getByText('Football Tally')).toBeInTheDocument();
    expect(screen.getByText('⚽')).toBeInTheDocument();
    
    // Check description
    expect(screen.getByText('Track match results and standings')).toBeInTheDocument();
  });

  it('renders a reset button that triggers onReset', () => {
    render(<Header {...defaultProps} />);
    
    const resetBtn = screen.getByRole('button', { name: /reset/i });
    expect(resetBtn).toBeInTheDocument();
    
    fireEvent.click(resetBtn);
    expect(defaultProps.onReset).toHaveBeenCalledTimes(1);
  });

  it('disables the reset button when loading is true', () => {
    render(<Header {...defaultProps} loading={true} />);
    
    const resetBtn = screen.getByRole('button', { name: /reset/i });
    expect(resetBtn).toBeDisabled();
    
    fireEvent.click(resetBtn);
    expect(defaultProps.onReset).not.toHaveBeenCalled();
  });
});
