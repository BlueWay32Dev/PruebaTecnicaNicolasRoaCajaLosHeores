<template>
  <div class="page page--center">
    <SearchBar
      v-model="searchStore.query"
      :loading="searchStore.loading"
      @search="searchStore.searchBooks"
    />

    <LastSearches
      :searches="searchStore.lastSearches"
      @repeat="searchStore.repeatSearch"
    />

    <div v-if="searchStore.loading">
      <SkeletonLoader />
    </div>

    <SearchGrid
      v-else-if="searchStore.results.length"
      :books="searchStore.results"
    />
  </div>
</template>

<script setup>
import { useSearchStore } from "~/stores/search";
import SearchBar from "~/components/home/SearchBar.vue";
import LastSearches from "~/components/home/LastSearches.vue";
import SearchGrid from "~/components/home/SearchGrid.vue";
import SkeletonLoader from "~/components/home/LoadingSkeleton.vue";

const searchStore = useSearchStore();
</script>
