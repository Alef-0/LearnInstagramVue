<script setup lang="ts">
  import type {Posts} from '@/types'

  const props = defineProps<{
    post : Posts
  }>()
  const {VITE_SUPABASE_PHOTOS_URL : url} = import.meta.env
</script>

<template>
    <a-card class="card" hoverable :style="{width: '240px'}">
      <template #cover>
        <img alt="example" :src="`${url}${post.url}`" />
      </template>
      <a-card-meta :title="post.owner_id">
        <template #description>{{post.caption}}</template>
      </a-card-meta>
    </a-card>
</template>

<style scoped>
  .card {
    margin-bottom: 20px;
    margin-right: 20px;
  }
</style>