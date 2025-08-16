<template>
  <div class="filters-card">
    <div class="filters">
      <h1 class="title">📚 Mi Biblioteca</h1>

      <div class="filter-row">
        <input
          v-model="localSearch"
          type="text"
          placeholder="Buscar por título o autor..."
        />

        <select v-model="localSort">
          <option value="">Todas las calificaciones</option>
          <option value="5">⭐⭐⭐⭐⭐ 5 estrellas</option>
          <option value="4">⭐⭐⭐⭐ 4 estrellas</option>
          <option value="3">⭐⭐⭐ 3 estrellas</option>
          <option value="2">⭐⭐ 2 estrellas</option>
          <option value="1">⭐ 1 estrella</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  search: String,
  sort: String,
});

const emit = defineEmits(["update:search", "update:sort", "filter"]);

const localSearch = ref(props.search || "");
const localSort = ref(props.sort ?? "");

watch(localSearch, (val) => emit("update:search", val));
watch(localSort, (val) => emit("update:sort", val));
</script>
