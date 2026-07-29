<template>
  <SetEditHero :setId="setId" />
</template>

<script setup lang="ts">
const { setId } = useSetEdit();
</script>
