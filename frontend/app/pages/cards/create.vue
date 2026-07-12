<template>
  <div>
    <h1 class="mb-4 text-3xl font-bold">
      Створити новий набір карток
    </h1>

    <SetForm />
  </div>
</template>

<script setup lang="ts">
import { PageName } from "~/constants";

definePageMeta({
  name: PageName.CARDS_CREATE,
  layout: "cabinet",
});
</script>
