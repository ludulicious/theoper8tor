<script setup lang="ts">
const props = withDefaults(
  defineProps<{ src: string; title: string; kind?: string }>(),
  { kind: "form" },
);
const opened = ref(false);
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
const isForm = computed(() => {
  if (!safeSrc.value) return false;
  const url = new URL(safeSrc.value);
  return ["link.funnelstreams.com", "api.leadconnectorhq.com"].includes(
    url.hostname,
  );
});
const loaded = computed(() => isForm.value || opened.value);
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
      <button class="action-link" @click="opened = true">
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
    <p v-if="isForm" class="provider-note">
      <a :href="safeSrc" target="_blank" rel="noopener noreferrer"
        >Open {{ title }} in a new tab ↗</a
      >
    </p>
  </div>
</template>
