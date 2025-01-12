import * as LucideIcons from "lucide-react";

export type LucideIconKey = keyof typeof LucideIcons;

export type Blog = {
  subBlogs: SubBlog[];
  title: string;
  slug: SanitySlug;
  icon: SanityIcon;
} & SanityCustomDocument;

export type SubBlog = {
  title: string;
  description: string;
  slug: SanitySlug;
  imageUrl: string;
  imageAlt: string;
  parentBlog: SanityRef;
  parentBlogTitle: string;
  parentBlogSlug: string;
  articles: Article[];
  _translations: SanitySubBlogTranslation[];
} & SanityCustomDocument;

export type Article = {
  title: string;
  description: string;
  slug: SanitySlug;
  imageAlt: string;
  imageUrl: string;
  parentSubBlogSlug: string;
  parentSubBlogTitle: string;
  publishedAt: string;
  body: any;
  _translations: SanityArticleTranslation[];
} & SanityCustomDocument;

export type SanityCustomDocument = {
  _id: string;
};

export type SanitySlug = {
  current: string;
};

export type SanityIcon = {
  name: LucideIconKey;
  provider: string;
};

export type SanityRef = {
  _ref: string;
};

export type SanityTranslation = {
  slug: SanitySlug;
  locale: string;
};

export type SanitySubBlogTranslation = SanityTranslation;

export type SanityArticleTranslation = {
  parentSubBlogSlug: string;
} & SanityTranslation;

export type SanityImage = {
  alt: string;
  asset: SanityRef;
};
