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

export const followingFeedState = atom({
	key:"followingFeedState",
	default:[]
})

export const forYouState = atom({
	key:"forYouState",
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

export const currentListState = atom({
	key:"currentListState",
	default:''
})

export const bottomHideState = atom({
	key:"bottomHideState",
	default:false
})

export const searchTextState = atom({
	key:"searchTextState",
	default:''
})

export const themeState = atom({
	key:"themeState",
	default:'light'
})

export const homeState = atom({
	key:'homeState',	
	default:'For you'
})

export const currentPeerState = atom({
	key:"currentPeerState",
	default:''
})

export const alertTheUserForIncomingCallState = atom({
	key:'alertTheUserForIncomingCallState',
	default:''
})

export const acceptedState = atom({
	key:"acceptedState",
	default:false
})

export const remotePeerIdState = atom({
	key:"remotePeerIdState",
	default:''
})