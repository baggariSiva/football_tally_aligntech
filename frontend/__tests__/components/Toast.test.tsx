import React from 'react';
import { render, screen } from '@testing-library/react';
import Toast from '../../components/Toast';

describe('Toast Component', () => {
  it('renders success toast with correct styling', () => {
    render(<Toast msg="Success message" type="success" />);
    
    const toast = screen.getByText('Success message');
    expect(toast).toBeInTheDocument();
    expect(toast).toHaveClass('bg-emerald-50');
  });

  it('renders error toast with correct styling', () => {
    render(<Toast msg="Error message" type="error" />);
    
    const toast = screen.getByText('Error message');
    expect(toast).toBeInTheDocument();
    expect(toast).toHaveClass('bg-red-50');
  });
});
