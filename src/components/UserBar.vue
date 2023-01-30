<script setup lang="ts">
    import PhotoModal from "./PhotoModal.vue"
    import { useRoute } from "vue-router";
    import {useUserStore} from "../stores/user"
    import { storeToRefs } from "pinia";
    import type { User } from "@/types";
    import { supabase } from "@/supabase";
    
    const userStore = useUserStore()
    const {user : userLogged} = storeToRefs(userStore)
    const props = defineProps<{
        userInfo:{
            posts: number,
            followers: number,
            following: number,
        },
        user : User | undefined
        follow : boolean
    }>()
    const emits = defineEmits<{
        (e: 'following') : void,
        (e: 'unfollowing') : void
    }>()

    const route = useRoute()
    const {username : profileUsername} = route.params //(outro metodo de acessa a rota)

    const followUser = async () => {
        const {data,error} = await supabase.from('followers_following').insert({
            follower: userLogged.value?.id ,
            following: props.user?.id,
        })
        if(!error){
            emits('following')
        }
    }
    
    const unfollowUser = async () => {
        const {data,error} = await supabase.from('followers_following').delete()        
            .eq('follower', userLogged.value?.id).eq('following', props.user?.id)
        if (!error) {emits('unfollowing')}
    }

</script>

<template>
    <div class="userbar-container" v-if="user">
        <div class="top-content">
            <a-typography-title :level="2">{{user.username}}</a-typography-title>
            <PhotoModal v-if="profileUsername === userLogged?.username"></PhotoModal>
            <a-button v-else-if="userLogged && !follow" @click="followUser">Follow</a-button>
            <a-button v-else-if="userLogged && follow" @click="unfollowUser">Following</a-button>

        </div>
        <div class="bottom-content">
            <a-typography-title :level="5">{{ userInfo.posts }} posts</a-typography-title>
            <a-typography-title :level="5">{{userInfo.followers}} followers</a-typography-title>
            <a-typography-title :level="5">{{ userInfo.following }} following</a-typography-title>
        </div>
    </div>
    <div class="userbar-container" v-else>
        <div class="top-content">
            <a-typography-title :level="2">
                User Not Found
            </a-typography-title>
        </div>
    </div>
</template>

<style scoped>
    .userbar-container{
        padding-bottom: 75px;
    }

    .bottom-content{
        display: flex;
        align-items: center;
        /* background-color: aqua; */
    }

    .bottom-content h5{
        margin: 0;
        padding: 0;
        margin-right: 30px;
        align-items: center;
    }

    .top-content{
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-right: 50px;
    }
</style>