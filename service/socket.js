import {io} from 'socket.io-client'
let server = "https://x-bird-server.vercel.app/"
export const socket = io(server,{
    withCredentials:true,
    extraHeaders:{
        "my-custom-header" : "abcd"
    }
})