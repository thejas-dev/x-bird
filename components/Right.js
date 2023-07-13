import {FiSearch} from 'react-icons/fi'
import {useRecoilState} from 'recoil'
import {currentChatState,currentUserState,chatsState,mainFeedState} from '../atoms/userAtom'
import {HiOutlineChevronDoubleDown,HiOutlineArrowLeft} from 'react-icons/hi';
import {RiMailAddLine,RiSendPlane2Line} from 'react-icons/ri';
import {CiMicrophoneOn} from 'react-icons/ci';
import {BiSearchAlt2} from 'react-icons/bi';
import {useState,useEffect,useRef} from 'react'
import {BsThreeDots} from 'react-icons/bs';
import {AiOutlineInfoCircle,AiOutlineSend,AiOutlineRight} from 'react-icons/ai';
import {BsCardImage,BsEmojiSmile,BsArrowLeft} from 'react-icons/bs';
import {TbGif} from 'react-icons/tb';
import {searchProfile,sendMsgRoute,updateUserChats,getAllMsgRoute,host,getUserByIdRoute,
	updateMsg,getGroupMessage,addGroupMessage,updateGroupMsg,getPostByIdRoute,getAllPosts} from '../utils/ApiRoutes';
import axios from 'axios';
import EmojiPicker from 'emoji-picker-react';
import {io} from 'socket.io-client';
import {socket} from '../service/socket';
import DateDiff from 'date-diff';
import GifPicker from 'gif-picker-react';
import ImageKit from "imagekit"

let currentChatVar = undefined

