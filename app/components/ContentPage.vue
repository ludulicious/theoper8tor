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
const breadcrumbs = computed(
  () =>
    page.value?.breadcrumbs || [
      { label: "Home", to: "/" },
      ...(props.collection === "offers"
        ? [{ label: "Book Now", to: "/book-online" }]
        : []),
      { label: page.value?.title },
    ],
);
provide(
  "contentImageSizes",
  computed(() =>
    page.value?.layout === "article"
      ? "100vw 375:90vw 640:92vw 828:780px"
      : page.value?.sales
        ? "100vw 375:90vw 640:92vw 1150:1100px"
        : "100vw 375:90vw 640:92vw 1048:1000px",
  ),
);
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
        'services-page': collection === 'services',
        'sales-page': page.sales,
      },
    ]"
  >
    <nav v-if="path !== '/'" class="breadcrumb" aria-label="Breadcrumb">
      <template v-for="(item, index) in breadcrumbs" :key="index">
        <span v-if="index" aria-hidden="true">/</span>
        <NuxtLink
          v-if="item.to && index < breadcrumbs.length - 1"
          :to="item.to"
          >{{ item.label }}</NuxtLink
        >
        <span
          v-else
          :aria-current="index === breadcrumbs.length - 1 ? 'page' : undefined"
          >{{ item.label }}</span
        >
      </template>
    </nav>
    <OfferPage
      v-if="
        collection === 'offers' &&
        'kind' in page &&
        page.kind === 'consultation'
      "
      :path="path"
    />
    <ContentRenderer v-else :value="page" class="page-story" />
    <div v-if="page.layout === 'blog'" class="blog-grid">
      <article v-for="post in posts" :key="post.path">
        <NuxtLink :to="post.path"
          ><NuxtImg
            v-if="post.image"
            :src="post.image.src"
            :alt="post.image.alt"
            sizes="100vw 375:90vw 601:46vw 1050:483px"
            densities="1x 2x"
            width="966"
            height="544"
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
