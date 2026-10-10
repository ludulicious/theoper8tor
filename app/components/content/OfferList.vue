<script setup lang="ts">
const props = withDefaults(defineProps<{ featured?: boolean | string }>(), {
  featured: false,
});
const { data: offers } = await useAsyncData("consultation-list", () =>
  queryCollection("offers")
    .where("kind", "=", "consultation")
    .order("order", "ASC")
    .all(),
);
const shown = computed(() =>
  props.featured === true || props.featured === "true"
    ? offers.value?.filter((offer) => offer.featured)
    : offers.value,
);
const money = (price?: number) =>
  price === undefined
    ? ""
    : new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(price);
</script>
<template>
  <div class="pricing-grid">
    <article v-for="offer in shown" :key="offer.path" class="pricing-card">
      <div class="pricing-card-intro">
        <p class="eyebrow">{{ offer.bestFor }}</p>
        <h3>{{ offer.title }}</h3>
      </div>
      <div class="pricing-card-rate">
        <p class="session-price">{{ money(offer.price) }} <span>USD</span></p>
        <p class="session-duration">{{ offer.duration }}</p>
      </div>
      <p class="pricing-card-summary">{{ offer.description }}</p>
      <NuxtLink :to="offer.path" class="pricing-card-action">
        View session <span aria-hidden="true">→</span>
        <span class="sr-only">: {{ offer.title }}</span>
      </NuxtLink>
    </article>
  </div>
</template>
