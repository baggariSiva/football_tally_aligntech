import React from 'react';
import { render, screen, within } from '@testing-library/react';
import StandingsTable from '../../components/StandingsTable';
import { Team } from '../../lib/types';

describe('StandingsTable Component', () => {
  it('renders empty state when there are no standings', () => {
    render(<StandingsTable standings={[]} />);
    
    expect(screen.getByText('No Standings Yet')).toBeInTheDocument();
    expect(screen.getByText(/Submit some match results/i)).toBeInTheDocument();
  });

  it('renders the standings leaderboard correctly', () => {
    const mockStandings: Team[] = [
      { name: 'Spain', mp: 3, w: 2, l: 1, p: 6 },
      { name: 'Germany', mp: 3, w: 1, l: 2, p: 3 },
    ];

    render(<StandingsTable standings={mockStandings} />);

    // Check table headers
    expect(screen.getByRole('columnheader', { name: '#' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Team' })).toBeInTheDocument();
    expect(screen.getByTitle('Matches Played')).toBeInTheDocument();
    expect(screen.getByTitle('Wins')).toBeInTheDocument();
    expect(screen.getByTitle('Losses')).toBeInTheDocument();
    expect(screen.getByTitle('Points')).toBeInTheDocument();

    // Check rows data
    expect(screen.getByText('Spain')).toBeInTheDocument();
    expect(screen.getByText('Germany')).toBeInTheDocument();

    // Check Spain statistics
    const spainRow = screen.getByText('Spain').closest('tr');
    expect(spainRow).toHaveTextContent('3'); // mp
    expect(spainRow).toHaveTextContent('2'); // w
    expect(spainRow).toHaveTextContent('1'); // l
    expect(spainRow).toHaveTextContent('6'); // p

    const germanyRow = screen.getByText('Germany').closest('tr');
    expect(germanyRow).toHaveTextContent('3'); // mp
    expect(germanyRow).toHaveTextContent('1'); // w
    expect(germanyRow).toHaveTextContent('2'); // l
    expect(germanyRow).toHaveTextContent('3'); // p
  });

  it('renders specific highlight styling/badge for first place team', () => {
    const mockStandings: Team[] = [
      { name: 'Spain', mp: 3, w: 2, l: 1, p: 6 },
      { name: 'Germany', mp: 3, w: 1, l: 2, p: 3 },
    ];

    render(<StandingsTable standings={mockStandings} />);

    const spainRow = screen.getByText('Spain').closest('tr');
    const germanyRow = screen.getByText('Germany').closest('tr');

    // Spain (index 0) is top team, so the row should have amber style classes
    expect(spainRow).toHaveClass('bg-amber-50/30');

    // Germany (index 1) is not top team, so the row should not have amber style classes
    expect(germanyRow).not.toHaveClass('bg-amber-50/30');

    // First place gets a circular badge styled container
    const firstPlaceBadge = within(spainRow!).getByText('1', { selector: 'span' });
    expect(firstPlaceBadge).toHaveClass('bg-amber-100');

    // Second place just shows plain number
    const secondPlaceRank = within(germanyRow!).getByText('2', { selector: 'span' });
    expect(secondPlaceRank).toHaveClass('text-slate-400');
  });
});
