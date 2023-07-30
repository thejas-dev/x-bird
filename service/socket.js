import { io } from 'socket.io-client';

const server = "https://x-bird-server.vercel.app/";
export const socket = io(server, {
    withCredentials: true,
    extraHeaders: {
        "Access-Control-Allow-Origin": "https://trendzio.vercel.app",
        "my-custom-header": "abcd"
    }
});
