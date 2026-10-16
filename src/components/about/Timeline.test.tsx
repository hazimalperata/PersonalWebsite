// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import { profile } from '@/data/profile';
import { Timeline } from './Timeline';

afterEach(cleanup);

describe('Timeline', () => {
  it('renders one entry per job with a two-digit sequence number', () => {
    render(
      <Timeline items={profile.experience} locale="en" presentLabel="Present" />,
    );
    expect(screen.getAllByRole('heading', { level: 4 })).toHaveLength(3);
    for (const n of ['01', '02', '03']) {
      expect(screen.getByText(n)).toBeTruthy();
    }
  });

  it('shows the present label when `to` is null', () => {
    render(
      <Timeline items={profile.experience} locale="en" presentLabel="Present" />,
    );
    const current = screen.getByText('1likte').closest('li');
    expect(current).not.toBeNull();
    expect(within(current as HTMLElement).getByText(/Present/)).toBeTruthy();
    const past = screen.getByText('Baykar').closest('li');
    expect(within(past as HTMLElement).queryByText(/Present/)).toBeNull();
  });

  // Needs full ICU data (Node ships it by default): short month names come from the tr locale.
  it('formats month dates for the locale and uses an en dash', () => {
    render(
      <Timeline items={profile.experience} locale="tr" presentLabel="Günümüz" />,
    );
    const past = screen.getByText('Baykar').closest('li') as HTMLElement;
    expect(within(past).getByText(/Ağu 2023 – Eki 2023/)).toBeTruthy();
  });

  it('lists at most five points per entry', () => {
    const many = {
      ...profile.experience[0],
      points: Array.from({ length: 8 }, (_, i) => ({
        en: `point ${i}`,
        tr: `madde ${i}`,
      })),
    };
    render(<Timeline items={[many]} locale="en" presentLabel="Present" />);
    expect(screen.getAllByText(/^point \d$/)).toHaveLength(5);
  });
});
