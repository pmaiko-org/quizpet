<template>
  <section>
    <div class="grid grid-cols-2 gap-2">
      <UButton
        size="lg"
        color="neutral"
        variant="soft"
        icon="i-lucide-rotate-ccw"
        class="h-11 justify-center"
        :disabled="locked"
        @click="$emit('missed')"
      >
        Не знаю
      </UButton>

      <UButton
        size="lg"
        icon="i-lucide-arrow-right"
        trailing
        class="h-11 justify-center"
        :disabled="locked"
        @click="$emit('known')"
      >
        Знаю, далі
      </UButton>
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
