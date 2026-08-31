const ROOT_DOMAINS = ["lvh.me", "gastrohub.com"];

export function extractSlug(hostname: string): string | null {
  const rootMatch = ROOT_DOMAINS.find(
    (root) => hostname === root || hostname === `www.${root}`,
  );

  if (rootMatch) {
    return null;
  }

  const rootWithSubdomain = ROOT_DOMAINS.find((root) =>
    hostname.endsWith(`.${root}`),
  );

  if (!rootWithSubdomain) {
    return null;
  }

  return hostname.replace(`.${rootWithSubdomain}`, "");
}
