<template>
  <PeopleGrid
    v-model:page="page"
    :users="users"
    :meta="meta"
    :pending="pending"
    :error="error"
    @refresh="refresh"
  />
</template>

<script setup lang="ts">
const { users, meta, page, pending, error, refresh } = usePeopleList();
</script>
