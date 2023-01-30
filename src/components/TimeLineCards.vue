<script setup lang="ts">
    import Card from './Card.vue';
    import { useUserStore} from '@/stores/user';
    import { storeToRefs } from 'pinia';
    import { supabase } from '@/supabase';
    import { onMounted,ref } from 'vue';
    import Observer from './Observer.vue'
    import type {Posts} from '@/types'

    const userStore = useUserStore()
    const {user:LoggedUser} = storeToRefs(userStore)
    const posts = ref<Posts[]>([])
    
    const lastCardIndex = ref(2)
    const ownerIds = ref<number[]>([])
    const stopLoading = ref(false)

    const fetch_data = async () => {
        const {data: followings} = await supabase.from('followers_following')
            .select('following').eq('follower', LoggedUser.value?.id)
        ownerIds.value = followings?.map((fwi : {following : number}) =>  fwi.following) ?? []

        const responsePosts = await supabase.from('posts')
            .select().in('owner_id',ownerIds.value)
            .order('created_at', {ascending: false}).range(0,2)

        posts.value = [...responsePosts.data!]
    }

    const fetch_next_set = async () => {
        if (stopLoading.value) {return}

        const {data} = await supabase.from('posts')
            .select().in('owner_id',ownerIds.value)
            .order('created_at', {ascending: false}).range(lastCardIndex.value + 1,lastCardIndex.value + 3)
        
        posts.value = [...posts.value,...data!]
        lastCardIndex.value += 3
        console.log({posts: posts.value, sum: lastCardIndex.value, request: data})
        if (data?.length == 0) stopLoading.value = true
    }

    onMounted(async () => {
        await fetch_data()
    })
</script>

<template>
    <div class="timeline-container">
            <Card v-for="post in posts" 
            :key="post.id"
            :post="post"
            ></Card>
    </div>
    <Observer v-if="posts.length" @intersect="fetch_next_set"></Observer>
</template>

<style scoped>
    .timeline-container{
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px 0px;
        flex-wrap: wrap;
    }
</style>