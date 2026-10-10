<script setup lang="ts">
defineProps<{
  video: {
    title: string;
    youtubeId: string;
    image: { src: string; alt: string };
  };
  active: boolean;
}>();
defineEmits<{ play: [] }>();
</script>
<template>
  <figure class="video-card">
    <iframe
      v-if="active"
      :src="`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0`"
      :title="video.title"
      allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
      allowfullscreen
      referrerpolicy="strict-origin-when-cross-origin"
    />
    <button
      v-else
      type="button"
      :aria-label="`Play ${video.title}`"
      @click="$emit('play')"
    >
      <img
        :src="video.image.src"
        :alt="video.image.alt"
        loading="lazy"
        width="480"
        height="360"
      />
      <span class="video-play" aria-hidden="true">▶</span>
      <span class="video-play-label">Play video</span>
    </button>
    <figcaption>{{ video.title }}</figcaption>
  </figure>
</template>
