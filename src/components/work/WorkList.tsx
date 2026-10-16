import { Link } from '@/i18n/navigation';
import type { ProjectMeta } from '@/lib/content';

export function WorkList({ projects }: { projects: ProjectMeta[] }) {
  return (
    <ul>
      {projects.map((project) => (
        <li key={project.slug} className="border-t border-fg-2/15">
          <Link
            href={`/work/${project.slug}`}
            className="-mx-3 grid grid-cols-[1fr_auto] gap-4 rounded-md px-3 py-4 transition-colors duration-200 hover:bg-bg-2 focus-visible:outline-2 focus-visible:outline-accent motion-reduce:transition-none md:grid-cols-[2fr_1fr_1fr]"
          >
            <span className="font-medium">{project.title}</span>
            <span className="text-fg-2">{project.year}</span>
            <span className="hidden text-fg-2 md:block">
              {project.stack.slice(0, 3).join(', ')}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
