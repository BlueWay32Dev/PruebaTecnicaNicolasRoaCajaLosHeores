<template>
  <div class="empty-layout">
    <slot />
  </div>
</template>

<style scoped lang="scss">
.empty-layout {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}
</style>
