// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import type { ComponentPropsWithoutRef } from 'react';

// Mimics next-intl's Link under the `tr` locale: route paths get the locale prefix.
vi.mock('@/i18n/navigation', () => ({
  Link: ({ href, ...props }: ComponentPropsWithoutRef<'a'>) => (
    <a href={`/tr${href === '/' ? '' : href}`} {...props} />
  ),
}));

import { Button } from './Button';

afterEach(cleanup);

describe('Button', () => {
  it('keeps file hrefs untouched (no locale prefix) and passes download through', () => {
    render(
      <Button href="/Hazim_Alper_Ata-TR-CV.pdf" download>
        CV
      </Button>,
    );
    const a = screen.getByRole('link', { name: 'CV' });
    expect(a.getAttribute('href')).toBe('/Hazim_Alper_Ata-TR-CV.pdf');
    expect(a.hasAttribute('download')).toBe(true);
    expect(a.getAttribute('target')).toBeNull();
  });

  it('ignores a query or hash when detecting file hrefs', () => {
    render(<Button href="/x.pdf?v=2#page=3">file</Button>);
    expect(screen.getByRole('link', { name: 'file' }).getAttribute('href')).toBe(
      '/x.pdf?v=2#page=3',
    );
  });

  it('routes internal paths through the locale-aware Link', () => {
    render(<Button href="/#contact">Say hi</Button>);
    expect(screen.getByRole('link', { name: 'Say hi' }).getAttribute('href')).toBe(
      '/tr/#contact',
    );
  });

  it('opens external URLs in a new tab', () => {
    render(<Button href="https://example.com/a.pdf">ext</Button>);
    const a = screen.getByRole('link', { name: 'ext' });
    expect(a.getAttribute('target')).toBe('_blank');
    expect(a.getAttribute('href')).toBe('https://example.com/a.pdf');
  });
});
