import {AiOutlineSetting} from 'react-icons/ai';
import {RiMailAddLine} from 'react-icons/ri';
import {BiSearchAlt2} from 'react-icons/bi';
import {useRecoilState} from 'recoil'
import {currentChatState,chatsState,bottomHideState} from '../atoms/userAtom'
import {useState,useEffect} from 'react'
import {BsThreeDots} from 'react-icons/bs';
import DateDiff from 'date-diff'
import {CgImage} from 'react-icons/cg';

export default function Message({currentWindow,setCurrentWindow,newMessageSearch,setNewMessageSearch,
	setMsgReveal,msgReveal}) {
	// body...

	const [currentChat,setCurrentChat] = useRecoilState(currentChatState);
	const [chats,setChats] = useRecoilState(chatsState);
	const [searchChats,setSearchChats] = useState([]);
	const [search,setSearch] = useState('');
	const [searchValue,setSearchValue] = useState('');
  	const [bottomHide,setBottomHide] = useRecoilState(bottomHideState)	


	useEffect(()=>{
		let ele = document.getElementById('messageArea');
		let startY = 0;
		let scrollY = 0;

		ele.addEventListener('touchstart', function(e) {
		  startY = e.touches[0].clientY;
		});

		ele.addEventListener('touchmove', function(e) {
		  scrollY = startY - e.touches[0].clientY;
		  if(scrollY > 120){
		  	setBottomHide(true)
		  }
		  if(scrollY < -40){		  	
		  	setBottomHide(false)
		  }
		});
	},[])

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

	// console.log(currentChat)

	useEffect(()=>{
		if(searchValue){
			let resChats = [];
			for(let i = 0; i<=chats.length; i++){
				console.log(chats[i])
				if(chats[i]?.name?.toLowerCase().includes(searchValue.toLowerCase())){
					resChats.push(chats[i])
				}
			}
			setSearchChats(resChats)
		}
	},[searchValue])

	return(

		<div id="messageArea" className={`lg:w-[36.4%] xl:w-[30.4%] overflow-y-scroll scrollbar-none ${currentChat ? 'hidden' : 'block'} md:w-[70%] w-[100%] lg:block flex flex-col h-full   
		dark:border-gray-600 pt-4 border-r-[1.3px] border-gray-200`}>
			<div className="flex items-center justify-between w-[90%] mx-auto">
				<h1 className="text-black text-2xl font-semibold dark:text-gray-100">Messages</h1>
				<div className="flex items-center">
					<div className="p-[6px] rounded-full cursor-pointer hover:bg-gray-200/70 dark:hover:bg-gray-700/70 transition-all duration-200 ease-in-out">
						<AiOutlineSetting className="h-5 w-5 text-black dark:text-gray-200"/>
					</div>
					<div 
					onClick={()=>{setNewMessageSearch(true);}}
					className="p-[6px] rounded-full cursor-pointer hover:bg-gray-200/70 dark:hover:bg-gray-700/70 transition-all duration-200 ease-in-out">
						<RiMailAddLine className="h-5 dark:text-gray-200 w-5 text-black"/>
					</div>
				</div>
			</div>
			<div className="mt-5 mx-auto rounded-full focus-within:border-sky-500 border-gray-300 dark:border-gray-700 dark:focus-within:border-sky-700 focus-within:border-[2px] border-[1.5px]
			 flex items-center justify-center w-[92%] px-3 py-2 gap-2">
				<BiSearchAlt2 className="text-gray-700 mt-[1px] h-4 w-4"/>
				<input value={searchValue} onChange={(e)=>{setSearchValue(e.target.value)}} 
				type="text" placeholder="Search Direct Messages" className="transition-all duration-200 ease-in-out
				placeholder:text-gray-500 dark:placeholder:text-gray-400 text-md text-black outline-none bg-transparent dark:text-gray-100 focus:w-full"/>
			</div>	
			<div className="mt-4 flex flex-col h-full w-full pb-14 ">
				{
					chats.length > 0 ?
					
					!searchValue &&
					chats.map((chat,i)=>(
						<div key={i} 
						onClick={()=>{
							setCurrentChat(chat);
							setMsgReveal(true);
							window.history.replaceState({id:100},'Default',`?message=${chat?.name}`);
						}}
						className={`md:px-4 px-2 relative py-[14px] hover:bg-gray-200/40 dark:hover:bg-gray-800/70 transition-all duration-200 ease-in-out 
						${currentChat.name === chat.name ? 'bg-sky-200/60 dark:bg-sky-900/20' : ''}
						cursor-pointer flex items-center md:gap-[10px] gap-[7px] group w-full 

						`}>
							<div className={`absolute right-0 h-full w-[2px] ${currentChat.name === chat.name ? 'bg-blue-500' : ''}`}/>
							
							{
								!chat?.group ?
								<img src={chat.image} className="sm:h-12 sm:w-12 h-[52px] w-[52px] rounded-full shadow-md" alt=""/>
								:
								<div className="grid-cols-2 grid sm:h-12 sm:w-12 h-[52px] w-[52px] shadow-md  rounded-full overflow-hidden">
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

							}
							<div className={`flex ${chat.group ? 'lg:max-w-[82%] md:max-w-[88%] sm:max-w-[87%] xs:max-w-[85%] max-w-[77%]':'w-full'} flex-col overflow-hidden`}>
								<div className="flex w-full flex-wrap gap-1 items-center justify-between">
									<div className={`flex ${chat.group ? 'w-full':'max-w-[100%]'} shrink gap-[1.7px] items-center`}>
										<h1 className="text-black font-semibold text-lg truncate select-none dark:text-gray-200">{chat.name}</h1>
										<h1 className="text-gray-500 text-lg truncate select-none ">@{chat.username}</h1>
										<h1 className="text-gray-500 text-lg whitespace-nowrap select-none "> • {calDate(chat?.updatedMsg)}</h1>
									</div>

								</div>
								<h1 className={`${chat.newMessage ? 'text-black' : 'text-gray-500' } items-center gap-2 flex text-md`}>{
									chat.lastChat.includes('https://ik.imagekit.io') ?
									<span className="flex items-center gap-1" ><CgImage className="text-sky-500 h-4 w-4"/> Image</span>
									:
									chat?.lastChat?.length > 20 ?
									chat?.lastChat?.substring(0,17) + '...'
									:
									chat?.lastChat
								} 
								{
									chat.newMessage && 
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
					!searchValue &&
					<div className="h-full w-full flex pt-[150px] flex-col items-center">
						<h1 className="text-center text-2xl font-bold text-black dark:text-gray-100">Welcome to your inbox!</h1>
						<p className="text-md text-gray-500 tracking-[0.5px] px-3 py-2 text-center">Start chatting, sharing and private conversations with your friends in TNS-Bird</p>
					</div>
				}
				{
					searchValue &&
					searchChats?.map((chat,i)=>(
						<div key={i} 
						onClick={()=>{
							setCurrentChat(chat);
							setMsgReveal(true);
							window.history.replaceState({id:100},'Default',`?message=${chat?.name}`);							
							setSearchChats([]);
							setSearchValue('')
						}}
						className={`md:px-4 px-2 relative py-[14px] hover:bg-gray-200/40 dark:hover:bg-gray-800/70 transition-all duration-200 ease-in-out 
						${currentChat.name === chat.name ? 'bg-sky-200/60 dark:bg-sky-900/20' : ''}
						cursor-pointer flex items-center md:gap-[10px] gap-[7px] group w-full overflow-hidden`}>
							<div className={`absolute right-0 h-full w-[2px] ${currentChat.name === chat.name ? 'bg-blue-500' : ''}`}/>
							
							{
								!chat?.group ?
								<img src={chat.image} className="sm:h-12 h-10 w-10 sm:w-12 h-10 w-10 rounded-full shadow-md" alt=""/>
								:
								<div className="grid-cols-2 grid sm:h-12 h-10 w-10 sm:w-12 h-10 w-10 bg-red-500 shadow-md  rounded-full overflow-hidden">
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

							}
							<div className={`flex ${chat.group ? 'lg:max-w-[82%] md:max-w-[88%] sm:max-w-[87%] xs:max-w-[85%] max-w-[77%]':'w-full'} flex-col overflow-hidden`}>
								<div className="flex w-full flex-wrap gap-1 items-center justify-between">
									<div className={`flex ${chat.group ? 'w-full':'max-w-[100%]'} shrink gap-[1.7px] items-center`}>
										<h1 className="text-black dark:text-gray-200 font-semibold text-lg truncate select-none ">{chat.name}</h1>
										<h1 className="text-gray-500 text-lg truncate select-none ">@{chat.username}</h1>
										<h1 className="text-gray-500 text-lg whitespace-nowrap select-none "> • {calDate(chat?.updatedMsg)}</h1>
									</div>

								</div>
								<h1 className={`${chat.newMessage ? 'text-black' : 'text-gray-500' } items-center gap-2 flex text-md`}>{
									chat.lastChat.includes('https://ik.imagekit.io') ?
									<span className="flex items-center gap-1" ><CgImage className="text-sky-500 h-4 w-4"/> Image</span>
									:
									chat?.lastChat?.length > 20 ?
									chat?.lastChat?.substring(0,17) + '...'
									:
									chat?.lastChat
								} 
								{
									chat.newMessage && 
									<div className="rounded-full h-4 w-4 bg-sky-500 flex items-center justify-center overflow-hidden
									text-white text-xs">
										1
									</div>
								}
								</h1>
							</div>	
						</div>
					))
					
				}

			</div>
		</div>
	)
}