<template>
  <SetForm
    v-if="set"
    :set="set"
  />

  <section
    v-else-if="status === 'pending'"
    class="
      rounded-4xl border border-default bg-default/80 p-6 text-sm text-toned
      shadow-sm
      sm:p-8
    "
  >
    Завантажуємо набір для редагування...
  </section>
</template>

<script setup lang="ts">
const { set, status } = useSetEdit();
</script>
