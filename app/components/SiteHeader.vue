<script setup lang="ts">
const { data } = await useSiteContent();
const logo = computed(
  () => data.value?.site?.headerLogo || data.value?.site?.logo,
);
const open = ref(false);
const route = useRoute();
watch(
  () => route.path,
  () => {
    open.value = false;
  },
);
function escape(event: KeyboardEvent) {
  if (event.key === "Escape") open.value = false;
}
</script>
<template>
  <header class="site-header" @keydown="escape">
    <div class="header-inner">
      <NuxtLink to="/" class="brand" :aria-label="data?.site?.name"
        ><NuxtImg
          v-if="logo"
          :src="logo.src"
          :alt="logo.alt"
          sizes="46vw 435:200px"
          densities="1x 2x"
          width="312"
          height="128"
      /></NuxtLink>
      <button
        class="menu-toggle"
        :aria-expanded="open"
        aria-controls="main-navigation"
        @click="open = !open"
      >
        {{ open ? data?.menu?.closeLabel : data?.menu?.openLabel }}
        <span aria-hidden="true">{{ open ? "×" : "☰" }}</span>
      </button>
      <nav id="main-navigation" aria-label="Main navigation" :class="{ open }">
        <NuxtLink
          v-for="item in data?.menu?.items"
          :key="item.to"
          :to="item.to"
          :aria-current="route.path === item.to ? 'page' : undefined"
          >{{ item.label }}</NuxtLink
        >
        <NuxtLink
          v-if="data?.menu?.action"
          class="connect-link"
          :to="data.menu.action.to"
          >{{ data.menu.action.label }}</NuxtLink
        >
      </nav>
    </div>
  </header>
</template>
