<script setup lang="ts">
import { ref } from "vue";
import {RouterLink, useRouter} from "vue-router"
import Container from "./Container.vue";
import AuthModal from "../components/AuthModal.vue"
import {useUserStore} from "../stores/user"
import {storeToRefs} from 'pinia'

const searchUser = ref("")
const router = useRouter()

const userStore = useUserStore()
const {user} = storeToRefs(userStore)

const onSearch = () : void => {
    if(searchUser.value){
        router.push(`/profile/${searchUser.value}`)
        searchUser.value = ''
    }
}
const goToUsersProfile = () : void => {
    router.push(`/profile/${user.value?.username}`)
    searchUser.value = ''
}
</script>

<template>
    <a-layout-header>
    <Container>
        <div class="nav-container">
            <div class="left-content">
                <RouterLink to="/">Instantaneous</RouterLink>
                <a-input-search
                    v-model:value = searchUser
                    placeholder="Search User Name"
                    :style="{width: '200px'}"
                    @search="onSearch"
                />
            </div>
            <div v-if="!user" class="right-content">
                <AuthModal :login="false"></AuthModal>
                <AuthModal :login="true"></AuthModal>
            </div>
            <div v-else class="right-content">
                <a-button type="primary" @click="goToUsersProfile">{{ user?.username }}</a-button>
                <a-button type='primary' @click="userStore.handleLogOut">Logout</a-button>
            </div>
        </div>
    </Container>
    </a-layout-header>
</template>

<style scoped>
    .nav-container{
        display: flex;
        justify-content: space-between;
    }

    .left-content{
        display: flex;
        align-items: center;
    }
    .right-content{
        display: flex;
        align-items: center;
    }
    .left-content a{
        margin-right: 10px;
    }
    .right-content button{
        margin-left:10px
    }
</style>   