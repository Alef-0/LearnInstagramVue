<script setup lang="ts">
    import {ref, onMounted} from 'vue'

    const observer = ref<IntersectionObserver>()
    const root = ref<Element>()
    const emits = defineEmits<{
        (e: 'intersect') : void
    }>()

    onMounted(() => {
        observer.value = new IntersectionObserver(([entry]) => {
            if(entry && entry.isIntersecting){
                emits('intersect')
            }
        })
        observer.value.observe(root.value!)
    })
</script>

<template>
    <div class="observer" ref="root"></div>
</template>

<style scoped>
    .observer{
        height: 30px;
        width: 30px;
    }
</style>