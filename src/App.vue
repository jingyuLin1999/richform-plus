<template>
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component class="view" :is="Component" />
    </keep-alive>
  </router-view>
</template>

<script setup lang="ts">

</script>


<style scoped lang="scss"></style>
