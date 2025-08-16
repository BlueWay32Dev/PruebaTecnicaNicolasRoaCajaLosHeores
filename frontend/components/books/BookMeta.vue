<template>
  <div class="meta book-meta">
    <p class="meta__item"><strong>Año:</strong> {{ year }}</p>
    <p class="meta__item"><strong>Editorial:</strong> {{ publisher }}</p>
    <p class="meta__item"><strong>Páginas:</strong> {{ pages }}</p>
  </div>
</template>

<script setup>
defineProps({
  year: String,
  publisher: String,
  pages: Number,
});
</script>
