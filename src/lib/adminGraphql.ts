import type { NhostClient } from "@nhost/nhost-js";

export async function adminRequest<T>(
  nhost: NhostClient,
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const res = await nhost.graphql.request<T>({ query, variables });
  if (!res.body.data) {
    throw new Error(res.body.errors?.[0]?.message ?? "GraphQL request failed");
  }
  return res.body.data;
}
