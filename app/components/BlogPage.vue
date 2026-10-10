<script setup lang="ts">
import type {
  BlogCollectionItem,
  BlogIndexCollectionItem,
} from "@nuxt/content";
defineProps<{ page: BlogCollectionItem | BlogIndexCollectionItem }>();
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
          sizes="100vw 375:90vw 640:92vw 828:780px"
          densities="1x 2x"
          loading="eager"
          class="article-image"
        />
        <ContentRenderer :value="page" />
      </div>
    </section>
  </div>
</template>
