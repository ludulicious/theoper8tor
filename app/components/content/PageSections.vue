<script setup lang="ts">
import type { PageSection, SectionPage } from "~/types/sections";
const page = inject<Ref<SectionPage | null>>("sectionPage");
const sections = computed(() =>
  (page?.value?.studio?.blocks || [])
    .map((block) => ({
      ...block,
      content: page?.value?.[block.field] as PageSection,
    }))
    .filter((block) => block.content && block.content.visible !== false),
);
const isSplit = (section: PageSection) =>
  section.layout === "hero" || section.layout === "photo";
const imageSizes = (section: PageSection) =>
  section.layout === "photo"
    ? "100vw 375:90vw 480:440px md:40vw lg:40vw 1150:441px"
    : "100vw 375:90vw 480:92vw md:40vw lg:40vw 1150:441px";
const contentSizes = inject<Ref<string>>(
  "contentImageSizes",
  ref("100vw 375:90vw 640:92vw 1048:1000px"),
);
</script>
<template>
  <section
    v-for="section in sections"
    :key="section.id"
    :class="[
      'editable-section',
      section.content.layout === 'hero'
        ? 'story-hero'
        : section.content.layout === 'photo'
          ? 'photo-story'
          : 'site-section',
    ]"
    :style="{
      '--photo-position': section.content.position,
      '--photo-mobile-position': section.content.mobilePosition,
    }"
  >
    <div
      :class="
        section.content.layout === 'hero'
          ? 'story-hero-inner'
          : section.content.layout === 'photo'
            ? 'photo-story-inner'
            : 'section-inner'
      "
    >
      <div
        :class="
          section.content.layout === 'hero'
            ? 'story-hero-copy'
            : section.content.layout === 'photo'
              ? 'photo-story-copy'
              : 'section-copy'
        "
      >
        <p v-if="section.content.eyebrow" class="eyebrow">
          {{ section.content.eyebrow }}
        </p>
        <component
          :is="section.content.level === 1 ? 'h1' : 'h2'"
          v-if="section.content.title"
          :id="section.id"
          >{{ section.content.title }}</component
        >
        <slot :name="section.slot" />
        <div v-if="section.content.actions?.length" class="section-actions">
          <NuxtLink
            v-for="action in section.content.actions"
            :key="action.to"
            :to="action.to"
            class="action-link"
            >{{ action.label }}</NuxtLink
          >
        </div>
        <OfferList
          v-if="section.content.sessions"
          :featured="section.content.sessions.featuredOnly"
        />
        <ProviderEmbed
          v-if="section.content.form"
          :src="section.content.form.src"
          :title="section.content.form.title"
          :kind="section.content.form.kind"
        />
        <VideoGallery v-if="section.content.videoLibrary" />
        <VideoPlayer
          v-if="section.content.video"
          :video="section.content.video"
        />
        <div
          v-if="
            (!isSplit(section.content) && section.content.image) ||
            section.content.images?.length
          "
          class="section-images"
        >
          <component
            :is="image.to ? resolveComponent('NuxtLink') : 'div'"
            v-for="image in [
              ...(!isSplit(section.content) && section.content.image
                ? [section.content.image]
                : []),
              ...(section.content.images || []),
            ]"
            :key="image.src"
            :to="image.to"
          >
            <NuxtImg
              :src="image.src"
              :alt="image.alt"
              :sizes="contentSizes"
              densities="1x 2x"
              loading="lazy"
            />
          </component>
        </div>
        <p
          v-for="link in section.content.links"
          :key="link.to"
          class="section-text-link"
        >
          <NuxtLink :to="link.to">{{ link.label }}</NuxtLink>
        </p>
      </div>
      <div
        v-if="isSplit(section.content) && section.content.image"
        :class="
          section.content.layout === 'hero'
            ? 'story-hero-image'
            : 'photo-story-image'
        "
      >
        <NuxtImg
          :src="section.content.image.src"
          :alt="section.content.image.alt"
          :sizes="imageSizes(section.content)"
          densities="1x 2x"
          width="640"
          height="800"
          fit="outside"
          :loading="section.content.layout === 'hero' ? 'eager' : 'lazy'"
          :fetchpriority="
            section.content.layout === 'hero' ? 'high' : undefined
          "
        />
      </div>
    </div>
  </section>
</template>
