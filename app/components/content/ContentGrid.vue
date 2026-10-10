<script setup lang="ts">
const props = withDefaults(defineProps<{ columns?: string }>(), {
  columns: "2",
});
provide(
  "contentImageSizes",
  computed(() =>
    props.columns === "3"
      ? "100vw 375:90vw 601:45vw 1081:310px"
      : "100vw 375:90vw 601:45vw 1048:482px",
  ),
);
</script>
<template>
  <div class="content-grid" :class="`columns-${columns}`"><slot /></div>
</template>
