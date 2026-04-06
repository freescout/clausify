import { useQuery } from "@tanstack/react-query";
import {
  fetchSiteHistory,
  fetchSiteHistoryDetail,
  fetchSites,
} from "@/lib/api";
import { QUERY_KEYS } from "@/lib/constants";

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
