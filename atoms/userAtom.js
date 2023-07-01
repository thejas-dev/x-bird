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

export const mainFeedState = atom({
	key:"mainFeedState",
	default:[]
})

export const loaderState = atom({
	key:'loaderState',
	default:false
})