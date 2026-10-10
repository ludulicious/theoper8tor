export function useSiteContent() {
  return useAsyncData("site-settings", async () => {
    const [site, menu] = await Promise.all([
      queryCollection("site").first(),
      queryCollection("menu").first(),
    ]);
    return { site, menu };
  });
}
