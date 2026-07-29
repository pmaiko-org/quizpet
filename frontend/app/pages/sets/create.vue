<template>
  <CreateSetWidget />
</template>

<script setup lang="ts">
import { PageName } from "~/constants";

definePageMeta({
  name: PageName.SETS_CREATE,
  layout: "cabinet",
});
</script>
