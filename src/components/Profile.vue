<script setup lang="ts">
    import Container from './Container.vue';
    import UserBar from './UserBar.vue';
    import ImageGallery from './ImageGallery.vue';
    import {ref, provide, onMounted, reactive} from "vue"
    import type {Posts, User} from '../types'
    import { supabase } from '@/supabase';
    import { useRoute } from 'vue-router';
    import { useUserStore } from '@/stores/user';
    import { storeToRefs } from 'pinia';

    const route = useRoute()
    const {username} = route.params
    const userStore = useUserStore()

    const {user : userLogged} = storeToRefs(userStore)
    const userInfo = reactive<{
            posts: number,
            followers: number,
            following: number,
        }>({posts:0, followers:0, following:0})
        
    const posts = ref<Posts[]>([])
    const user = ref<User>()
    const loading = ref(false)
    const isFollowing = ref(false)

    const addNewPost = (post : Posts) => {
        posts.value.unshift(post)
        console.log(posts)
    }

    const fetchData = async () => {        
        loading.value = true
        const {error, data} = await supabase.from("users")
            .select().eq('username', username).single()
        if (!data) {
            loading.value=false
            return user.value = undefined
        }
        user.value = data
        const {data:post_data} = await supabase.from("posts")
            .select().eq("owner_id", user.value?.id).order('created_at', {ascending:false})
            .range(0,9)
        
        posts.value = post_data as Posts[]
        loading.value = false
    }
    const fetchIsFollowing = async () =>{
        if(userLogged && (userLogged.value?.id !== user.value?.id)){
            const {data, error} = await supabase.from('followers_following')
                .select().eq("follower",userLogged.value?.id)
                .eq("following", user.value?.id).single()

            if (data) isFollowing.value = true
        }
    }
    const fetchFolowersCount = async () => {
        const {count :followerCount} = await supabase.from("followers_following")
            .select('count', {count: 'exact'}).eq("following",user.value?.id)
        if (followerCount) userInfo.followers = followerCount

        const {count : followingCount} = await supabase.from("followers_following")
            .select('count', {count: 'exact'}).eq("follower",user.value?.id)
        if (followingCount) userInfo.following = followingCount

        const {count : postsCount} = await supabase.from("posts")
            .select('count', {count: 'exact'}).eq("owner_id",user.value?.id)
        if (postsCount) userInfo.posts = postsCount
    }

    provide('addNewPost', addNewPost)    
    onMounted(async () => {
        await fetchData()
        if (user.value) {
            fetchIsFollowing()
            fetchFolowersCount()
        }
    })
</script>

<template>
    <Container>
        <div class="profile-container" v-if="!loading">
            <UserBar
                :key = "($route.params.username as string)"
                :user = "user"
                :userInfo="userInfo"
                :follow="isFollowing"
                @following="isFollowing=true"
                @unfollowing="isFollowing=false"
            />
            <ImageGallery
                :posts="posts"
            />
        </div>
        <div class="spinner" v-else>
            <a-spin size="large"></a-spin>
        </div>
    </Container>
</template>

<style scoped>
    .profile-container{
        display: flex;
        flex-direction: column;
        padding: 20px 0px;
        margin-left: 50px;
    }

    .spinner{
        display:flex;
        align-items: center;
        justify-content: center;
        height: 85vh;
    }
</style>