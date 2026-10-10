<script setup lang="ts">
const { data } = await useAsyncData("video-library", () =>
  queryCollection("videos")
    .where("visible", "=", true)
    .order("order", "ASC")
    .order("id", "ASC")
    .all(),
);
const category = ref("");
const active = ref<string | null>(null);
const categories = computed(() => [
  ...new Set((data.value || []).flatMap((video) => video.categories || [])),
]);
const videos = computed(() =>
  (data.value || []).filter(
    (video) => !category.value || video.categories?.includes(category.value),
  ),
);
watch(category, () => {
  active.value = null;
});
</script>
<template>
  <div class="video-library">
    <p class="provider-note">Play a video to connect to YouTube.</p>
    <div
      v-if="categories.length"
      class="video-filters"
      role="group"
      aria-label="Filter videos by category"
    >
      <button
        type="button"
        :aria-pressed="category === ''"
        @click="category = ''"
      >
        All videos
      </button>
      <button
        v-for="item in categories"
        :key="item"
        type="button"
        :aria-pressed="category === item"
        @click="category = item"
      >
        {{ item }}
      </button>
    </div>
    <div class="video-grid">
      <VideoCard
        v-for="video in videos"
        :key="video.id"
        :video="video"
        :active="active === video.id"
        @play="active = video.id"
      />
    </div>
    <p v-if="!videos.length">No videos to show yet.</p>
  </div>
</template>