export default function Right({setCurrentWindow,currentWindow,newMessageSearch,
	setNewMessageSearch,setRevealNotify,revealNotify,msgReveal,setMsgReveal,
	notify,setNotify,setFullScreenLoader,fullScreenLoader,openOverlay,setOpenOverlay,
	overlayFor,setOverlayFor,setNeedToReloadProfile,needToReloadProfile}) {

	const [currentChat,setCurrentChat] = useRecoilState(currentChatState);
	const [currentUser,setCurrentUser] = useRecoilState(currentUserState);
	const [search,setSearch] = useState('');
	const [chats,setChats] = useRecoilState(chatsState);
	const [revealExploreInfo,setRevealExploreInfo] = useState(false);
	const [searchText,setSearchText] = useState('');
	const [searchResult,setSearchResult] = useState([]); 
	const [selectedUser,setSelectedUsers] = useState([]);
	const [url,setUrl] = useState([]);
	const [path,setPath] = useState('');
	const [messageText,setMessageText] = useState('');
	const [emojiInput,setEmojiInput] = useState(false);
	const [iconsReveal,setIconsReveal] = useState(false);
	const [messages,setMessages] = useState([]);
	const scrollRef = useRef();
	const [tempData,setTempData] = useState('');
	const [loading,setLoading] = useState(true);
	const [clientConnected,setClientConnected] = useState(false);
	const [arrivalMessage,setArrivalMessage] = useState('');
	const [userRefetchTrigger,setUserRefetchTrigger] = useState(false);
	const [messagesRefetchTrigger,setMessagesRefetchTrigger] = useState(false);
	const [tempMsg,setTempMsg] = useState('');
	const [tempImage,setTempImage] = useState('');
	const [senderImages,setSenderImages] = useState({});
	const [mainFeed,setMainFeed] = useRecoilState(mainFeedState);
	const [gifInput,setGifInput] = useState(false);
	const [gifWidth,setGifWidth] = useState('31em');
	const [uploadArray,setUploadArray] = useState([]);
	const [uploading,setUploading] = useState(false);
	const [addThisImage,setAddThisImage] = useState('');
	const imagekit = new ImageKit({
	    publicKey : process.env.NEXT_PUBLIC_IMAGEKIT_ID,
	    privateKey : process.env.NEXT_PUBLIC_IMAGEKIT_PRIVATE,
	    urlEndpoint : process.env.NEXT_PUBLIC_IMAGEKIT_ENDPOINT
	});

	useEffect(()=>{
		if(window.innerWidth){
			setInterval(()=>{
				// console.log(window.innerWidth)
				if(window.innerWidth < 500 && window.innerWidth >= 400){
					setGifWidth('24em')
				}else if(window.innerWidth < 400 && window.innerWidth >= 360){
					setGifWidth('20em')
				}else if(window.innerWidth < 359 && window.innerWidth >= 300){
					setGifWidth('19em')
				}else if(window.innerWidth < 299 && window.innerWidth >= 260){
					setGifWidth('15em')
				}else if(window.innerWidth < 259){
					setGifWidth('10em')
				}else{
					setGifWidth('31em')
				}
			},1000)
		}
	},[])

	const tempEventData = [
		{
			head:'Premier League Live',
			text:'Leicester City vs Liverpool FC',
			image:'https://pbs.twimg.com/semantic_core_img/1655680481696907265/q75roE18?format=jpg&name=small'
		}
	]

	const tempHashData = [
		{
			head:'Trending in India',
			text:'MuslimVoteSwing',
		},
		{
			head:'Trending',
			text:'Chief minister'
		},

	]

	const tempTextData = [
		{
			head:'Trending in India',
			text:'WE STAND BY MUNAWAR',
			tweets:28000
		}
	]

	const whoToFollow = [
		{
			name:'The Babylon Bee',
			username:'TheBabylonBee',
			image:'https://pbs.twimg.com/profile_images/1400100770624720898/-HC7kL5x_400x400.jpg'
		},
		{
			name:'Johns',
			username:'CricCrazyJohns',
			image:'https://pbs.twimg.com/profile_images/1570500099373170688/VVVytBl2_400x400.jpg'
		},
		{
			name:'Qatar Airways',
			username:'qatarairways',
			image:'https://pbs.twimg.com/profile_images/1572570090226302976/iT4rPjOL_400x400.png'
		}
	]

	const calDate = (date) => {
		const date1 = new Date();
		const date2 = new Date(date)
		var diff = new DateDiff(date1, date2);
		// console.log(date2.toString().split(' '))
		if(diff.minutes() <= 60){
			return Math.trunc(diff.minutes()) + 'm'
		}else if(diff.hours() <= 24){
			return Math.trunc(diff.hours()) + 'h'
		}else if(diff.days() <= 30){
			return Math.trunc(diff.days()) + 'd'
		}else{
			const splitres = date2?.toString().split(' ')
			const res = splitres[1] + ' ' + splitres[2]
			return res
		} 
	}

	const sendNotify = async(newData) => {
		console.log(newData)
		const {data} = await axios.get(`${getUserByIdRoute}/${newData.from}`);
		const dat = {
			user:data.user,
			newData:newData
		}
		setNotify(true);
		setRevealNotify(dat);
		setTimeout(()=>{
			setNotify(false);
			setTimeout(()=>{
				setRevealNotify('');
			},400)
		},5000)
	}

	useEffect(()=>{
		if(tempData){	
			if(tempData?.group){
				if(currentChat?.group){
					if(!currentChat?._id?.includes(tempData?.from)){
						console.log(" iran")
						sendNotify(tempData);	
					}else{
						setArrivalMessage(tempData);				
					}	
				}else{
					console.log(" i onl yran")
					sendNotify(tempData);	
				}						
				setTempData('');				
			}else{
				if(currentChat._id!==tempData.from){
					sendNotify(tempData);
				}else{
					setArrivalMessage(tempData);				
				}						
				setTempData('');
			}
		}
	},[tempData])

	useEffect(()=>{
		refetchUser();
		setUserRefetchTrigger(false);
	},[userRefetchTrigger])

	useEffect(()=>{
		if(messagesRefetchTrigger){
			fetchMessages();
			setMessagesRefetchTrigger(false);			
		}
	},[messagesRefetchTrigger])

	const refetchUser = async() => {
		if(currentUser){
			const {data} = await axios.get(`${getUserByIdRoute}/${currentUser._id}`)
			setCurrentUser(data.user)			
		}
	}

	useEffect(()=>{
		socket.on('msg-recieve',(newData)=>{
			setTempData(newData);	
			// console.log(newData)	
		});

		socket.on('user-refetch',(data)=>{
			setUserRefetchTrigger(true)
		})

		socket.on('messages-refetch',(data)=>{
			setMessagesRefetchTrigger(true);
		})	
		return ()=>{
			socket.off('msg-recieve');
			socket.off('user-refetch');
			socket.off('messages-refetch');
		}

	},[])

	useEffect(()=>{
		fetchTimeLine();
	},[])

	const fetchTimeLine = async() => {
		const {data} = await axios.get(getAllPosts);
		setMainFeed(data.data.reverse())
	}

	useEffect(()=>{
		if(arrivalMessage) {
			setMessages((prev)=>[...prev,arrivalMessage]);
			setArrivalMessage('');
		}
	},[arrivalMessage]);

	function tConvert(i) {
		let split = i.split('T');
		const date = split[0];
		let time = split[1].split('.')[0]
	    // Check correct time format and split into components
	    time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

	    if (time.length > 1) { // If time format correct
	      time = time.slice(1); // Remove full string match value


	      time[2] = Number(time[2]) + 30;

	      if(Number(time[2])>60){
	      	time[2] = Number(time[2]) -60
	      	if(time[2]<10){
	      		time[2] = 0+ time[2].toString()
	      	}
	      	time[0] = Number(time[0]) + 1
	      }

	      time[0] = Number(time[0]) + 5;
	      time[5] = +time[0] < 12 || time[0] === 24 ? ' AM' : ' PM'; // Set AM/PM
	      time[0] = +time[0] % 12 || 12; // Adjust hours
	      
	      time.splice(3,1)
	      
	    }
	    return time.join(''); // return adjusted time or original string
  	}

	useEffect(()=>{
		if(searchText){
			findExplore()
		}
	},[searchText])

	const findExplore = async() => {
		const {data} = await axios.post(searchProfile,{
			searchText
		});
		setSearchResult(data.user);
	}

	const addEventListenerForMe = () => {
		const ele2 = document.getElementById('messageInput');
		setIconsReveal(true)
		if(ele2){
			ele2.addEventListener('focus',()=>{
				setIconsReveal(true);
			})
			ele2.addEventListener('blur',()=>{
				setIconsReveal(false);		
			})			
		}
	}

	useEffect(()=>{
		const ele = document.getElementById('exploreRightSearch')
		const ele2 = document.getElementById('messageInput');
		
		if(ele2){
			ele2.addEventListener('focus',()=>{
				setIconsReveal(true);
			})
			ele2.addEventListener('blur',()=>{
				setIconsReveal(false);		
			})			
		}
		if(ele){
			ele.addEventListener('focus',()=>{
				setRevealExploreInfo(true);
			})
			ele.addEventListener('blur',()=>{
				setTimeout(()=>{
					setRevealExploreInfo(false);
				},200)
			})			
		}
	},[currentWindow])

	

	useEffect(()=>{
		if(currentUser?.chats?.length > 0){
			setChats(currentUser?.chats);
		}
	},[currentUser])

	useEffect(()=>{
		if(currentUser && !clientConnected){
			setClientConnected(true)
			socket.emit('add-user',currentUser._id);
		}
	},[currentUser])

	const openEmojiInput = () => setEmojiInput(!emojiInput)

	
	const checkSimilarity = (array1,array2) => {
		// console.log(array1,array2)

		var is_same = (array1?.length == array2?.length) && array1?.every(function(element, index) {
		    return element === array2[index];
		});
		return is_same
	}

	const openFileInput = () => {
		if(url.length<4){
			document.getElementById('file1').click();
		}
	}

	useEffect(()=>{
		if(currentChat){
			setMessages([]);
			setLoading(false);
			fetchMessages();
		}
	},[currentChat])

	const fetchMessages = async() =>{
		if(currentChat.group){
			const {data} = await axios.post(getGroupMessage,{
				groupId:currentChat.groupId,
				from:currentUser._id
			})
			// console.log(data);
			setMessages(data);
			setLoading(true);
		}else{
			const {data} = await axios.post(getAllMsgRoute,{
				from:currentUser?._id,
				to:currentChat?._id
			})
			// console.log(data);
			setMessages(data);
			setLoading(true);
		}
	}	
	
	const sendMessageTo = async(tempMsg) => {
		const msg = tempMsg.message
		if(currentChat.group){
			for(let i = 0;i < currentChat._id.length; i++){
				socket.emit("add-msg",{
					to:currentChat._id[i],
					from:currentUser._id,
					group:true,
					message:msg,
					_id:tempMsg._id,
					seenBy:tempMsg.seenBy,
					updatedAt:tempMsg.updatedAt,
					senderImage:tempMsg.image
				})	
			}
		}else{
			socket.emit("add-msg",{
				to:currentChat._id,
				from:currentUser._id,
				message:msg,
				_id:tempMsg._id,
				seenBy:tempMsg.seenBy,
				updatedAt:tempMsg.updatedAt,
				senderImage:tempMsg.image
			})			
		}
		setTempMsg('');

		if(!currentChat.group){
			const check2 = await currentUser.chats.some(element=>{
				if(element._id === currentChat._id){
					return true;
				}
				return false
			})

			if(!check2){
				const tempChat = {_id:currentChat._id, name:currentChat.name, username:currentChat.username, image:currentChat.image, createdAt:currentChat?.createdAt, chats:currentChat.chats , newMessage:false, lastChat: msg, updatedMsg:new Date().toISOString() };

				const chats = [tempChat, ...currentUser.chats];
				const res = await axios.post(`${updateUserChats}/${currentUser._id}`,{
					chats
				})
				setCurrentUser(res.data.user);
			}else{
				const tempChat = {_id:currentChat._id, name:currentChat.name, username:currentChat.username, image:currentChat.image, createdAt:currentChat?.createdAt, chats:currentChat.chats , newMessage:false, lastChat: msg, updatedMsg:new Date().toISOString() };

				const idx = await currentUser.chats.findIndex(element=>{
					if(element._id === currentChat._id){
						return true
					}
					return false
				})
				let userChats = [...currentUser.chats];
				await userChats.splice(idx,1);
				userChats = [tempChat, ...userChats];
				// console.log(userChats)
				const res = await axios.post(`${updateUserChats}/${currentUser._id}`,{
					chats:userChats
				})
				setCurrentUser(res.data.user);
			}
		}else{
			const check2 = await currentUser.chats.some(element=>{
				if(element.groupId === currentChat.groupId){
					return true;
				}
				return false
			})
			if(!check2){
				const tempChat = {_id:currentChat._id, group:currentChat?.group, groupId:currentChat?.groupId, name:currentChat.name, username:currentChat.username, image:currentChat.image, createdAt:currentChat?.createdAt, chats:currentChat.chats , newMessage:false, lastChat: msg, updatedMsg:new Date().toISOString() };

				const chats = [tempChat, ...currentUser.chats];
				const res = await axios.post(`${updateUserChats}/${currentUser._id}`,{
					chats
				})
				setCurrentUser(res.data.user);
			}else{
				const tempChat = {_id:currentChat._id, group:currentChat?.group, groupId:currentChat?.groupId, name:currentChat.name, username:currentChat.username, image:currentChat.image, createdAt:currentChat?.createdAt, chats:currentChat.chats , newMessage:false, lastChat: msg, updatedMsg:new Date().toISOString() };

				const idx = await currentUser.chats.findIndex(element=>{
					if(element.groupId === currentChat.groupId){
						return true;
					}
					return false
				})
				let userChats = [...currentUser.chats];
				await userChats.splice(idx,1);
				userChats = [tempChat, ...userChats];
				const res = await axios.post(`${updateUserChats}/${currentUser._id}`,{
					chats:userChats
				})
				setCurrentUser(res.data.user);
			}
		}
		

		if(!currentChat?.group){
			const check3 = await currentChat.chats.some(element=>{
				if(element._id === currentUser._id){
					return true;
				}
				return false
			})

			if(!check3){
				const tempChat = {_id:currentUser._id, name:currentUser.name, username:currentUser.username, image:currentUser.image, createdAt:currentUser?.createdAt, chats:currentUser.chats , newMessage:true, lastChat: msg, updatedMsg:new Date().toISOString() };

				const chats2 = [tempChat, ...currentChat.chats];
				const res2 = await axios.post(`${updateUserChats}/${currentChat._id}`,{
					chats:chats2
				})
				socket.emit("refetch-user",{
					to:currentChat._id				
				})
			}else{
				const tempChat = {_id:currentUser._id, name:currentUser.name, username:currentUser.username, image:currentUser.image, createdAt:currentUser?.createdAt, chats:currentUser.chats , newMessage:true, lastChat: msg, updatedMsg:new Date().toISOString() };

				const idx2 = await currentChat.chats.findIndex(element=>{
					if(element._id === currentUser._id){
						return true
					}
					return false
				})
				let userChats = [...currentChat.chats];
				await userChats.splice(idx2,1);
				userChats = [tempChat, ...userChats];
				const res = await axios.post(`${updateUserChats}/${currentChat._id}`,{
					chats:userChats
				})
				socket.emit("refetch-user",{
					to:currentChat._id				
				})
			}
		}else{
			for(let i  = 0;i < currentChat._id.length ; i++){
				const {data} = await axios.get(`${getUserByIdRoute}/${currentChat._id[i]}`);
				const check3 = await data.user.chats.some(element=>{
					if(element.groupId === currentChat.groupId){
						return true;
					}
					return false
				})

				if(!check3){
					const tempChat = {_id:currentChat._id, group:currentChat?.group, groupId:currentChat?.groupId, name:currentChat.name, username:currentChat.username, image:currentChat.image, createdAt:currentChat?.createdAt, chats:currentChat.chats , newMessage:true, lastChat: msg, updatedMsg:new Date().toISOString() };

					const chats2 = [tempChat, ...data.user.chats];
					const res2 = await axios.post(`${updateUserChats}/${data?.user?._id}`,{
						chats:chats2
					})
					socket.emit("refetch-user",{
						to:data.user._id				
					})
				}else{
					const tempChat = {_id:currentChat._id, group:currentChat?.group, groupId:currentChat?.groupId, name:currentChat.name, username:currentChat.username, image:currentChat.image, createdAt:currentChat?.createdAt, chats:currentChat.chats , newMessage:true, lastChat: msg, updatedMsg:new Date().toISOString() };

					const idx2 = await data.user.chats.findIndex(element=>{
						if(element.groupId === currentChat.groupId){
							return true;
						}
						return false
					})
					let userChats = [...data.user.chats];
					await userChats.splice(idx2,1);
					userChats = [tempChat, ...userChats];
					const res = await axios.post(`${updateUserChats}/${data?.user?._id}`,{
						chats:userChats
					})
					socket.emit("refetch-user",{
						to:data.user._id				
					})
				}

			}
		}

	};

	const sendImageMessageTo = async(tempMsg,chat) => {
		const msg = tempMsg.message
		if(chat.group){
			for(let i = 0;i < chat._id.length; i++){
				socket.emit("add-msg",{
					to:chat._id[i],
					from:currentUser._id,
					group:true,
					message:msg,
					_id:tempMsg._id,
					seenBy:tempMsg.seenBy,
					updatedAt:tempMsg.updatedAt,
					senderImage:tempMsg.image
				})	
			}
		}else{
			socket.emit("add-msg",{
				to:chat._id,
				from:currentUser._id,
				message:msg,
				_id:tempMsg._id,
				seenBy:tempMsg.seenBy,
				updatedAt:tempMsg.updatedAt,
				senderImage:tempMsg.image
			})			
		}
		setTempMsg('');

		if(!chat.group){
			const check2 = await currentUser.chats.some(element=>{
				if(element._id === chat._id){
					return true;
				}
				return false
			})

			if(!check2){
				const tempChat = {_id:chat._id, name:chat.name, username:chat.username, image:chat.image, createdAt:chat?.createdAt, chats:chat.chats , newMessage:false, lastChat: msg, updatedMsg:new Date().toISOString() };

				const chats = [tempChat, ...currentUser.chats];
				const res = await axios.post(`${updateUserChats}/${currentUser._id}`,{
					chats
				})
				setCurrentUser(res.data.user);
			}else{
				const tempChat = {_id:chat._id, name:chat.name, username:chat.username, image:chat.image, createdAt:chat?.createdAt, chats:chat.chats , newMessage:false, lastChat: msg, updatedMsg:new Date().toISOString() };

				const idx = await currentUser.chats.findIndex(element=>{
					if(element._id === chat._id){
						return true
					}
					return false
				})
				let userChats = [...currentUser.chats];
				await userChats.splice(idx,1);
				userChats = [tempChat, ...userChats];
				// console.log(userChats)
				const res = await axios.post(`${updateUserChats}/${currentUser._id}`,{
					chats:userChats
				})
				setCurrentUser(res.data.user);
			}
		}else{
			const check2 = await currentUser.chats.some(element=>{
				if(element.groupId === chat.groupId){
					return true;
				}
				return false
			})
			if(!check2){
				const tempChat = {_id:chat._id, group:chat?.group, groupId:chat?.groupId, name:chat.name, username:chat.username, image:chat.image, createdAt:chat?.createdAt, chats:chat.chats , newMessage:false, lastChat: msg, updatedMsg:new Date().toISOString() };

				const chats = [tempChat, ...currentUser.chats];
				const res = await axios.post(`${updateUserChats}/${currentUser._id}`,{
					chats
				})
				setCurrentUser(res.data.user);
			}else{
				const tempChat = {_id:chat._id, group:chat?.group, groupId:chat?.groupId, name:chat.name, username:chat.username, image:chat.image, createdAt:chat?.createdAt, chats:chat.chats , newMessage:false, lastChat: msg, updatedMsg:new Date().toISOString() };

				const idx = await currentUser.chats.findIndex(element=>{
					if(element.groupId === chat.groupId){
						return true;
					}
					return false
				})
				let userChats = [...currentUser.chats];
				await userChats.splice(idx,1);
				userChats = [tempChat, ...userChats];
				const res = await axios.post(`${updateUserChats}/${currentUser._id}`,{
					chats:userChats
				})
				setCurrentUser(res.data.user);
			}
		}
		

		if(!chat?.group){
			const check3 = await chat.chats.some(element=>{
				if(element._id === currentUser._id){
					return true;
				}
				return false
			})

			if(!check3){
				const tempChat = {_id:currentUser._id, name:currentUser.name, username:currentUser.username, image:currentUser.image, createdAt:currentUser?.createdAt, chats:currentUser.chats , newMessage:true, lastChat: msg, updatedMsg:new Date().toISOString() };

				const chats2 = [tempChat, ...chat.chats];
				const res2 = await axios.post(`${updateUserChats}/${chat._id}`,{
					chats:chats2
				})
				socket.emit("refetch-user",{
					to:chat._id				
				})
			}else{
				const tempChat = {_id:currentUser._id, name:currentUser.name, username:currentUser.username, image:currentUser.image, createdAt:currentUser?.createdAt, chats:currentUser.chats , newMessage:true, lastChat: msg, updatedMsg:new Date().toISOString() };

				const idx2 = await chat.chats.findIndex(element=>{
					if(element._id === currentUser._id){
						return true
					}
					return false
				})
				let userChats = [...chat.chats];
				await userChats.splice(idx2,1);
				userChats = [tempChat, ...userChats];
				const res = await axios.post(`${updateUserChats}/${chat._id}`,{
					chats:userChats
				})
				socket.emit("refetch-user",{
					to:chat._id				
				})
			}
		}else{
			for(let i  = 0;i < chat._id.length ; i++){
				const {data} = await axios.get(`${getUserByIdRoute}/${chat._id[i]}`);
				const check3 = await data.user.chats.some(element=>{
					if(element.groupId === chat.groupId){
						return true;
					}
					return false
				})

				if(!check3){
					const tempChat = {_id:chat._id, group:chat?.group, groupId:chat?.groupId, name:chat.name, username:chat.username, image:chat.image, createdAt:chat?.createdAt, chats:chat.chats , newMessage:true, lastChat: msg, updatedMsg:new Date().toISOString() };

					const chats2 = [tempChat, ...data.user.chats];
					const res2 = await axios.post(`${updateUserChats}/${data?.user?._id}`,{
						chats:chats2
					})
					socket.emit("refetch-user",{
						to:data.user._id				
					})
				}else{
					const tempChat = {_id:chat._id, group:chat?.group, groupId:chat?.groupId, name:chat.name, username:chat.username, image:chat.image, createdAt:chat?.createdAt, chats:chat.chats , newMessage:true, lastChat: msg, updatedMsg:new Date().toISOString() };

					const idx2 = await data.user.chats.findIndex(element=>{
						if(element.groupId === chat.groupId){
							return true;
						}
						return false
					})
					let userChats = [...data.user.chats];
					await userChats.splice(idx2,1);
					userChats = [tempChat, ...userChats];
					const res = await axios.post(`${updateUserChats}/${data?.user?._id}`,{
						chats:userChats
					})
					socket.emit("refetch-user",{
						to:data.user._id				
					})
				}

			}
		}
	}

	useEffect(()=>{
		if(tempMsg){
			sendMessageTo(tempMsg);
			setTempMsg('');
		}
	},[tempMsg])

	useEffect(()=>{
		if(tempImage){
			sendImageMessageTo(tempImage?.image,tempImage?.chat);
		}
	},[tempImage])

	const sendMessage = async(e) => {
		if(e) e.preventDefault();

		const msg = messageText;
		setMessageText('');
		const msgs = [...messages];
		msgs.push({fromSelf:true,message:msg,updatedAt:new Date().toISOString()});
		setMessages(msgs);
		if(currentChat.group){
			const result = await axios.post(addGroupMessage,{
				from:currentUser._id,
				to:currentChat._id,
				message:msg,
				groupId:currentChat.groupId,
				image:currentUser.image
			})
			setTempMsg(result.data.msg)
		}else{
			const result = await axios.post(sendMsgRoute,{
				from:currentUser._id,
				to:currentChat._id,
				message:msg,
				image:currentUser.image
			})
			setTempMsg(result.data.msg)			
		}
	}

	const sendGifMessage = async(e) => {

		const msg = e;
		const msgs = [...messages];
		msgs.push({fromSelf:true,message:msg,updatedAt:new Date().toISOString()});
		setMessages(msgs);
		if(currentChat.group){
			const result = await axios.post(addGroupMessage,{
				from:currentUser._id,
				to:currentChat._id,
				message:msg,
				groupId:currentChat.groupId,
				image:currentUser.image
			})
			setTempMsg(result.data.msg)
		}else{
			const result = await axios.post(sendMsgRoute,{
				from:currentUser._id,
				to:currentChat._id,
				message:msg,
				image:currentUser.image
			})
			setTempMsg(result.data.msg)			
		}
	}

	useEffect(()=>{
		if(addThisImage){
			let msg = addThisImage;
			setAddThisImage('');
			const msgs = [...messages];
			msgs.push({fromSelf:true,message:msg,updatedAt:new Date().toISOString()});
			setMessages(msgs);
		}
	},[addThisImage])

	useEffect(()=>{
		currentChatVar = currentChat
	},[currentChat])

	const sendImageMessage = async(e,chat) => {

		const msg = e;
		if(chat?.group === currentChatVar?.group){
			if(JSON.stringify(chat._id) === JSON.stringify(currentChatVar._id)){
				setAddThisImage(msg);	
			}
		}else if(chat?._id === currentChatVar?._id){
			setAddThisImage(msg);		
		}
		if(chat?.group){
			const result = await axios.post(addGroupMessage,{
				from:currentUser?._id,
				to:chat?._id,
				message:msg,
				groupId:chat?.groupId,
				image:currentUser?.image
			})
			let dat = {
				image:result?.data?.msg,
				chat:chat
			}
			setTempImage(dat)
		}else{
			const result = await axios.post(sendMsgRoute,{
				from:currentUser?._id,
				to:chat?._id,
				message:msg,
				image:currentUser?.image
			})
			let dat = {
				image:result.data.msg,
				chat:chat
			}
			setTempImage(dat)			
		}
		return true
	}

	const seenChecker = async() => {
		const len = messages.length - 1 ;
		if(messages[len]?.seenBy){
			const check3 = await messages[len].seenBy.some(element=>{
				if(element === currentUser._id){
					return true;
				}
				return false
			})
			if(!check3){
				// console.log('checked');
				const seen = [currentUser._id, ...messages[len].seenBy];
				if(currentChat.group){
					const {data} = await axios.post(`${updateGroupMsg}/${messages[len]._id}`,{
						seenBy:seen
					})
					if(currentChat?.group){
						for (let i = 0; i<currentChat?._id.length; i++){
							socket.emit('refetch-messages',{
								to:currentChat?._id[i]
							});		
						}
					}else{
						socket.emit('refetch-messages',{
							to:currentChat?._id
						});					
					}
				}else{
					const {data} = await axios.post(`${updateMsg}/${messages[len]._id}`,{
						seenBy:seen
					})
					if(currentChat?.group){
						for (let i = 0; i<currentChat?._id.length; i++){
							socket.emit('refetch-messages',{
								to:currentChat?._id[i]
							});		
						}
					}else{
						socket.emit('refetch-messages',{
							to:currentChat?._id
						});					
					}					
				}
			}			
		}
	}


	const getUserImage  = async(id) => {
		// console.log(id)
		const {data} = await axios.get(`${getUserByIdRoute}/${id}`);
		if(data.user){
			let temp = senderImages;
			temp[id] = data?.user?.image;
			setSenderImages(temp);			
		}
	}

	const fetchSenderImages = async() => {
		// for (let i = 0; i<messages.length;i++){
		// 	if(!(messages[i].sender in senderImages)){
		// 		getUserImage(messages[i].sender)
		// 	}
		// }
	}


	const showSeenPeoples = async(ids) => {
		setFullScreenLoader(true);
		let users = []
		for (let i = 0; i<ids.length; i++){
			const {data} = await axios.get(`${getUserByIdRoute}/${ids[i]}`);
			users = [...users,data.user];
			if(i+1===ids.length){
				setFullScreenLoader(false);
				setOpenOverlay(users);
				setOverlayFor('Seen by');
			}
		}
	}

	const messageReadChecker = async() => {
		
		if(currentChat){
			if(!currentChat?.group){
				const idx = await currentUser.chats.findIndex(element=>{
					if(element._id === currentChat._id){
						return true
					}
					return false
				})
				let userChats = [...currentUser.chats];
				if(userChats[idx]?.newMessage){
					await userChats.splice(idx,1);
					await userChats.splice(idx,0,{...currentUser.chats[idx], 'newMessage':false})
					// userChats[idx] = {...currentUser.chats[idx], 'newMessage':false}
					const result = await axios.post(`${updateUserChats}/${currentUser._id}`,{
						chats:userChats
					})
					setCurrentUser(result.data.user);
				}
			}else{
				const idx = await currentUser.chats.findIndex(element=>{
					if(element.groupId === currentChat.groupId){
						return true
					}
					return false
				})				
				// console.log(idx)
				let userChats = [...currentUser.chats];
				if(userChats[idx]?.newMessage){
					await userChats.splice(idx,1);
					await userChats.splice(idx,0,{...currentUser.chats[idx], 'newMessage':false})
					// userChats[idx] = {...currentUser.chats[idx], 'newMessage':false}
					const result = await axios.post(`${updateUserChats}/${currentUser._id}`,{
						chats:userChats
					})
					setCurrentUser(result.data.user);
				}
			}
		}
	}

	useEffect(()=>{
		scrollRef.current?.scrollIntoView({behaviour:"smooth"});
		if(messages.length>0  && currentUser){
			seenChecker();
			messageReadChecker();
			fetchSenderImages();
		}
	},[messages])

	useEffect(()=>{
		scrollRef.current?.scrollIntoView({behaviour:"smooth"});
		if(messages.length>0 && currentUser) {
			seenChecker()
		}	
	},[currentWindow])

	const imagePathCheck = (path) =>{
		if(path){
			if(path.split('/').includes('data:image')){
				return true;				
			}
		}
	}

	const url1Setter = () =>{
		const file_input = document.getElementById('file1');
		const files = file_input?.files;
		setPath('')
		Object.keys(files)?.forEach(i=>{
			const file = files[i];
			const reader = new FileReader();
			reader.addEventListener('load',()=>{
				let uploaded_file = reader.result;
				if(imagePathCheck(uploaded_file)){
					setUploadArray(uploadArray=>[...uploadArray,uploaded_file]);
				}
			})
			reader.readAsDataURL(file);
		})
	}

	const url2Setter = () =>{
		const file_input = document.getElementById('file2');
		const files = file_input?.files;
		setPath('')
		Object.keys(files)?.forEach(i=>{
			const file = files[i];
			const reader = new FileReader();
			reader.addEventListener('load',()=>{
				let uploaded_file = reader.result;
				if(imagePathCheck(uploaded_file)){
					setUploadArray(uploadArray=>[...uploadArray,uploaded_file]);
				}
			})
			reader.readAsDataURL(file);
		})
	}


	const startUploadingImage = async() => {
		setUploading(true);
		const needToUploadArray = uploadArray;
		setUploadArray([]);
		const chat = currentChat;
		let i = 0
		uploadImage(needToUploadArray,i,chat,uploadArray.length);
	}

	const uploadImage = async(url,i,chat,needToUploadArrayLength) => {
		imagekit.upload({
	    file : url[i], //required
	    folder:"Images",
	    fileName : 'TNS_BIRD',   //required
		}).then(async(response) => {
			let res = await sendImageMessage(response.url,chat);
			if(Number(i)+1 === needToUploadArrayLength){
				setTimeout(()=>{
					setUploading(false);
				},500)
			}else{
				uploadImage(url,i+1,chat,needToUploadArrayLength)
			}
		}).catch(error => {
		    console.log(error.message)
		});
	}

	if(currentWindow === 'Messages'){
		return (
			<div className={`lg:w-[50.6%] md:w-[80%] xs:w-[90%] w-[100%] ${currentChat ? 'relative':'hidden lg:block'} relative  overflow-hidden`}>
				<div className={`h-full w-full backdrop-blur-lg px-3 bg-black/30 left-0 flex items-center justify-center fixed z-50 ${uploadArray.length>0  ? 'block' : 'hidden'} bg-black/40`}>
					<div className={`max-w-3xl mx-auto md:h-[85%] h-[93%] bg-white px-2 rounded-xl border-[2px] border-gray-400/60 shadow-xl overflow-y-scroll 
					scrollbar-none relative`}>
						<div className="grid grid-cols-1 md:grid-cols-2 md:gap-2 pb-12">
							<div className="w-full flex flex-col md:gap-3 gap-2 py-4 pl-2 pr-1">
								{	
									uploadArray?.map((ima,j)=>(
										<img src={ima} key={j} className={`rounded-xl shadow-xl w-full hover:scale-105 transition-all 
										duration-200 ease-in ${j%2===1 && 'hidden'}`}/>
									))
								}
							</div>
							<div className="w-full flex flex-col md:gap-3 gap-2 py-4 pl-2 pr-1">
								{	
									uploadArray?.map((ima,j)=>(
										<img src={ima} key={j} className={`rounded-xl shadow-xl w-full hover:scale-105 transition-all 
										duration-200 ease-in ${j%2===0 && 'hidden'}`}/>
									))
								}
							</div>
						</div>
						<div className="fixed border-t-[1px] border-l-[1px] border-r-[1px] border-gray-400/50 rounded-t-xl overflow-hidden 
						bg-white md:h-14 h-12 flex items-center w-full md:bottom-[8%] bottom-[0%] md:max-w-2xl sm:max-w-lg xs:max-w-md max-w-sm right-0 mx-auto left-0 ">
							<div 
							onClick={()=>{setUploadArray([]);setPath('')}}
							className="w-[50%] h-full cursor-pointer rounded-t-md hover:bg-gray-200 transition-all duration-200 ease-in-out
							flex items-center justify-center">
								<button className="text-xl text-red-600 font-semibold">Cancel</button>
							</div>
							<div 
							onClick={startUploadingImage}
							className="w-[50%] h-full cursor-pointer rounded-t-md hover:bg-gray-200 transition-all duration-200 ease-in-out
							flex items-center justify-center">
								<button className="text-xl text-green-600 font-semibold">Confirm</button>
							</div>
						</div>
						
					</div>
				</div>
				<div className={`h-full w-full backdrop-blur-lg bg-white flex items-center justify-center absolute z-40 ${loading && 'hidden'}`}>
					<span className="loader3"></span>
				</div>
				<div className={`w-full ${!currentChat && 'hidden'} overflow-hidden px-5 sticky top-0 backdrop-blur-lg bg-white/50 flex justify-between p-2`}>
					<div 
					onClick={()=>{
						if(!currentChat?.group){
							setCurrentWindow('Profile')
							window.history.replaceState({id:100},'Default',`?profile=${currentChat._id}`);	
							setCurrentChat('')													
						}
					}}
					className="flex cursor-pointer items-center lg:ml-0 ml-7 gap-2 shrink">
						{
							!currentChat?.group ?
							<img src={currentChat.image} className="h-7 w-7 rounded-full "/>
							:
							<div className="grid-cols-2 grid h-7 w-7 rounded-full overflow-hidden">
								{
									currentChat?.image?.map((img,j)=>{
										if(currentChat.image.length === 3){
											if(j<2){
												return (
													<img src={img} key={j} className="object-cover w-full h-full" alt=""/>
												)
											}
										}else{
											if(j<4){
												return (
													<img src={img} key={j} className="object-cover w-full h-full" alt=""/>
												)
											}	
										}
										
									})
								}
							</div>

						}
						<h1 className="text-md text-black font-semibold truncate">{currentChat.name}</h1>
					</div>
					<div 
					onClick={()=>{
						if(!currentChat?.group){
							setCurrentWindow('Profile')
							window.history.replaceState({id:100},'Default',`?profile=${currentChat._id}`);	
							setCurrentChat('')													
						}
					}}
					className="p-2 cursor-pointer rounded-full md:hover:bg-gray-600/10 transition-all duration-200 ease-in-out">
						<AiOutlineInfoCircle className="h-5 w-5 text-gray-800"/>
					</div>
				</div>
				<div 
				onClick={()=>{setCurrentChat('');setMessages([])}}
				className="sticky w-8 h-8 flex items-center justify-center rounded-full z-45 left-2 lg:hidden top-2 cursor-pointer p-1 hover:bg-gray-200/70 transition-all duration-200 ease-in-out">
					<BsArrowLeft className="h-6 w-5 text-gray-800"/>
				</div>
				<div className="h-full pt-[115px] w-full scrollbar-thin scrollbar-thumb-sky-500 scrollbar-track-gray-200/50 overflow-y-scroll scroll-smooth">
					{
						!currentChat ? 
						<div className="h-full w-full flex items-center justify-center">
							<div className="lg:w-[60%] w-full px-4 flex flex-col gap-1">
								<h1 className="md:text-3xl text-2xl font-bold text-black">
									Select a message
								</h1>
								<h1 className="text-md text-gray-500">
									Choose from your existing conversations, start a new one, or just keep swimming.
								</h1>
								<div onClick={()=>{setNewMessageSearch(true)}}
								className="flex">
									<button className="rounded-full text-lg md:px-9 px-6 md:py-3 py-1 bg-blue-500 hover:bg-blue-700 
									transition-all duration-200 ease-in-out text-white mt-7 font-bold">New message</button>
								</div>
							</div>
						</div>	
						:
						<div className="mt-2 w-full flex flex-col px-5">
							<div 
							onClick={()=>{
								if(!currentChat?.group){
									setCurrentWindow('Profile')
									window.history.replaceState({id:100},'Default',`?profile=${currentChat._id}`);																
								}
							}}
							className="w-full hover:bg-gray-100 rounded-md transition-all duration-200 ease-in-out 
							cursor-pointer px-4 py-6 pb-14 border-gray-200/70 border-b-[1px] flex flex-col">
								{
									currentChat.group ? 
									<div className="h-[70px] w-[70px] rounded-full overflow-hidden mx-auto grid grid-cols-2">
										{
											currentChat?.image?.map((img,j)=>{
												if(currentChat.image.length === 3){
													if(j<2){
														return (
															<img src={img} key={j} className="object-cover w-full h-full" alt=""/>
														)
													}
												}else{
													if(j<4){
														return (
															<img src={img} key={j} className="object-cover w-full h-full" alt=""/>
														)
													}	
												}
											})
										}
									</div>
									:
									<img src={currentChat.image} alt="" className="h-[70px] w-[70px] rounded-full mx-auto"/>
								}
								<h1 className="text-black text-lg font-bold select-none text-center mx-auto">{currentChat?.name}</h1>
								<h1 className="text-gray-600 text-md select-none text-center mx-auto">@{currentChat?.username}</h1>
								<h1 className="text-gray-900 mt-5 select-none text-center mx-auto">{currentChat?.description}</h1>
								<h1 className="text-gray-600 mt-2 select-none text-center mx-auto">{currentChat.group ? 'Created at':'Joined'} {currentChat?.createdAt?.split('T')[0]} {!currentChat?.group && <span> - {currentChat?.followers?.length} Followers</span>}</h1>
								{
								!currentChat?.group &&
								<h1 className="text-gray-600 text-sm select-none mt-2 text-center mx-auto">Not followed by anyone you are following</h1>
								}
							</div>
						</div>
					}
					<div className={`flex flex-col h-auto gap-3 md:px-3 px-2 py-2 w-full ${!currentChat && 'hidden'}`}>
						{
							messages?.map((msg,j)=>(
								<div ref={scrollRef} key={j} className={`flex w-full ${msg.fromSelf ? 'justify-end':'justify-start'} gap-1`}>
									{
										!msg.fromSelf &&
										<img id={msg.sender} src={msg.senderImage} className={`h-8 w-8 mt-1 rounded-full ${msg.sender}`}/>
									}
									<div className={`flex flex-col gap-1  ${msg.fromSelf ? 'justify-end':'justify-start'} max-w-[80%]`}>
										<div className={`rounded-2xl ${msg.fromSelf ? 'ml-auto' : 'mr-auto'}  flex ${( msg.message.includes('media.tenor.com') || msg.message.includes('ik.imagekit.io/d3kzbpbila/Images') ) ? 'p-0	': 'px-[14px] py-2 '} 
										${msg.fromSelf ? 'bg-sky-500 hover:bg-sky-600' : 'bg-gray-300/50 hover:bg-gray-300/70'} hover:scale-[102%] transition-all 
										duration-100 ease-out`}>
											{
												msg?.message?.includes('media.tenor.com') ?
												<img src={msg.message} className={`${msg.fromSelf ? 'text-white' : 'text-black'} rounded-xl shadow-lg`} />
												:
												msg?.message?.includes('ik.imagekit.io/d3kzbpbila/Images') ? 
												<img src={msg?.message} className={`${msg.fromSelf ? 'text-white' : 'text-black'} rounded-xl shadow-lg`} />
												:
												<h1 className={`${msg.fromSelf ? 'text-white' : 'text-black'} text-md break-all`}>{msg.message}</h1>
											}
										</div>
										<h1 className={`text-gray-600/70 ${msg.fromSelf ? 'text-end':'text-start'} ${msg.fromSelf ? 'justify-end':'justify-start'} text-sm mx-1 select-none cursor-pointer hover:underline flex `}>
										{tConvert(msg?.updatedAt)}&nbsp;
										{msg.seenBy && currentChat.group ?
											<span
											onClick={()=>{
												showSeenPeoples(msg.seenBy);
												console.log(msg.seenBy.includes(currentUser._id))
											}}
											>{
												j+1 === messages.length && msg.fromSelf &&
											 	<span> {
											 	msg?.seenBy?.includes(currentUser._id) ? 
											 		msg?.seenBy?.length - 1 === 1 ?
											 			`• Seen by ${msg.seenBy.length-1} person`
											 			:
											 			msg?.seenBy?.length - 1 !== 0 &&
											 			`• Seen by ${msg.seenBy.length-1} people`
											 		: 
											 		msg?.seenBy?.length === 1 ?
											 			`• Seen by ${msg.seenBy.length-1} person`
											 			:
											 			msg?.seenBy?.length !== 0 &&
											 			`• Seen by ${msg.seenBy.length-1} people`
											 	} </span>
											}</span>
											:
											msg?.seenBy?.includes(currentChat._id) && j+1 === messages?.length && msg?.fromSelf && ' • Seen'
										}
										</h1>
									</div>
								</div>

							))
						}
					</div>
				</div>
				<div className={`${!currentChat && 'hidden' } backdrop-blur-lg bg-white/40 sticky bottom-0 w-full px-2 py-2 border-t-[1px] border-gray-200/70`}>
					<div className="bg-gray-200/70 relative rounded-2xl flex items-center gap-2 py-[6px] px-2">
						<div className="absolute -top-2 left-0 w-full">	
							{
								uploading &&
								<div className="loader w-full mx-auto"></div>
							}
						</div>
						<div className="flex items-center">
							<div className="hover:bg-sky-200/80 transition-all box-border duration-200 ease-in-out p-2 rounded-full cursor-pointer">
								<BsCardImage onClick={openFileInput} className={`h-[18px] w-[18px] ${url.length<4 ? 'text-sky-500':'text-gray-500'}`}/>
								<input type="file" id="file1" accept="image/*" 
								value={path} onChange={(e)=>{setPath(e.target.value);url1Setter()}}
								hidden multiple="multiple"
								/>
							</div>
							<div className="hover:bg-sky-200/80 relative transition-all box-border duration-200 ease-in-out p-2 rounded-full cursor-pointer">
								<TbGif onClick={()=>setGifInput(!gifInput)} className="text-sky-500 h-[18px] w-[18px]"/>
								<div className={`absolute z-50 ${gifInput ? '-left-10' : '-left-[1000px]'} bottom-12 transition-all duration-200 ease-in-out`} >
							      <GifPicker tenorApiKey={process.env.NEXT_PUBLIC_TERNOR} height="450px" width={gifWidth} 
							      autoFocusSearch="true" theme="dark"  onGifClick={(e)=>{
							      		setGifInput(false);
							      		sendGifMessage(e?.url)
							      }} />
							    </div>							
							</div>
							<div className="hover:bg-sky-200/80 z-40 relative transition-all box-border duration-200 ease-in-out p-2 rounded-full cursor-pointer">
								<BsEmojiSmile onClick={openEmojiInput} className={`h-[18px] w-[18px] text-sky-500 z-30 ${iconsReveal && 'hidden w-0 overflow-hidden'}`}/>
								{
									emojiInput &&
									<div className="absolute bottom-11 -left-[65px] z-50">
										<EmojiPicker Theme="dark" onEmojiClick={(emoji)=>{
											setMessageText((messageText)=>{return messageText+' '+emoji.emoji})
										}}/>
									</div>											
								}
							</div>
						</div>	
						<div className="w-[100%]">
							<input type="text" 
							onSubmit={(e)=>sendMessage(e)}
							value={messageText}
							onChange={(e)=>{setMessageText(e.target.value)}}
							className="outline-none bg-transparent placeholder:text-gray-500 text-black text-md w-full" 
							placeholder="Start a new message"/>
						</div>
						<div 
						onClick={()=>{if(messageText.length>0) sendMessage()}}
						className="rounded-full mr-1 hover:bg-sky-100 transition-all duration-200 ease-in-out cursor-pointer">
							{
								messageText ? 
								<RiSendPlane2Line className="h-5 w-5 text-sky-500"/>
								:
								<CiMicrophoneOn 
								onClick = {()=>{

								}}
								className="h-5 w-5 text-sky-500"/>
							}
						</div>
					</div>
					
				</div>
				
			</div>

		)
	}else{
		return (
			<div className="lg:w-[40.4%] relative xl:w-[32.4%] w-0 hidden lg:block h-full pl-7 pr-10 overflow-y-scroll scrollbar-thin scrollbar-thumb-sky-400">
				<div className={`h-full w-full backdrop-blur-lg px-3 bg-black/30 left-0 flex items-center justify-center fixed z-50 ${uploadArray.length>0  ? 'block' : 'hidden'} bg-black/40`}>
					<div className={`max-w-3xl mx-auto md:h-[85%] h-[93%] bg-white px-2 rounded-xl border-[2px] border-gray-400/60 shadow-xl overflow-y-scroll 
					scrollbar-none relative`}>
						<div className="grid grid-cols-1 md:grid-cols-2 md:gap-2 pb-12">
							<div className="w-full flex flex-col md:gap-3 gap-2 py-4 pl-2 pr-1">
								{	
									uploadArray?.map((ima,j)=>(
										<img src={ima} key={j} className={`rounded-xl shadow-xl w-full hover:scale-105 transition-all 
										duration-200 ease-in ${j%2===1 && 'hidden'}`}/>
									))
								}
							</div>
							<div className="w-full flex flex-col md:gap-3 gap-2 py-4 pl-2 pr-1">
								{	
									uploadArray?.map((ima,j)=>(
										<img src={ima} key={j} className={`rounded-xl shadow-xl w-full hover:scale-105 transition-all 
										duration-200 ease-in ${j%2===0 && 'hidden'}`}/>
									))
								}
							</div>
						</div>
						<div className="fixed border-t-[1px] border-l-[1px] border-r-[1px] border-gray-400/50 rounded-t-xl overflow-hidden 
						bg-white md:h-14 h-12 flex items-center w-full md:bottom-[8%] bottom-[0%] md:max-w-2xl sm:max-w-lg xs:max-w-md max-w-sm right-0 mx-auto left-0 ">
							<div 
							onClick={()=>{setUploadArray([]);setPath('')}}
							className="w-[50%] h-full cursor-pointer rounded-t-md hover:bg-gray-200 transition-all duration-200 ease-in-out
							flex items-center justify-center">
								<button className="text-xl text-red-600 font-semibold">Cancel</button>
							</div>
							<div 
							onClick={startUploadingImage}
							className="w-[50%] h-full cursor-pointer rounded-t-md hover:bg-gray-200 transition-all duration-200 ease-in-out
							flex items-center justify-center">
								<button className="text-xl text-green-600 font-semibold">Confirm</button>
							</div>
						</div>
						
					</div>
				</div>
				<div className="flex flex-col w-full">
					<div className={`mt-2 relative bg-gray-200/70 rounded-full px-5 py-2 focus-within:bg-transparent w-full
					focus-within:border-sky-500 border-[1.5px]  flex gap-3 items-center ${currentWindow === 'Explore' && 'hidden'}`}>
						<FiSearch className="h-5 w-5 text-gray-700 peer-active:text-sky-600 "/>
						<input type="text" id="exploreRightSearch" placeholder="Search twitter" 
						value={searchText} onChange={(e)=>setSearchText(e.target.value)}
						className="w-full bg-transparent peer outline-none placholder:text-gray-500 text-black text-lg"/>
						<div className={`absolute left-0 top-[52px] bg-white w-full shadow-xl rounded-xl overflow-hidden border-gray-300/80 
						${revealExploreInfo ? 'border-[1px] max-h-[400px]' : 'h-0 overflow-hidden'} px-2 flex flex-col`}>
							<h1 className={`my-5  text-md ${!searchText && 'text-center' } w-full text-gray-500 `}>
							{ 
								!searchText ? 
								'Try searching for people, topics, or keywords'
								:
								`Search for "${searchText}"`
							}
							</h1>
							{
								searchResult?.map((res,i)=>(
									<div key={i}
									onClick={()=>{
										setCurrentWindow('Profile')
										window.history.replaceState({id:100},'Default',`?profile=${res._id}`);
										setNeedToReloadProfile(true)
									}}
									className="flex z-40 overflow-hidden cursor-pointer gap-[7px] w-full px-4 w-full hover:bg-gray-200/50 transition-all duration-200 ease-in-out py-3">
										<img src={res.image} className="h-12 w-12 rounded-full"/>
										<div className="flex flex-col truncate shrink">
											<span className="text-black text-md truncate font-semibold m-0 p-0">{res.name}</span>
											<span className="text-gray-500 truncate text-md m-0 p-0">@{res.username}</span>
										</div>
									</div>

								))
							}
						</div>
					</div>
					<div className={`mt-5 rounded-2xl bg-gray-300/20 flex flex-col overflow-hidden ${currentWindow === 'Explore' && 'hidden'}`}>
						<h1 className="my-3 mx-4 text-xl text-black font-bold">What is happening</h1>
						{
							tempEventData.map((event,i)=>(
								<div key={i} className="flex justify-between cursor-pointer hover:bg-gray-200 transition-all duration-200 ease-in-out p-4">
									<div className="flex flex-col ">
										<h1 className="text-gray-600 text-md">{event.head}</h1>
										<h1 className="text-black text-lg font-semibold">{event.text}</h1>
									</div>
									<div className="">
										<img className="h-14 w-14 rounded-2xl " src={event.image} alt=""/>
									</div>
								</div>
							))
						}
						{
							tempHashData.map((hash,j)=>(
								<div key={j} className="flex justify-between cursor-pointer hover:bg-gray-200 transition-all duration-200 ease-in-out p-4">
									<div className="flex flex-col ">
										<h1 className="text-gray-600 text-md">{hash.head}</h1>
										<h1 className="text-black text-lg font-semibold">{hash.text}</h1>
									</div>
									<div className="">
										<BsThreeDots className="text-gray-600 h-5 w-5"/>
									</div>
								</div>
							))
						}
						{
							tempTextData.map((text,k)=>(
								<div key={k} className="flex justify-between cursor-pointer hover:bg-gray-200 transition-all duration-200 ease-in-out p-4">
									<div className="flex flex-col ">
										<h1 className="text-gray-500 text-md">{text.head}</h1>
										<h1 className="text-black text-lg font-semibold">{text.text}</h1>
										<h1 className="text-gray-400 text-md">{text.tweets} Tweets</h1>
									</div>
									<div className="">
										<BsThreeDots className="text-gray-600 h-5 w-5"/>
									</div>
								</div>
							))
						}
						<div className="flex justify-between cursor-pointer hover:bg-gray-200 transition-all duration-200 ease-in-out p-4 w-full">
							<h1 className="text-lg text-sky-500 font-semibold">Show more</h1>
						</div>
					</div>
					<div className="mt-5 mb-[70px] rounded-2xl bg-gray-300/20 flex flex-col overflow-hidden">
						<h1 className="my-3 mx-4 text-xl text-black font-bold">Who to follow</h1>
						{
							whoToFollow.map((who,i)=>(
								<div className="p-4 flex justify-between hover:bg-gray-200 
								transition-all duration-200 ease-in-out cursor-pointer" key={i}>
									<div className="flex gap-2 items-center">
										<img src={who.image} className="h-12 w-12"/>
										<div className="flex flex-col gap-[2px]">
											<h1 className="text-black text-md font-semibold">{who.name}</h1>
											<h1 className="text-gray-500 text-md">@{who.username}</h1>
										</div>
									</div>
									<div className="">
										<button className="shrink rounded-full bg-black text-white font-semibold px-5 py-1">
											Follow
										</button>
									</div>
								</div>
							))
						}
						<div className="flex justify-between cursor-pointer hover:bg-gray-200 transition-all duration-200 ease-in-out p-4 w-full">
							<h1 className="text-lg text-sky-500 font-semibold">Show more</h1>
						</div>
					</div>
				</div>
				<div className={`fixed right-7 lg:w-[36.4%] xl:w-[28.4%] w-0 border-gray-300 border-[1.5px] flex flex-col h-full 
				overflow-hidden bg-white ${!currentChat && 'pt-4'} h-[95%] w-full ${msgReveal ? '-bottom-[60px]' : '-bottom-[90%]'} transition-all 
				duration-200 ease-in-out  rounded-2xl shadow-xl pb-[60px] ${!currentUser && 'hidden'} `}>
					<div className={`flex cursor-pointer items-center justify-between ${currentChat && 'hidden'} w-full px-5 shadow-sm pb-3 mx-auto`}>
						<h1 
						onClick={()=>setMsgReveal(!msgReveal)}
						className="text-black text-2xl select-none font-semibold">Messages</h1>
						<div className="flex items-center">
							<div 
							onClick={()=>{setNewMessageSearch(true);setMsgReveal(true)}}
							className="p-[6px] rounded-full cursor-pointer hover:bg-gray-200/70 transition-all duration-200 ease-in-out">
								<RiMailAddLine className="h-5 w-5 text-black"/>
							</div>
							<div 
							onClick={()=>setMsgReveal(!msgReveal)}
							className="p-[6px] rounded-full cursor-pointer hover:bg-gray-200/70 transition-all duration-200 ease-in-out">
								<HiOutlineChevronDoubleDown className={`h-5 w-5 text-black ${!msgReveal && 'rotate-180'  }`}/>
							</div>
						</div>
					</div>
					<div className={`h-[100%] transition-all duration-200 ease-in-out flex-col flex w-full`}>
						{
							currentChat ? 
							<div className="h-full w-full flex flex-col relative">
								<div className={`h-full w-full backdrop-blur-lg bg-white flex items-center justify-center absolute z-50 ${loading && 'hidden'}`}>
									<span className="loader3"></span>
								</div>
								<div className={`w-full sticky top-0 backdrop-blur-lg bg-white/50 ${msgReveal ? 'py-3':'py-4' } ${!msgReveal && 'pb-7'} 
								flex justify-between overflow-hidden items-center px-2 shadow-md`}>
									<div className="flex gap-3 items-center overflow-hidden">
										<div onClick={()=>setCurrentChat('')} 
										className="p-2 cursor-pointer rounded-full hover:bg-gray-200 transition-all duration-200 ease-in-out">
											<HiOutlineArrowLeft className="h-5 w-5 text-gray-800"/>
										</div>
										<div 
										onClick={()=>{
											setMsgReveal(!msgReveal);
										}}
										className="flex cursor-pointer flex-col truncate shrink">
											<span className="text-lg text-black truncate font-semibold">{currentChat?.name}</span>
											{
												msgReveal &&
												<span className="text-md truncate text-gray-500">@{currentChat?.username}</span>
											}
										</div>
									</div>
									<div 
									onClick={()=>{
										setMsgReveal(!msgReveal);
									}}
									className="p-[6px] rounded-full cursor-pointer hover:bg-gray-200/70 transition-all duration-200 ease-in-out">
										<HiOutlineChevronDoubleDown className={`h-5 w-5 text-black ${!msgReveal && 'rotate-180'  }`}/>
									</div>	
								</div>
								<div className="w-full h-full overflow-y-scroll flex-col flex scrollbar scrollbar-thin scrollbar-thumb-sky-400 
								scrollbar-track-gray-200 pb-14">
									<div 
									onClick={()=>{
										if(!currentChat?.group){
											setCurrentWindow('Profile')
											window.history.replaceState({id:100},'Default',`?profile=${currentChat._id}`);
											setNeedToReloadProfile(true)																
										}							
									}}
									className="w-full mt-2 hover:bg-gray-100 rounded-md transition-all duration-200 ease-in-out 
									cursor-pointer px-4 py-6 pb-14 border-gray-200/70 border-b-[1px] flex flex-col">
										{
											currentChat?.group ? 
											<div className="h-[70px] w-[70px] rounded-full overflow-hidden mx-auto grid grid-cols-2">
												{
													currentChat?.image?.map((img,j)=>{
														if(currentChat.image.length === 3){
															if(j<2){
																return (
																	<img src={img} key={j} className="object-cover w-full h-full" alt=""/>
																)
															}
														}else{
															if(j<4){
																return (
																	<img src={img} key={j} className="object-cover w-full h-full" alt=""/>
																)
															}	
														}
													})
												}
											</div>
											:
											<img src={currentChat.image} alt="" className="h-[70px] w-[70px] rounded-full mx-auto"/>
										}
										<h1 className="text-black text-lg font-bold select-none text-center mx-auto">{currentChat?.name}</h1>
										<h1 className="text-gray-600 text-md select-none text-center mx-auto">@{currentChat?.username}</h1>
										<h1 className="text-gray-900 mt-5 select-none text-center mx-auto">{currentChat?.description}</h1>
										<h1 className="text-gray-600 mt-2 select-none text-center mx-auto">{currentChat.group ? 'Created at':'Joined'} {currentChat?.createdAt?.split('T')[0]} {!currentChat?.group && <span> - {currentChat?.followers?.length} Followers</span>}</h1>
										{
										!currentChat?.group &&
										<h1 className="text-gray-600 text-sm select-none mt-2 text-center mx-auto">Not followed by anyone you are following</h1>
										}
									</div>
									<div className={`flex flex-col h-auto gap-3 md:px-3 px-2 py-2 w-full ${!currentChat && 'hidden'}`}>
										{
											messages?.map((msg,j)=>(
												<div ref={scrollRef} key={j} className={`flex w-full ${msg.fromSelf ? 'justify-end':'justify-start'} gap-1`}>
													{
														!msg?.fromSelf && 
														<img id={msg?.sender} src={msg?.senderImage} alt=" " className="h-8 w-8 mt-1 rounded-full"/>
													}
													<div className={`flex flex-col gap-1  ${msg.fromSelf ? 'justify-end':'justify-start'} max-w-[80%]`}>
														<div className={`rounded-2xl ${msg.fromSelf ? 'ml-auto' : 'mr-auto'}  flex ${( msg.message.includes('media.tenor.com') || msg.message.includes('ik.imagekit.io/d3kzbpbila/Images') ) ? 'p-0	': 'px-[14px] py-2 '}
														${msg.fromSelf ? 'bg-sky-500 hover:bg-sky-600' : 'bg-gray-300/50 hover:bg-gray-300/70'} hover:scale-[102%] transition-all 
														duration-100 ease-out`}>
															{
																msg.message.includes('media.tenor.com') ?
																<img src={msg.message} className={`${msg.fromSelf ? 'text-white' : 'text-black'} rounded-xl shadow-lg`} />
																:
																msg?.message?.includes('ik.imagekit.io/d3kzbpbila/Images') ? 
																<img src={msg?.message} className={`${msg.fromSelf ? 'text-white' : 'text-black'} rounded-xl shadow-lg`} />
																:
																<h1 className={`${msg.fromSelf ? 'text-white' : 'text-black'} text-md break-all`}>{msg.message}</h1>
															}
														</div>
														<h1 className={`text-gray-600/70 ${msg.fromSelf ? 'text-end':'text-start'} ${msg.fromSelf ? 'justify-end':'justify-start'} text-sm mx-1 select-none cursor-pointer hover:underline flex `}>
														{tConvert(msg?.updatedAt)}&nbsp;
														{msg.seenBy && currentChat.group ?
															<span
															onClick={()=>{
																showSeenPeoples(msg.seenBy);
																console.log(msg.seenBy.includes(currentUser._id))
															}}
															>{
																j+1 === messages.length && msg.fromSelf &&
															 	<span> {
															 	msg?.seenBy?.includes(currentUser._id) ? 
															 		msg?.seenBy?.length - 1 === 1 ?
															 			`• Seen by ${msg.seenBy.length-1} person`
															 			:
															 			msg?.seenBy?.length - 1 !== 0 &&
															 			`• Seen by ${msg.seenBy.length-1} people`
															 		: 
															 		msg?.seenBy?.length === 1 ?
															 			`• Seen by ${msg.seenBy.length-1} person`
															 			:
															 			msg?.seenBy?.length !== 0 &&
															 			`• Seen by ${msg.seenBy.length-1} people`
															 	} </span>
															}</span>
															:
															msg?.seenBy?.includes(currentChat._id) && j+1 === messages?.length && msg?.fromSelf && ' • Seen'
														}
														</h1>
													</div>
												</div>

											))
										}
									</div>

								</div>


								<div className="absolute bottom-0 py-1 px-3 bg-white w-full">
									<div className="rounded-xl bg-gray-200/60 w-full flex px-2 py-1 items-center">
										<div className="flex items-center">
											<div className="absolute -top-1 left-0 w-[98%]">	
												{
													uploading &&
													<div className="loader w-full mx-auto"></div>
												}
											</div>
											<div className={`cursor-pointer rounded-full p-2 hover:bg-gray-200/60 transition-all duration-200 ease-in-out ${iconsReveal && 'hidden w-0 overflow-hidden'}`}>
												<BsCardImage onClick={()=>{
													document.getElementById('file2').click();
												}} className={`h-[18px] w-[18px] ${url.length<4 ? 'text-sky-500':'text-gray-500'}`}/>
												<input type="file" id="file2" accept="image/*" 
												value={path} onChange={(e)=>{setPath(e.target.value);url2Setter()}}
												hidden multiple="multiple"
												/>
											</div>
											<div className={`cursor-pointer relative rounded-full p-2 hover:bg-gray-200/60 transition-all duration-200 ease-in-out`}>
												{
													iconsReveal ? 
													<AiOutlineRight className={`h-[17px] w-[17px] text-sky-500`}/>
													:
													<TbGif onClick={()=>setGifInput(!gifInput)} className="text-sky-500 h-[18px] w-[18px]"/>
												}
												<div className={`absolute z-50 ${gifInput ? '-left-10' : '-left-[1000px]'} bottom-12 transition-all duration-200 ease-in-out`} >
											      <GifPicker tenorApiKey={process.env.NEXT_PUBLIC_TERNOR} height="450px" width="21em"
											      autoFocusSearch="true" theme="dark"  onGifClick={(e)=>{
											      		setGifInput(false);
											      		sendGifMessage(e?.url)
											      }} />
											    </div>
											</div>
											<div className={`relative cursor-pointer hidden sm:block rounded-full p-2 hover:bg-gray-200/60 transition-all duration-200 ease-in-out ${iconsReveal && 'hidden w-0 overflow-hidden'}`}>
												<BsEmojiSmile onClick={openEmojiInput} className={`h-[17px] w-[17px] text-sky-500 z-30 ${iconsReveal && 'hidden w-0 overflow-hidden'}`}/>
												{
													emojiInput &&
													<div className="absolute bottom-10 -left-[75px] z-30">
														<EmojiPicker Theme="dark" onEmojiClick={(emoji)=>{
															setMessageText((messageText)=>{return messageText+' '+emoji.emoji})
														}}/>
													</div>											
												}
											</div>												
										</div>
										<input type="text"
										id="messageInput"
										placeholder="Start a new message"
										value={messageText}
										onChange={(e)=>{setMessageText(e.target.value)}}
										onClick={()=>addEventListenerForMe()}
										className="w-full placeholder:text-gray-500 text-black outline-none bg-transparent"/>
										<div 
										onClick={()=>{if(messageText.length>0) sendMessage()}}
										className="rounded-full mr-1 hover:bg-sky-100 transition-all duration-200 ease-in-out cursor-pointer">
											{
												messageText ? 
												<AiOutlineSend className="h-5 w-5 text-sky-500"/>
												:
												<CiMicrophoneOn 
												onClick = {()=>{
													
												}}
												className="h-5 w-5 text-sky-500"/>
											}
										</div>
									</div>
								</div>
							</div>
							:
							chats.length > 0 ?
							chats.map((chat,i)=>(
								<div key={i}
								onClick={()=>{setCurrentChat(chat)}}
								className="px-5 overflow-hidden py-[14px] hover:bg-gray-200/40 transition-all duration-200 ease-in-out 
								cursor-pointer flex items-center gap-3 group w-full">
									{
										chat.group ? 
										<div className="h-12 w-12 rounded-full overflow-hidden mx-auto grid grid-cols-2">
											{
												chat?.image?.map((img,j)=>{
													if(chat.image.length === 3){
														if(j<2){
															return (
																<img src={img} key={j} className="object-cover w-full h-full" alt=""/>
															)
														}
													}else{
														if(j<4){
															return (
																<img src={img} key={j} className="object-cover w-full h-full" alt=""/>
															)
														}	
													}
												})
											}
										</div>
										:
										<img src={chat.image} alt="" className="h-12 w-12 rounded-full mx-auto"/>
									}
									
									<div className={`flex flex-col ${chat.group ? 'max-w-[80%]':'w-full'} `}>
										<div className="flex w-full flex-wrap  items-center justify-between">
											<div className={`flex ${chat.group ? 'w-full':'max-w-[85%]'} shrink gap-[1.1px] items-center`}>
												<h1 className="select-none text-black font-semibold text-lg truncate">{chat?.name}</h1>
												<h1 className="select-none text-gray-500 text-lg truncate">@{chat?.username}</h1>
												<h1 className="select-none text-gray-500 text-lg whitespace-nowrap"> - {calDate(chat?.updatedMsg)}</h1>
											</div>
										</div>
										<h1 className={`${chat.newMessage ? 'text-black' : 'text-gray-500' } items-center gap-2 flex text-md`}>{
											chat?.lastChat?.length > 20 ?
											chat?.lastChat?.substring(0,17) + '...'
											:
											chat?.lastChat
										} 
										{
											chat?.newMessage && 
											<div className="rounded-full h-4 w-4 bg-sky-500 flex items-center justify-center overflow-hidden
											text-white text-xs">
												1
											</div>
										}
										</h1>
									</div>	
								</div>
							))
							:
							<div className="h-full w-full flex items-center justify-center">
								<h1 className="text-center text-2xl font-bold">No Chats</h1>
							</div>
						}
					</div>
				</div>
			</div>

		)		
	}
}