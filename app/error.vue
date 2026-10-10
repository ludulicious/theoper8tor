<script setup lang="ts">
defineProps<{ error: { statusCode: number; statusMessage?: string } }>();
</script>
<template>
  <main class="error-page">
    <h1>
      {{ error.statusCode === 404 ? "Page not found" : "Something went wrong" }}
    </h1>
    <p>
      {{
        error.statusCode === 404
          ? "This page may have moved."
          : "Please try again in a moment."
      }}
    </p>
    <a href="/" class="action-link">Go to the homepage</a>
  </main>
</template>
