export type NextPagePropsWithSearchParams<T = never> = {
  params: Promise<T>;
  searchParams:
    | Promise<{ [key: string]: string | string[] | undefined }>
    | never;
};

export type GenerateStaticParamsProps<T = { locale: string }> = {
  params: Promise<T>;
};
