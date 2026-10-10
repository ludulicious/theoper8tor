<script setup lang="ts">
const { data } = await useSiteContent();
</script>
<template>
  <footer class="site-footer">
    <div class="footer-inner">
      <NuxtLink to="/" class="footer-brand"
        ><img
          v-if="data?.site?.logo"
          :src="data.site.logo.src"
          :alt="data.site.logo.alt"
          width="120"
          height="65"
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
