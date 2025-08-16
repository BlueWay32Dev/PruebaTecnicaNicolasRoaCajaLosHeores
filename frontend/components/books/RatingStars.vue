<template>
  <div class="rating-stars">
    <span
      v-for="star in 5"
      :key="star"
      class="star"
      :class="{
        active: !hoverValue && star <= modelValue,
        hover: hoverValue && star <= hoverValue,
      }"
      @click="!readonly && $emit('update:modelValue', star)"
      @mouseenter="!readonly && (hoverValue = star)"
      @mouseleave="!readonly && (hoverValue = 0)"
    >
      ★
    </span>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  modelValue: { type: Number, default: 0 },
  readonly: { type: Boolean, default: false },
});

defineEmits(["update:modelValue"]);

const hoverValue = ref(0);
</script>
