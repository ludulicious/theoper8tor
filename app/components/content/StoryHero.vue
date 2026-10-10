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
        <img
          :src="image"
          :alt="alt"
          width="640"
          height="800"
          fetchpriority="high"
        />
      </div>
    </div>
  </section>
</template>
