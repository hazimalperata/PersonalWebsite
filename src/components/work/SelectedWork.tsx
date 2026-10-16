import { useTranslations } from 'next-intl';
import { Section } from '@/components/ui/Section';
import type { ProjectMeta } from '@/lib/content';
import { WorkList } from './WorkList';
import { WorkRow } from './WorkRow';

export function SelectedWork({ projects }: { projects: ProjectMeta[] }) {
  const t = useTranslations();
  const featured = projects.filter((project) => project.featured);
  const rest = projects.filter((project) => !project.featured);

  return (
    <Section id="work" title={t('work.title')} className="relative z-10">
      <div>
        {featured.map((project, index) => (
          <WorkRow key={project.slug} project={project} index={index} />
        ))}
      </div>
      {rest.length > 0 && (
        <>
          <h3 className="mt-24 mb-6 font-display text-xl">{t('work.all')}</h3>
          <WorkList projects={rest} />
        </>
      )}
    </Section>
  );
}
