<script setup lang="ts">
defineProps<{ label: string; to: string; id?: string }>();
</script>
<template>
  <div class="action-row" :id="id">
    <NuxtLink class="action-link" :to="to">{{ label }}</NuxtLink>
  </div>
</template>
