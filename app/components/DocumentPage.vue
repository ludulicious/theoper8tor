<script setup lang="ts">
import type { InformationCollectionItem } from "@nuxt/content";
defineProps<{
  page: Pick<
    InformationCollectionItem,
    "title" | "description" | "body" | "image" | "form" | "videoLibrary"
  > & {
    layout?: string;
    author?: string;
    date?: string;
  };
}>();
const imageSizes = inject<Ref<string>>(
  "contentImageSizes",
  ref("100vw 375:90vw 640:92vw 1048:1000px"),
);
</script>
<template>
  <div class="page-story">
    <section class="site-section">
      <div class="section-inner section-copy">
        <h1>{{ page.title }}</h1>
        <p v-if="page.layout === 'blog'">{{ page.description }}</p>
        <p v-if="'author' in page && page.author" class="article-meta">
          {{ page.author }}<span v-if="page.date"> · {{ page.date }}</span>
        </p>
        <NuxtImg
          v-if="'image' in page && page.image"
          :src="page.image.src"
          :alt="page.image.alt"
          :sizes="imageSizes"
          densities="1x 2x"
          loading="eager"
          class="article-image"
        />
        <ContentRenderer :value="page" />
        <ProviderEmbed
          v-if="'form' in page && page.form"
          :src="page.form.url"
          :title="page.form.title"
        />
        <VideoGallery v-if="'videoLibrary' in page && page.videoLibrary" />
      </div>
    </section>
  </div>
</template>
