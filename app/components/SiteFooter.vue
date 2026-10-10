<script setup lang="ts">
const { data } = await useSiteContent();
const logo = computed(
  () => data.value?.site?.footerLogo || data.value?.site?.logo,
);
</script>
<template>
  <footer class="site-footer">
    <div class="footer-inner">
      <NuxtLink to="/" class="footer-brand"
        ><NuxtImg
          v-if="logo"
          :src="logo.src"
          :alt="logo.alt"
          sizes="240px"
          densities="1x 2x"
          loading="lazy"
          width="312"
          height="128"
      /></NuxtLink>
      <nav aria-label="Footer">
        <NuxtLink
          v-for="link in data?.site?.footerLinks"
          :key="link.to"
          :to="link.to"
          >{{ link.label }}</NuxtLink
        >
      </nav>
      <nav aria-label="Social media">
        <a
          v-for="link in data?.site?.socialLinks"
          :key="link.to"
          :href="link.to"
          rel="me"
          >{{ link.label }}</a
        >
      </nav>
      <a v-if="data?.site?.phone" :href="`tel:${data.site.phoneLink}`">{{
        data.site.phone
      }}</a>
      <a v-if="data?.site?.email" :href="`mailto:${data.site.email}`">{{
        data.site.email
      }}</a>
      <p class="copyright">{{ data?.site?.copyright }}</p>
    </div>
  </footer>
</template>
