import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  assignTagToSite,
  createTag,
  deleteTag,
  fetchSiteHistory,
  fetchSiteHistoryDetail,
  fetchSites,
  fetchTags,
  removeTagFromSite,
  updateTag,
} from "@/lib/api";
import { QUERY_KEYS } from "@/lib/constants";
import { useAuthStore } from "@/stores/authStore";

export function useSites() {
  return useQuery({
    queryKey: QUERY_KEYS.sites,
    queryFn: fetchSites,
  });
}

export function useSiteDetail(domain: string) {
  return useQuery({
    queryKey: ["site", domain],
    queryFn: () => fetchSiteHistory(domain),
    enabled: !!domain,
  });
}

export function useSiteVersion(domain: string, versionId: string) {
  return useQuery({
    queryKey: ["site", domain, "version", versionId],
    queryFn: () => fetchSiteHistoryDetail(domain, versionId),
    enabled: !!domain && !!versionId,
  });
}

export function useTags() {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: ["tags"],
    queryFn: fetchTags,
    enabled: !!token, // only fetch if logged in
  });
}
export function useCreateTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ name, color }: { name: string; color: string }) =>
      createTag(name, color),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tags"] }),
  });
}

export function useDeleteTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (tagId: string) => deleteTag(tagId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tags"] }),
  });
}

export function useAssignTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ tagId, siteId }: { tagId: string; siteId: string }) =>
      assignTagToSite(tagId, siteId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["sites"] }),
  });
}

export function useRemoveTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ tagId, siteId }: { tagId: string; siteId: string }) =>
      removeTagFromSite(tagId, siteId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["sites"] }),
  });
}

export function useUpdateTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      tagId,
      data,
    }: {
      tagId: string;
      data: { name?: string; color?: string };
    }) => updateTag(tagId, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tags"] }),
  });
}

export function useCompareSites(domains: string[]) {
  const q0 = useQuery({
    queryKey: ["site", domains[0]],
    queryFn: () => fetchSiteHistory(domains[0]),
    enabled: !!domains[0],
  });
  const q1 = useQuery({
    queryKey: ["site", domains[1]],
    queryFn: () => fetchSiteHistory(domains[1]),
    enabled: !!domains[1],
  });
  const q2 = useQuery({
    queryKey: ["site", domains[2]],
    queryFn: () => fetchSiteHistory(domains[2]),
    enabled: !!domains[2],
  });

  return [
    { domain: domains[0], query: q0 },
    { domain: domains[1], query: q1 },
    { domain: domains[2], query: q2 },
  ].filter((_, i) => i < domains.length);
}
