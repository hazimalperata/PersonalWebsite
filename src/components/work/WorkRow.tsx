import { ViewTransition } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/cn';
import type { ProjectMeta } from '@/lib/content';
import { textLinkClass } from '@/components/ui/TextLink';
import { DistortImage } from './DistortImage';

const ASPECTS = ['aspect-[16/10]', 'aspect-[4/3]', 'aspect-[3/2]'] as const;

export function WorkRow({
  project,
  index,
}: {
  project: ProjectMeta;
  index: number;
}) {
  const t = useTranslations('work');
  const flipped = index % 2 === 1;

  return (
    <Link
      href={`/work/${project.slug}`}
      className="group grid gap-6 border-t border-fg-2/15 py-10 first:border-t-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent md:py-14 lg:grid-cols-12 lg:items-end"
    >
      <ViewTransition name={`project-${project.slug}`}>
        <DistortImage
          src={project.cover}
          alt=""
          sizes="(min-width:1024px) 58vw, 100vw"
          className={cn(
            'lg:col-span-7',
            ASPECTS[index % 3],
            flipped && 'lg:col-start-6',
          )}
        />
      </ViewTransition>
      <div
        className={cn(
          'lg:col-span-5',
          flipped && 'lg:col-start-1 lg:row-start-1',
        )}
      >
        <h3 className="font-display text-2xl md:text-3xl">{project.title}</h3>
        <p className="mt-3 max-w-[40ch] text-fg-2">{project.summary}</p>
        <div className="mt-4 flex gap-4 text-xs text-fg-2">
          <span>{project.year}</span>
          <span>{project.stack.slice(0, 3).join(', ')}</span>
        </div>
        <span
          className={cn(
            textLinkClass,
            'mt-6 inline-block group-hover:decoration-fg',
          )}
        >
          {t('view')}
        </span>
      </div>
    </Link>
  );
}
