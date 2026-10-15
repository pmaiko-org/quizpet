<template>
  <div>
    <TheHeader :showSidebarToggle="false" />

    <UMain>
      <slot />
    </UMain>

    <TheFooter />
  </div>
</template>
