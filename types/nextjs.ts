export type NextPageProps<T = unknown, K = unknown> = {
  params: Promise<T>;
  searchParams: Promise<K>;
};
