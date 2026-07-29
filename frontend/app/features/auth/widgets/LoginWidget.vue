<template>
  <div
    class="
      min-h-screen
      bg-[radial-gradient(circle_at_top,#fef3c7_0%,#fff7ed_30%,#ffffff_68%)]
      dark:bg-[radial-gradient(circle_at_top,#172033_0%,#101723_38%,#0c111b_72%)]
    "
  >
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
