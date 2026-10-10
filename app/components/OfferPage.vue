<script setup lang="ts">
const props = defineProps<{ path: string }>();
const { data: offer } = await useAsyncData(
  () => `offer:${props.path}`,
  () => queryCollection("offers").path(props.path).first(),
);
provide("sectionPage", offer);
provide("contentImageSizes", ref("100vw 375:90vw 640:92vw 788:740px"));
const price = computed(() =>
  offer.value?.price === undefined
    ? ""
    : new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(offer.value.price),
);
</script>
<template>
  <div v-if="offer" class="offer-page">
    <section class="offer-intro">
      <div>
        <p class="eyebrow">{{ offer.bestFor }}</p>
        <h1>{{ offer.title }}</h1>
        <p class="lead">{{ offer.summary }}</p>
        <p class="session-duration">{{ offer.duration }}</p>
      </div>
      <aside class="booking-summary" aria-label="Session booking">
        <p class="eyebrow">Your session with Staci</p>
        <p class="session-price">{{ price }} <span>USD</span></p>
        <p>One focused conversation. A clear place to start.</p>
        <a v-if="offer.bookingUrl" class="action-link" :href="offer.bookingUrl"
          >Book this session</a
        >
        <p class="booking-note">
          Choose an available time on the booking page.
        </p>
      </aside>
    </section>
    <div class="offer-body"><ContentRenderer :value="offer" /></div>
    <div class="offer-back">
      <NuxtLink to="/book-a-session" class="text-link"
        >← Compare all sessions</NuxtLink
      >
    </div>
  </div>
</template>
