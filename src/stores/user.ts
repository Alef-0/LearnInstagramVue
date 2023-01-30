import { ref } from 'vue'
import { defineStore } from 'pinia'
import {supabase} from '../supabase'

const validateEmail = (email : string) => {
  return email
    .toLowerCase()
    .match(
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    ); //Actually Compliant 99%
};

interface Credentials {
  email: string,
  password: string,
  username: string
}
export {type Credentials};

export const useUserStore = defineStore('users', () => {
  const user = ref<{
    id:number,
    email:string,
    username:string
  }>()
  
  const errorMessage = ref("")
  const loading = ref(false)

  const handleLogin = async (credentials : Credentials) : Promise<(void | string)>  => {
    const {email, password} = credentials
    if(password.length < 6){return errorMessage.value="Password too short"}
    if(!validateEmail(email)){return errorMessage.value="Email is invalid"}

    const {error,data} = await supabase.auth.signInWithPassword({email, password})
    if(error){return errorMessage.value = error.message}

    //Updating variable
    const {data: existingUser} = await supabase
      .from('users').select().eq('email',email).single()

    user.value = {
      id: existingUser.id,
      email: existingUser.email,
      username: existingUser.username
    }

    errorMessage.value = ""
  }
  const handleSignUp =  async (credentials : Credentials) : Promise<string | void> => {
    const {email, password, username} = credentials

    if (password.length < 6) {
      return errorMessage.value = "Password is too short"
    }
    if (username.length < 4) {
      return errorMessage.value = "Username is too short"
    }
    if (!validateEmail(email)){
      return errorMessage.value = "Email is invalid"
    }
    errorMessage.value=""
    
    // See if the user exists
    const {data : userWithUsername} = await supabase
      .from('users').select().eq('username',username).single()
    if (userWithUsername){return errorMessage.value = "User alread exists"}

    const {data, error} = await supabase.auth.signUp({email, password})    
    if(error){return errorMessage.value = error.message}

    await supabase.from("users").insert({
      username,email
    })

    //Updating variable
    const {data: newUser} = await supabase
      .from('users').select().eq('email',email).single()

    user.value = {
      id: newUser.id,
      email: newUser.email,
      username: newUser.username
    }
  }
  const handleLogOut = async () :  Promise<void> => {
    await supabase.auth.signOut()
    user.value = undefined
  }
  const getUser = async () : Promise<void> => {
    loading.value = true
    const {data} = await supabase.auth.getUser()
    if (!data.user) {
      loading.value=false; 
      return user.value = undefined
    }

    const {data : userLocal} = await supabase
      .from('users').select().eq("email", data.user.email).single() //LowerCase will prevent error

      user.value = {
        username: userLocal.username,
        email: userLocal.email,
        id: userLocal.id,
      }
    loading.value=false
  }

  return {user, errorMessage, loading,
    handleLogOut, handleLogin, handleSignUp, getUser,
    }
})
