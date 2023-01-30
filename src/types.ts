interface User {
    id:number,
    email: string,
    password: string,
    username: string
    created_at: string
}

interface Posts{
    caption:string, 
    url:string, 
    owner_id:number,
    id: number
}

export {type User, type Posts}