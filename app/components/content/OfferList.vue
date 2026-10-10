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
  <div class="offer-list">
    <article v-for="offer in shown" :key="offer.path" class="offer-row">
      <div class="offer-need">
        <p class="eyebrow">{{ offer.bestFor }}</p>
        <h3>
          <NuxtLink :to="offer.path">{{ offer.title }}</NuxtLink>
        </h3>
      </div>
      <div class="offer-summary">
        <p>{{ offer.summary }}</p>
        <p class="session-duration">{{ offer.duration }}</p>
      </div>
      <div class="offer-choice">
        <p class="session-price">{{ money(offer.price) }} <span>USD</span></p>
        <NuxtLink :to="offer.path" class="text-link"
          >View session <span aria-hidden="true">↗</span
          ><span class="sr-only">: {{ offer.title }}</span></NuxtLink
        >
      </div>
    </article>
  </div>
</template>
