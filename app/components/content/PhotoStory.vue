<script setup lang="ts">
defineProps<{ image: string; alt: string }>();
</script>
<template>
  <section class="photo-story">
    <div class="photo-story-inner">
      <div class="photo-story-image">
        <img
          :src="image"
          :alt="alt"
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
