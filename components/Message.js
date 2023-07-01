import {AiOutlineSetting} from 'react-icons/ai';
import {RiMailAddLine} from 'react-icons/ri';
import {BiSearchAlt2} from 'react-icons/bi';
import {useRecoilState} from 'recoil'
import {currentChatState,chatsState} from '../atoms/userAtom'
import {useState} from 'react'
import {BsThreeDots} from 'react-icons/bs';
import DateDiff from 'date-diff'

export default function Message({currentWindow,setCurrentWindow,newMessageSearch,setNewMessageSearch,
	setMsgReveal,msgReveal}) {
	// body...

	const [currentChat,setCurrentChat] = useRecoilState(currentChatState);
	const [chats,setChats] = useRecoilState(chatsState);
	const [search,setSearch] = useState('');

	const calDate = (date) => {
		const date1 = new Date();
		const date2 = new Date(date)
		var diff = new DateDiff(date1, date2);
		if(diff.minutes() <= 60){
			return Math.trunc(diff.minutes()) + 'm'
		}else if(diff.hours() <= 24){
			return Math.trunc(diff.hours()) + 'h'
		}else if(diff.days() <= 30){
			return Math.trunc(diff.days()) + 'd'
		}else if(diff.months() <= 12){
			return Math.trunc(diff.minutes()) + 'M'
		}else if(diff.years() <= 12){
			return Math.trunc(diff.years()) + 'y'
		}
	}

	// console.log(currentChat)

	return(

		<div className={`lg:w-[36.4%] xl:w-[30.4%] overflow-hidden ${currentChat ? 'hidden' : 'block'} md:w-[70%] w-[100%] lg:block flex flex-col h-full   pt-4 border-r-[1.3px] border-gray-200`}>
			<div className="flex items-center justify-between w-[90%] mx-auto">
				<h1 className="text-black text-2xl font-semibold">Messages</h1>
				<div className="flex items-center">
					<div className="p-[6px] rounded-full cursor-pointer hover:bg-gray-200/70 transition-all duration-200 ease-in-out">
						<AiOutlineSetting className="h-5 w-5 text-black"/>
					</div>
					<div 
					onClick={()=>{setNewMessageSearch(true);}}
					className="p-[6px] rounded-full cursor-pointer hover:bg-gray-200/70 transition-all duration-200 ease-in-out">
						<RiMailAddLine className="h-5 w-5 text-black"/>
					</div>
				</div>
			</div>
			<div className="mt-5 mx-auto rounded-full focus-within:border-sky-500 border-gray-300 focus-within:border-[2px] border-[1.5px]
			 flex items-center justify-center w-[92%] px-3 py-2 gap-2">
				<BiSearchAlt2 className="text-gray-700 mt-[1px] h-4 w-4"/>
				<input type="text" placeholder="Search Direct Messages" className="transition-all duration-200 ease-in-out
				placeholder:text-gray-500 text-md text-black outline-none bg-transparent focus:w-full"/>
			</div>	
			<div className="mt-4 flex-col flex h-full w-full">
				{
					chats.length > 0 ?
					chats.map((chat,i)=>(
						<div key={i} 
						onClick={()=>{setCurrentChat(chat);setMsgReveal(true)}}
						className={`px-4 relative py-[14px] hover:bg-gray-200/40 transition-all duration-200 ease-in-out 
						${currentChat.name === chat.name ? 'bg-sky-200/60' : ''}
						cursor-pointer flex items-center gap-[10px] group w-full`}>
							<div className={`absolute right-0 h-full w-[2px] ${currentChat.name === chat.name ? 'bg-blue-500' : ''}`}/>
							
							{
								!chat?.group ?
								<img src={chat.image} className="h-12 w-12 rounded-full " alt=""/>
								:
								<div className="grid-cols-2 grid h-12 w-12 rounded-full overflow-hidden">
									{
										chat?.image?.map((img,j)=>{
											if(chat.image.length === 3){
												if(j<2){
													return (
														<img src={img} className="object-cover w-full h-full" alt=""/>
													)
												}
											}else{
												if(j<4){
													return (
														<img src={img} className="object-cover w-full h-full" alt=""/>
													)
												}	
											}
										})
									}
								</div>

							}
							<div className={`flex ${chat.group ? 'max-w-[84%]':'w-full'} flex-col w-full`}>
								<div className="flex w-full flex-wrap gap-1 items-center justify-between">
									<div className={`flex ${chat.group ? 'w-full':'max-w-[85%]'} shrink gap-[1.7px] items-center`}>
										<h1 className="text-black font-semibold text-lg truncate select-none ">{chat.name}</h1>
										<h1 className="text-gray-500 text-lg truncate select-none ">@{chat.username}</h1>
										<h1 className="text-gray-500 text-lg whitespace-nowrap select-none "> • {calDate(chat?.updatedMsg)}</h1>
									</div>
								</div>
								<h1 className={`${chat.newMessage ? 'text-black' : 'text-gray-500' } items-center gap-2 flex text-md`}>{
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
					<div className="h-full w-full flex pt-[200px] justify-center">
						<h1 className="text-center text-2xl font-bold">No Chats</h1>
					</div>
				}
			</div>
		</div>
	)
}