export type NextPageProps<T = never, K = never> = {
  params: Promise<T>;
  searchParams: Promise<K>;
};
