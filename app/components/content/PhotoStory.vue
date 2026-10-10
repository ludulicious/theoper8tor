<script setup lang="ts">
defineProps<{ image: string; alt: string }>();
</script>
<template>
  <section class="photo-story">
    <div class="photo-story-inner">
      <div class="photo-story-image">
        <NuxtImg
          :src="image"
          :alt="alt"
          sizes="100vw 375:90vw 480:440px md:40vw lg:40vw 1150:427px"
          densities="1x 2x"
          fit="outside"
          width="640"
          height="800"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div class="photo-story-copy"><slot /></div>
    </div>
  </section>
</template>
