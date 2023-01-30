<script setup lang="ts">
    import Container from './Container.vue';
    import { useUserStore} from '@/stores/user';
    import { storeToRefs } from 'pinia';
    import TimeLineCards from "./TimeLineCards.vue"
    import LoginMessage from './LoginMessage.vue';

    const userStore = useUserStore()
    const {user:loggedUser,loading:loadingUser} = storeToRefs(userStore)
</script>

<template>
    <Container>
        <div v-if="!loadingUser">
            <TimeLineCards v-if="loggedUser"/>
            <LoginMessage v-else/>
        </div>
        <div v-else class="loading-content">
            <a-spin size="large"></a-spin>
        </div>
    </Container>
</template>

<style scoped>
    
    .loading-content{
        display: flex;
        align-items: center;
        justify-content: center;
        height: 50vh;
    }
</style>