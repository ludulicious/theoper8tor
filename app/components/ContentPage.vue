<script setup lang="ts">
import { pageSources } from "~~/shared/content-sources.mjs";
const props = defineProps<{ collection: keyof typeof pageSources }>();
const route = useRoute();
const path = computed(
  () => decodeURIComponent(route.path).replace(/\/$/, "") || "/",
);
const { data: settings } = await useSiteContent();
const { data: page } = await useAsyncData(
  () => `page:${props.collection}:${path.value}`,
  () => queryCollection(props.collection).path(path.value).first(),
);
if (!page.value)
  throw createError({ statusCode: 404, statusMessage: "Page not found" });
const canonical = computed(
  () =>
    `${settings.value?.site?.url || "https://theoper8tor.com"}${encodeURI(path.value)}`,
);
useSeoMeta({
  title: () => page.value?.seoTitle || page.value?.title,
  description: () => page.value?.description,
  ogTitle: () => page.value?.title,
  ogDescription: () => page.value?.description,
  ogUrl: () => canonical.value,
  ogImage: () =>
    `${settings.value?.site?.url}${settings.value?.site?.logo.src}`,
  ogLocale: "en_US",
  twitterCard: "summary_large_image",
});
useHead({ link: [{ rel: "canonical", href: canonical }] });
const { data: posts } = await useAsyncData("blog-list", () =>
  queryCollection("blog").order("stem", "ASC").all(),
);
</script>
<template>
  <main
    v-if="page"
    id="main-content"
    :class="[
      'page',
      {
        'home-page': path === '/',
        'article-page': page.layout === 'article',
        'booking-page': path === '/book-online',
      },
    ]"
  >
    <div v-if="path !== '/'" class="breadcrumb">
      <NuxtLink to="/">Home</NuxtLink><span aria-hidden="true">/</span
      ><span>{{ page.title }}</span>
    </div>
    <ContentRenderer :value="page" class="page-story" />
    <div v-if="page.layout === 'blog'" class="blog-grid">
      <article v-for="post in posts" :key="post.path">
        <NuxtLink :to="post.path"
          ><img
            v-if="post.image"
            :src="post.image.src"
            :alt="post.image.alt"
            loading="lazy"
          />
          <h2>{{ post.title }}</h2></NuxtLink
        >
        <p>{{ post.description }}</p>
        <NuxtLink :to="post.path"
          >{{ settings?.site?.readMore }}
          <span class="sr-only">{{ post.title }}</span
          ><span aria-hidden="true"> →</span></NuxtLink
        >
      </article>
    </div>
    <p v-if="page.layout === 'article'" class="article-back">
      <NuxtLink to="/blog">← {{ settings?.site?.backLabel }}</NuxtLink>
    </p>
  </main>
</template>
