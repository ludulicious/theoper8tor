<script setup lang="ts">
const route = useRoute();
const path = computed(
  () => decodeURIComponent(route.path).replace(/\/$/, "") || "/",
);
const { data: offer } = await useAsyncData(
  () => `offer-route:${path.value}`,
  () => queryCollection("offers").path(path.value).select("id").first(),
);
</script>
<template>
  <ContentPage v-if="offer" :key="$route.path" collection="offers" />
  <ContentPage v-else :key="$route.path" collection="booking" />
</template>
