<script setup lang="ts">
	import { ref, reactive,computed } from 'vue';
	import {useUserStore, type Credentials} from '../stores/user'
	import { storeToRefs } from 'pinia';

	const userStore = useUserStore()
	const {errorMessage, loading, user} = storeToRefs(userStore)
	const {handleSignUp,handleLogin} = userStore
	const emailToCompute = ref("")


	const userCredentials = reactive<Credentials>({
		email: "",
		password:"",
		username:""
	})
	
	const visible = ref(false);
	const props = defineProps<{
		login : boolean
	}>()

	const showModal = async () => {
		visible.value = true;
	};
	const clearUserCredentials = () => {
		userCredentials.email = ""
		userCredentials.password = ""
		userCredentials.username = ""
		errorMessage.value=""; 
	}
	const handleOk = async () => {
		loading.value = true
		if (props.login){await handleLogin({...userCredentials,email:emailToCompute.value.toLowerCase()})}
		else{			 await handleSignUp({...userCredentials,email:emailToCompute.value.toLowerCase()})}
		loading.value = false
		if (user.value) {
			visible.value = false
			clearUserCredentials();
		};
	};
	const handleCancel = () => {
		errorMessage.value=""; 
		visible.value = false
	}
	const title = props.login ? 'Login' : 'Signup'
</script>
  
<template>
	<div>
	  <a-button class='btn' type="primary" @click="showModal">{{title}}</a-button>
	  <a-modal v-model:visible="visible" :title="title">
		<template #footer>
			<a-button :disabled="loading" key="back" @click="handleCancel">Cancel</a-button>
			<a-button :disabled="loading" key="submit" type="primary" @click="handleOk">Submit</a-button>
		</template>
		<div v-if="!loading" class="input-container">
			{{ user }}
			<a-input class="input" v-if="!props.login" v-model:value="userCredentials.username" placeholder="Username"></a-input>
			<a-input class="input" v-model:value="emailToCompute" placeholder="Email"></a-input>
			<a-input class="input" type="password" v-model:value="userCredentials.password" placeholder="Password"></a-input>
		</div>
		<div v-else class="spinner">
			<a-spin></a-spin>
		</div>
		<a-typography-text v-if="errorMessage"
		type="danger">{{ errorMessage }}</a-typography-text>
	  </a-modal>
	</div>
</template>
  
<style scoped>
	.btn{
		margin-left:10px
	}
	.input{
		margin-top: 5px
	}
	.input-container{
		height: 120px;
	}
	.spinner{
		display: flex;
		align-items: center;
		justify-content: center;
		height: 120px;
	}
</style>
