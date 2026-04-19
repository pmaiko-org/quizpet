<template>
  <section
    class="
      rounded-4xl border border-default bg-default/85 p-5 shadow-sm
      sm:p-6
    "
  >
    <div class="flex flex-col gap-4">
      <div class="flex flex-wrap items-center gap-2">
        <UBadge
          variant="soft"
          color="primary"
          size="lg"
          class="rounded-full px-3 py-1"
        >
          {{ flipped ? "Відповідь відкрита" : "Спершу згадайте самі" }}
        </UBadge>

        <UBadge
          variant="outline"
          color="neutral"
          size="lg"
          class="rounded-full px-3 py-1"
        >
          {{ helperBadge }}
        </UBadge>
      </div>

      <div
        class="
          grid gap-3
          sm:grid-cols-2
        "
      >
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

      <p class="text-sm/6 text-toned">
        {{ helperText }}
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
const props = defineProps<{
  flipped: boolean;
  locked?: boolean;
}>();

defineEmits<{
  known: [];
  missed: [];
}>();

const helperBadge = computed(() => {
  return props.flipped
    ? "Помилка поверне картку в чергу"
    : "Клік по картці відкриває визначення";
});

const helperText = computed(() => {
  return props.flipped
    ? "Коли відповідь уже відкрита, кнопка «Не знаю» позначить помилку і поверне картку в повторення трохи пізніше."
    : "Можна відповідати одразу кнопками або спершу перевернути картку, щоб перевірити себе вручну.";
});
</script>
