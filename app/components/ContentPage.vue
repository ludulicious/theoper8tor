<script setup lang="ts">
import { sharingImage } from "~~/shared/sharing-image.mjs";
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
const mainPage = computed(() =>
  page.value && "cta" in page.value ? page.value : null,
);
const breadcrumbs = computed(
  () =>
    page.value?.breadcrumbs || [
      { label: "Home", to: "/" },
      ...(props.collection === "offers"
        ? [{ label: "Book a session", to: "/book-a-session" }]
        : path.value.startsWith("/book-a-session/")
          ? [{ label: "Book a session", to: "/book-a-session" }]
          : path.value.startsWith("/resources/")
            ? [{ label: "Resources", to: "/resources" }]
            : props.collection === "blog"
              ? [{ label: "Blog", to: "/blog" }]
              : []),
      { label: page.value?.pageName || page.value?.title },
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
const { data: sharingMedia } = await useAsyncData("sharing-media", async () => {
  const [photos, videos] = await Promise.all([
    queryCollection("photos").all(),
    queryCollection("videos").all(),
  ]);
  return { photos, videos };
});
const socialImage = computed(() =>
  sharingImage(
    page.value,
    settings.value?.site,
    sharingMedia.value?.photos,
    sharingMedia.value?.videos,
  ),
);
useSeoMeta({
  title: () => page.value?.seoTitle || page.value?.title,
  description: () => page.value?.seoDescription || page.value?.description,
  ogTitle: () => page.value?.title,
  ogDescription: () => page.value?.seoDescription || page.value?.description,
  ogUrl: () => canonical.value,
  ogImage: () => socialImage.value?.src,
  ogImageAlt: () => socialImage.value?.alt,
  ogType: () => (page.value?.layout === "article" ? "article" : "website"),
  twitterImage: () => socialImage.value?.src,
  twitterImageAlt: () => socialImage.value?.alt,
  twitterTitle: () => page.value?.seoTitle || page.value?.title,
  twitterDescription: () =>
    page.value?.seoDescription || page.value?.description,
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
        'booking-page': path === '/book-a-session',
        'services-page': path === '/how-can-help',
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
    <MainPage v-if="mainPage" :page="mainPage" />
    <OfferPage v-else-if="collection === 'offers'" :path="path" />
    <DocumentPage v-else :page="page" />
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
