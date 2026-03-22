<template>
  <UForm
    :state="state"
    class="space-y-4"
    @submit="onSubmit"
  >
    <UFormField
      label="Name"
      name="name"
      size="xl"
    >
      <UInput
        v-model="state.name"
        class="w-full"
      />
    </UFormField>

    <UFormField
      label="Description"
      name="description"
      size="xl"
    >
      <UInput
        v-model="state.description"
        type="text"
        class="w-full"
      />
    </UFormField>

    <div class="my-8 h-[1px] w-full bg-primary-900" />

    <template v-for="(card, index) in state.cards">
      <UFormField
        v-if="state.cards[index]"
        label="Term"
        name="term"
        size="xl"
      >
        <UInput
          v-model="state.cards[index].term"
          type="text"
          class="w-full"
        />
      </UFormField>
      <UFormField
        v-if="state.cards[index]"
        label="Definition"
        name="definition"
        size="xl"
      >
        <UInput
          v-model="state.cards[index].definition"
          type="text"
          class="w-full"
        />
      </UFormField>
    </template>

    <UButton
      type="submit"
      size="xl"
      class="mt-6 cursor-pointer text-center justify-center"
      >Створити</UButton
    >
  </UForm>
</template>

<script setup lang="ts">
const state = reactive({
  name: undefined,
  description: undefined,
  cards: [getCard(), getCard()],
});

function getCard() {
  return {
    term: undefined,
    definition: undefined,
  };
}

const onSubmit = () => {
  console.log('onSubmit');
};
</script>
