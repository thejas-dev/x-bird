import { atom } from 'recoil';

export const currentChatState = atom({
	key:"currentChatState",
	default:''
})

export const currentUserState = atom({
	key:"currentUserState",
	default:''
})

export const chatsState = atom({
	key:"chatsState",
	default:[]
})