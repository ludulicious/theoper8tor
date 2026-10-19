<script setup lang="ts">
const route = useRoute();
const path = computed(
  () => decodeURIComponent(route.path).replace(/\/$/, "") || "/",
);
const { data: mainPage } = await useAsyncData(
  () => `main-page-route:${path.value}`,
  () => queryCollection("content").path(path.value).select("id").first(),
);
</script>
<template>
  <ContentPage v-if="mainPage" :key="$route.path" collection="content" />
  <ContentPage v-else :key="$route.path" collection="information" />
</template>
