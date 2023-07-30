import { io } from 'socket.io-client';

const server = "https://x-bird-server.onrender.com";
export const socket = io(server, {
    withCredentials: true,
    extraHeaders: {
        "Access-Control-Allow-Origin": "https://trendzio.vercel.app",
        "my-custom-header": "abcd"
    }
});
