import { createClient } from "next-sanity";

export const client = createClient({
  projectId: "trlbkq4k",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});
