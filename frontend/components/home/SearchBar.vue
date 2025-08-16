<template>
  <div class="search-bar">
    <h1 class="page__title">Buscar libro</h1>

    <input
      v-model="localQuery"
      type="text"
      placeholder="Escribe el nombre del libro"
      class="input search-bar__input"
      :disabled="loading"
      @keyup.enter="onSearch"
    />
    <button
      @click="onSearch"
      :disabled="loading"
      class="button button--primary search-bar__button"
    >
      <span v-if="loading" class="spinner"></span>
      <span>{{ loading ? "Buscando..." : "Buscar" }}</span>
    </button>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  modelValue: String,
  loading: Boolean,
});

const emit = defineEmits(["update:modelValue", "search"]);

const localQuery = ref(props.modelValue);

watch(localQuery, (val) => emit("update:modelValue", val));

function onSearch() {
  emit("search");
}
</script>
