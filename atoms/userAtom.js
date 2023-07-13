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

export const displayUserState = atom({
	key:"displayUserState",
	default:''
})

export const showLoginNowState = atom({
	key:"showLoginNowState",
	default:false
})

export const sidebarState = atom({
	key:"sidebarState",
	default:false
})

export const showClipboardState = atom({
	key:"showClipboardState",
	default:false
})