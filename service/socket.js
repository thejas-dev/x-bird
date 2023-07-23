import {io} from 'socket.io-client'
let server = "http://192.168.1.5:3333"
export const socket = io(server,{
    withCredentials:true,
    extraHeaders:{
        "my-custom-header" : "abcd"
    }
})