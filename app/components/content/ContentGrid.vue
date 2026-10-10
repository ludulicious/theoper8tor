<script setup lang="ts">
withDefaults(defineProps<{ columns?: string }>(), { columns: "2" });
</script>
<template>
  <div class="content-grid" :class="`columns-${columns}`"><slot /></div>
</template>
