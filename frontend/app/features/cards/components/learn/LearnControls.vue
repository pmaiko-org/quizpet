<template>
  <section
    class="
      mb-8 rounded-2xl border border-default bg-default/85 p-2 shadow-sm
      md:p-4
    "
  >
    <div class="flex flex-col gap-4">
      <div class="grid grid-cols-2 gap-3">
        <UButton
          size="xl"
          color="error"
          variant="soft"
          icon="i-lucide-circle-help"
          class="justify-center"
          :disabled="locked"
          @click="$emit('missed')"
        >
          Не знаю
        </UButton>

        <UButton
          size="xl"
          icon="i-lucide-check"
          class="justify-center"
          :disabled="locked"
          @click="$emit('known')"
        >
          Знаю
        </UButton>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  locked?: boolean;
}>();

defineEmits<{
  known: [];
  missed: [];
}>();
</script>
