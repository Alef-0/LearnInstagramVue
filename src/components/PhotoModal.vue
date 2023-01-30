<script setup lang="ts">
  import { ref,inject } from 'vue';
  import { supabase } from '@/supabase';
  import {useUserStore} from "../stores/user"
  import { storeToRefs } from 'pinia';
  import type {ImageInfo} from '../types'


  const userStore = useUserStore()
  const {user} = storeToRefs(userStore)
  const visible = ref(false);
  const caption = ref("")
  const file = ref<File|undefined>(undefined)
  
  const loading = ref(false)
  const errorMessage = ref("")
  
  const addNewPost : (post : ImageInfo) => void = inject("addNewPost")!

  const showModal = () => {
    visible.value = true;
  };

  const handleOk = async (e: MouseEvent) => {
    loading.value = true
    const fileName = Math.floor(Math.random() * 1_000_000_000_000_000) ///Just for now
    if (file.value){
      const {data,error} = await supabase.storage.from("images")
        .upload('public/' + fileName, file.value)
      
      if(error){
        loading.value = false
        return errorMessage.value = "Unable to upload the image"
      }
      
      await supabase.from("posts").insert({
        url: data.path,
        caption: caption.value,
        owner_id: user.value?.id
      })

      addNewPost({
        url:data.path,
        caption:caption.value
      })
    }
    else{
      loading.value = false
      return errorMessage.value = "No file attached"
    }
    
    visible.value = false
    file.value = undefined
    loading.value = false
    errorMessage.value = ""
    caption.value = ""
  };

  const handleUpload = (e : any) => {
    if (e.target.files[0]){
      file.value = e.target.files[0]
      console.log(file)
    }
  }
</script>

<template>
    <div>
      <a-button type="" @click="showModal">Upload Photo</a-button>
      <a-modal v-model:visible="visible" title="Upload Photo" @ok="handleOk">
        <div v-if="!loading">
          <input type="file" accept=".jpeg, .png, .jpg" @change="handleUpload">
          <a-input v-model:value="caption" 
          placeholder="caption..."
          :maxlength = "50"
          />
          <a-typography-text v-if="errorMessage" type="danger">
          {{errorMessage}}
          </a-typography-text>
        </div>
        <div v-else class="spinner">
          <a-spin></a-spin>
        </div>
      </a-modal>
    </div>
  </template>

  
<style scoped>
  input{
    margin-top: 10px;
  }
  .spinner{
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>