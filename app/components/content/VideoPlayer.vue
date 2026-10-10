<script setup lang="ts">
const props = defineProps<{ video: string }>();
const { data: item } = await useAsyncData(
  () => `video:${props.video}`,
  () =>
    queryCollection("videos")
      .where(
        /^[A-Za-z0-9_-]{11}$/.test(props.video) ? "youtubeId" : "stem",
        "=",
        /^[A-Za-z0-9_-]{11}$/.test(props.video)
          ? props.video
          : `09.videos/${props.video}`,
      )
      .where("visible", "=", true)
      .first(),
);
const active = ref(false);
watch(
  () => props.video,
  () => {
    active.value = false;
  },
);
</script>
<template>
  <div v-if="item" class="inline-video">
    <VideoCard :video="item" :active="active" @play="active = true" />
    <p class="provider-note">Play a video to connect to YouTube.</p>
  </div>
</template>
