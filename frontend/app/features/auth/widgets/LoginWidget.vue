<template>
  <div
    class="
      relative min-h-screen
      bg-[radial-gradient(circle_at_top,#fef3c7_0%,#fff7ed_30%,#ffffff_68%)]
      dark:bg-[radial-gradient(circle_at_top,#172033_0%,#101723_38%,#0c111b_72%)]
    "
  >
    <div
      class="
        absolute top-4 right-4 z-20 rounded-full bg-white/70 p-1 shadow-sm
        ring-1 ring-black/5 backdrop-blur-md
        dark:bg-white/10 dark:shadow-none dark:ring-0
      "
    >
      <UColorModeSwitch />
    </div>

    <div
      class="
        flex min-h-screen flex-col
        lg:flex-row
      "
    >
      <LoginShowcase />
      <LoginPanel />
    </div>
  </div>
</template>

<script setup lang="ts">
useOAuthCallback();
</script>
