// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import type { ComponentPropsWithoutRef, SyntheticEvent } from 'react';
import type { ProjectMeta } from '@/lib/content';

const three = vi.hoisted(() => ({ loads: 0 }));

vi.mock('three', () => {
  three.loads += 1;
  return {}; // incomplete on purpose: init() must fail soft, not reject
});
vi.mock('next/image', () => ({
  default: ({
    src,
    alt,
    onLoad,
  }: {
    src: string;
    alt: string;
    onLoad?: (e: SyntheticEvent<HTMLImageElement>) => void;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} onLoad={onLoad} />
  ),
}));
vi.mock('@/lib/useTier', () => ({ useTier: () => 'high' }));
vi.mock('next-intl', () => ({ useTranslations: () => (key: string) => key }));
vi.mock('@/i18n/navigation', () => ({
  Link: ({ href, ...props }: ComponentPropsWithoutRef<'a'>) => (
    <a href={href} {...props} />
  ),
}));

import { WorkRow } from './WorkRow';

const project: ProjectMeta = {
  slug: 'seller-panel',
  locale: 'en',
  fallback: false,
  title: 'Seller Panel',
  summary: 'A panel for sellers.',
  publishedAt: '2026-04-01',
  year: '2021-2026',
  images: ['/images/projects/seller/seller.png'],
  cover: '/images/projects/seller/seller.png',
  status: 'completed',
  role: 'Frontend lead',
  stack: ['Next.js', 'React', 'TypeScript', 'Redux'],
  featured: true,
  order: 1,
};

function stubPointer(fine: boolean) {
  window.matchMedia = vi
    .fn()
    .mockReturnValue({ matches: fine }) as unknown as typeof window.matchMedia;
}

const settle = () => new Promise((resolve) => setTimeout(resolve, 30));

afterEach(cleanup);

describe('WorkRow', () => {
  it('renders a decorative cover image (the heading names the link)', () => {
    const { container } = render(<WorkRow project={project} index={0} />);
    const img = container.querySelector('img');
    expect(img).not.toBeNull();
    expect(img?.getAttribute('alt')).toBe('');
    expect(img?.getAttribute('src')).toBe(project.cover);
    expect(screen.getByRole('heading', { name: 'Seller Panel' })).toBeTruthy();
  });

  it('links the whole row to the project page', () => {
    render(<WorkRow project={project} index={1} />);
    const link = screen.getByRole('link');
    expect(link.getAttribute('href')?.endsWith('/work/seller-panel')).toBe(
      true,
    );
  });

  it('shows only the first three stack items and no canvas before hover', () => {
    const { container } = render(<WorkRow project={project} index={2} />);
    expect(container.querySelector('canvas')).toBeNull();
    expect(screen.getByText('Next.js, React, TypeScript')).toBeTruthy();
  });

  it('creates no canvas and never loads three when the primary pointer is not fine', async () => {
    stubPointer(false);
    const { container } = render(<WorkRow project={project} index={0} />);
    fireEvent.load(container.querySelector('img')!);
    fireEvent.pointerEnter(container.querySelector('img')!.parentElement!, {
      pointerType: 'mouse',
    });
    await settle();
    expect(container.querySelector('canvas')).toBeNull();
    expect(three.loads).toBe(0);
  });

  it('ignores touch pointers even if the media query says fine', async () => {
    stubPointer(true);
    const { container } = render(<WorkRow project={project} index={0} />);
    fireEvent.load(container.querySelector('img')!);
    fireEvent.pointerEnter(container.querySelector('img')!.parentElement!, {
      pointerType: 'touch',
    });
    await settle();
    expect(container.querySelector('canvas')).toBeNull();
    expect(three.loads).toBe(0);
  });

  // Keep last: proves the guards above are what held three back, and that a failing
  // init (the mock has no WebGL) disposes quietly instead of rejecting.
  it('loads three on a fine-pointer hover and fails soft without WebGL', async () => {
    stubPointer(true);
    const { container } = render(<WorkRow project={project} index={0} />);
    fireEvent.load(container.querySelector('img')!);
    fireEvent.pointerEnter(container.querySelector('img')!.parentElement!, {
      pointerType: 'mouse',
    });
    await waitFor(() => expect(three.loads).toBe(1));
    await settle();
    expect(container.querySelector('canvas')).toBeNull();
  });
});
