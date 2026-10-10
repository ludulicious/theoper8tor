<script setup lang="ts">
defineProps<{
  image: string;
  alt: string;
  eyebrow?: string;
  position?: string;
  mobilePosition?: string;
}>();
</script>
<template>
  <section
    class="story-hero"
    :style="{
      '--photo-position': position,
      '--photo-mobile-position': mobilePosition,
    }"
  >
    <div class="story-hero-inner">
      <div class="story-hero-copy">
        <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
        <slot />
      </div>
      <div class="story-hero-image">
        <NuxtImg
          :src="image"
          :alt="alt"
          sizes="100vw 375:90vw 480:92vw md:40vw lg:40vw 1150:434px"
          densities="1x 2x"
          fit="outside"
          width="640"
          height="800"
          fetchpriority="high"
        />
      </div>
    </div>
  </section>
</template>
