<template>
  <div class="space-y-6">
    <SetsHero
      :stats="stats"
      :pending="heroPending"
      @refresh="handleRefresh"
    />

    <SetsGrid
      :page="page"
      :scope="activeScope"
      :search="search"
      :topicIds="topicIds"
      :englishLevelIds="englishLevelIds"
      :authorIds="authorIds"
      :sets="sets"
      :meta="meta"
      :summaryText="summaryText"
      :pending="pending"
      :error="error"
      :deletingId="deletingSetId"
      :canDelete="canDelete"
      :topics="topics"
      :englishLevels="englishLevels"
      :authors="authors"
      :hasActiveFilters="hasActiveFilters"
      :filterOptionsReady="filterOptionsReady"
      :filterOptionsError="filterOptionsError"
      @update:page="page = $event"
      @update:scope="selectScope"
      @update:search="search = $event"
      @update:topicIds="topicIds = $event"
      @update:englishLevelIds="englishLevelIds = $event"
      @update:authorIds="authorIds = $event"
      @clearFilters="clearFilters"
      @retryFilterOptions="refreshFilterOptions"
      @refresh="handleRefresh"
      @delete="handleDeleteSet"
    />
  </div>
</template>

<script setup lang="ts">
const { email } = useCurrentUser();

const {
  sets,
  meta,
  page,
  activeScope,
  search,
  topicIds,
  englishLevelIds,
  authorIds,
  topics,
  englishLevels,
  authors,
  hasActiveFilters,
  filterOptionsReady,
  stats,
  summaryText,
  pending,
  heroPending,
  error,
  filterOptionsError,
  deletingSetId,
  canDelete,
  selectScope,
  clearFilters,
  refreshFilterOptions,
  deleteSet: handleDeleteSet,
  refresh: handleRefresh,
} = useSetsList(email);
</script>
