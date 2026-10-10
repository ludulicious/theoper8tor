<script setup lang="ts">
const { data } = await useSiteContent();
useHead({
  titleTemplate: (title) =>
    title && title !== data.value?.site?.name
      ? `${title} | ${data.value?.site?.name || "The Oper8tor"}`
      : "The Oper8tor",
});
</script>
<template>
  <UApp>
    <a class="skip-link" href="#main-content">{{ data?.site?.skipLink }}</a>
    <SiteHeader />
    <NuxtPage />
    <SiteFooter />
  </UApp>
</template>
