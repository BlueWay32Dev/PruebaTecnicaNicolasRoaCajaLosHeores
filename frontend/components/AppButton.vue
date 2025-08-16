<template>
  <button
    class="button"
    :class="{ 'button--disabled': disabled }"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<script setup>
defineProps({
  disabled: { type: Boolean, default: false },
});
</script>
