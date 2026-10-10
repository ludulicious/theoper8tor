<script setup lang="ts">
defineProps<{
  video: {
    title: string;
    youtubeId: string;
    image: { src: string; alt: string };
  };
  active: boolean;
  sizes?: string;
}>();
defineEmits<{ play: [] }>();
const contentSizes = inject<Ref<string>>(
  "contentImageSizes",
  ref("100vw 375:90vw 640:92vw 1048:1000px"),
);
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
      <NuxtImg
        :src="video.image.src"
        :alt="video.image.alt"
        :sizes="sizes || contentSizes"
        densities="1x 2x"
        loading="lazy"
        width="960"
        height="540"
      />
      <span class="video-play" aria-hidden="true">▶</span>
      <span class="video-play-label">Play video</span>
    </button>
    <figcaption>{{ video.title }}</figcaption>
  </figure>
</template>
