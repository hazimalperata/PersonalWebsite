import type meta from "./messages/en/meta.json";
import type nav from "./messages/en/nav.json";
import type home from "./messages/en/home.json";
import type project from "./messages/en/project.json";
import type gallery from "./messages/en/gallery.json";
import type notFound from "./messages/en/notFound.json";
import type footer from "./messages/en/footer.json";
import type locale from "./messages/en/locale.json";
import type a11y from "./messages/en/a11y.json";
import type signal from "./messages/en/signal.json";

declare module "next-intl" {
  interface AppConfig {
    Messages: {
      meta: typeof meta;
      nav: typeof nav;
      home: typeof home;
      project: typeof project;
      gallery: typeof gallery;
      notFound: typeof notFound;
      footer: typeof footer;
      locale: typeof locale;
      a11y: typeof a11y;
      signal: typeof signal;
    };
    Locale: "en" | "tr";
  }
}
