import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { ProjectMeta } from "@/lib/content";

type NavTarget = Pick<ProjectMeta, "slug" | "title">;

function NavLink({ project, label, align }: { project: NavTarget; label: string; align: "start" | "end" }) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className={`group block rounded-sm py-1 ${align === "end" ? "text-right" : "text-left"}`}
    >
      <span className="block text-sm text-fg/80">{label}</span>
      <span className="mt-1 block font-display text-xl font-semibold transition-colors duration-200 ease-out group-hover:text-accent motion-reduce:transition-none">
        {project.title}
      </span>
    </Link>
  );
}

export async function ProjectNav({ prev, next }: { prev: NavTarget; next: NavTarget }) {
  const t = await getTranslations("project");
  return (
    <nav aria-label={t("more")} className="mt-16 grid max-w-3xl grid-cols-2 gap-6 rounded-2xl border border-fg/10 bg-bg/80 p-6 backdrop-blur-md">
      <NavLink project={prev} label={t("prev")} align="start" />
      <NavLink project={next} label={t("next")} align="end" />
    </nav>
  );
}
