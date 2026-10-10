<script setup lang="ts">
import { pageSources } from "~~/shared/content-sources.mjs";
const route = useRoute();
const path = computed(
  () => decodeURIComponent(route.path).replace(/\/$/, "") || "/",
);
const collections = Object.keys(pageSources).filter(
  (key) => key !== "home",
) as (keyof typeof pageSources)[];
const { data: found } = await useAsyncData(
  () => `collection:${path.value}`,
  async () => {
    const matches = await Promise.all(
      collections.map(async (collection) => {
        const page = await queryCollection(collection)
          .path(path.value)
          .select("path")
          .first();
        return page ? collection : null;
      }),
    );
    return matches.find(Boolean) || null;
  },
);
if (!found.value)
  throw createError({ statusCode: 404, statusMessage: "Page not found" });
</script>
<template>
  <ContentPage v-if="found" :key="`${found}:${path}`" :collection="found" />
</template>
