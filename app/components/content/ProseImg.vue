<script setup lang="ts">
defineProps<{
  src?: string;
  alt?: string;
  width?: string | number;
  height?: string | number;
  sizes?: string;
}>();
const contentSizes = inject<Ref<string>>(
  "contentImageSizes",
  ref("100vw 375:90vw 640:92vw 1048:1000px"),
);
</script>
<template>
  <NuxtImg
    :src="src"
    :alt="alt || ''"
    :width="width"
    :height="height"
    :sizes="sizes || contentSizes"
    densities="1x 2x"
    fit="inside"
    loading="lazy"
    decoding="async"
  />
</template>
