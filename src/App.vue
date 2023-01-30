<script setup lang="ts">
  import NavBar from './components/NavBar.vue';
  import { RouterView } from 'vue-router';
  import {onMounted} from "vue"
  import {useUserStore} from "./stores/user"

  const userStore = useUserStore()

  onMounted(async () => {
    if (!userStore.user) await userStore.getUser()
  })
</script>

<template>
  <main>
    <NavBar></NavBar>
    <RouterView></RouterView>
  </main>
</template>

<style scoped>

</style>
