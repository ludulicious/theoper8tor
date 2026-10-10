<script setup lang="ts">
const props = withDefaults(
  defineProps<{ src: string; title: string; kind?: string }>(),
  { kind: "form" },
);
const loaded = ref(false);
const safeSrc = computed(() => {
  try {
    const url = new URL(props.src);
    return url.protocol === "https:" &&
      [
        "link.funnelstreams.com",
        "api.leadconnectorhq.com",
        "www.youtube-nocookie.com",
        "open.spotify.com",
      ].includes(url.hostname)
      ? url.href
      : "";
  } catch {
    return "";
  }
});
</script>
<template>
  <div
    v-if="safeSrc"
    class="provider-embed"
    :class="{
      'video-embed': kind === 'video',
      'audio-embed': src.includes('open.spotify.com'),
      loaded,
    }"
  >
    <template v-if="!loaded">
      <p>{{ title }}</p>
      <button class="action-link" @click="loaded = true">
        {{ kind === "video" ? "Play video" : "Open " + title }}
      </button>
      <p class="provider-note">
        {{
          kind === "video"
            ? "Video hosted on YouTube."
            : "This service is hosted by an external provider."
        }}
        <a :href="safeSrc" target="_blank" rel="noopener noreferrer"
          >Open in a new tab ↗</a
        >
      </p>
    </template>
    <iframe
      v-else
      :src="safeSrc"
      :title="title"
      loading="lazy"
      :allow="
        kind === 'video'
          ? 'autoplay; encrypted-media; picture-in-picture; fullscreen'
          : 'payment'
      "
      referrerpolicy="strict-origin-when-cross-origin"
    />
  </div>
</template>
