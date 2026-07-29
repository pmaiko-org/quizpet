<template>
  <PeopleGrid
    v-model:page="page"
    :users="users"
    :meta="meta"
    :perPage="perPage"
    :pending="pending"
    :error="error"
    @refresh="refresh"
  />
</template>

<script setup lang="ts">
const { users, meta, page, perPage, pending, error, refresh } = usePeopleList();
</script>
