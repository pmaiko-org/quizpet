<template>
  <SetsHero
    :stats="stats"
    :pending="pending"
    @refresh="refresh"
  />
</template>

<script setup lang="ts">
const { stats, pending, refresh } = useSetsList();
</script>
