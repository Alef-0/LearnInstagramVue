<script setup lang="ts">
    import type {Posts} from '../types'

    const props = defineProps<{
        posts : Posts[]
    }>()

    const {VITE_SUPABASE_PHOTOS_URL : url} = import.meta.env
</script>

<template>
    <div class="image-gallery-container">
        <img v-for="post in posts"
        :key="post.url"
        :src="`${url}${post.url}`" alt=""/>
    </div>
</template>

<style scoped>
    .image-gallery-container{
        display: flex;
        justify-content: left;
        flex-wrap: wrap;
    }

    img{
        margin: 10px 10px;
        width: 200px;
        max-height: 200px;
    }
</style>