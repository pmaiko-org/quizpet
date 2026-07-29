<template>
  <div class="space-y-6">
    <SetEditHeroWidget />
    <SetEditFormWidget />
  </div>
</template>

<script setup lang="ts">
import { PageName } from "~/constants";

definePageMeta({
  name: PageName.SETS_ID_EDIT,
  layout: "cabinet",
});
</script>
