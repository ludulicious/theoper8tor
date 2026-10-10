<script setup lang="ts">
import type {
  ContentCollectionItem,
  PhotosCollectionItem,
} from "@nuxt/content";
const props = defineProps<{
  page: ContentCollectionItem;
  photos?: PhotosCollectionItem[];
}>();
const thumbnail = computed(
  () =>
    props.photos?.find((photo) => photo.image.src === props.page.image?.src)
      ?.thumbnail,
);
const image = useImage();
const mobileImage = computed(() =>
  thumbnail.value
    ? image.getSizes(thumbnail.value.src, {
        sizes: "100vw 375:90vw 480:92vw",
        densities: "1x 2x",
      })
    : null,
);
</script>
<template>
  <div class="main-page-content">
    <section
      class="story-hero main-introduction"
      :class="{ 'without-image': !page.image }"
      :style="{
        '--photo-position': page.imagePosition,
        '--photo-mobile-position': page.mobileImagePosition,
      }"
    >
      <div class="story-hero-inner">
        <div class="story-hero-copy">
          <p class="eyebrow">{{ page.eyebrow }}</p>
          <h1>{{ page.title }}</h1>
          <p>{{ page.description }}</p>
          <div class="section-actions">
            <NuxtLink :to="page.cta.to" class="action-link">{{
              page.cta.label
            }}</NuxtLink>
          </div>
          <p class="section-text-link">
            <NuxtLink :to="page.secondaryCta.to">{{
              page.secondaryCta.label
            }}</NuxtLink>
          </p>
        </div>
        <picture v-if="page.image" class="story-hero-image">
          <source
            v-if="mobileImage"
            media="(max-width: 767px)"
            :srcset="mobileImage.srcset"
            :sizes="mobileImage.sizes"
          />
          <NuxtImg
            :src="page.image.src"
            :alt="page.image.alt"
            sizes="100vw 375:90vw 480:92vw md:40vw lg:40vw 1150:441px"
            densities="1x 2x"
            loading="eager"
            fetchpriority="high"
          />
        </picture>
      </div>
    </section>
    <section v-if="page.sessions" id="sessions" class="site-section">
      <div class="section-inner">
        <h2>{{ page.sessions.title }}</h2>
        <p v-if="page.sessions.description">{{ page.sessions.description }}</p>
        <OfferList :featured="page.sessions.featuredOnly" />
        <p v-if="page.sessions.cta" class="section-text-link">
          <NuxtLink :to="page.sessions.cta.to">{{
            page.sessions.cta.label
          }}</NuxtLink>
        </p>
      </div>
    </section>
    <section v-if="page.body" class="site-section main-story">
      <div class="section-inner">
        <ContentRenderer :value="page" class="section-copy" />
      </div>
    </section>
    <section v-if="page.contactForm" class="site-section">
      <div class="section-inner">
        <ProviderEmbed
          :src="page.contactForm.src"
          :title="page.contactForm.title"
          :kind="page.contactForm.kind"
        />
      </div>
    </section>
  </div>
</template>
