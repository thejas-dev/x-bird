import {FiSearch} from 'react-icons/fi'
import {useRecoilState} from 'recoil'
import {currentChatState,currentUserState,chatsState} from '../atoms/userAtom'
import {HiOutlineChevronDoubleDown} from 'react-icons/hi';
import {RiMailAddLine,RiSendPlane2Line} from 'react-icons/ri';
import {BiSearchAlt2} from 'react-icons/bi';
import {useState,useEffect} from 'react'
import {BsThreeDots} from 'react-icons/bs';
import {AiOutlineInfoCircle} from 'react-icons/ai';
import {BsCardImage,BsEmojiSmile} from 'react-icons/bs';
import {TbGif} from 'react-icons/tb';



export default function Right({setCurrentWindow,currentWindow}) {
	const [currentChat,setCurrentChat] = useRecoilState(currentChatState);
	const [currentUser,setCurrentUser] = useRecoilState(currentUserState);
	const [search,setSearch] = useState('');
	const [msgReveal,setMsgReveal] = useState(false);
	const [chats,setChats] = useRecoilState(chatsState);

	// {
	// 	name:'Dhoni',
	// 	username:'msdhoni123',
	// 	image:'https://pbs.twimg.com/profile_images/1641363952608108546/3MncKdlW_400x400.jpg',
	// 	lastChat:'uwu',
	// 	description:'MS Dhoni Fan Club providing latest updates and everything about the Legend #MSDhoni 🏏❤️ #WhistlePodu #IPL2023 #Dhoni #Cricket',
	// 	joinedDate:'September 2013'
	// },
	// {
	// 	name:'MS Dhoni Fans',
	// 	username:'BleedDhonism',
	// 	image:'https://pbs.twimg.com/profile_images/1407536632908050432/u-GOFBjP_400x400.jpg',
	// 	lastChat:'Hello',
	// 	description:'MS Dhoni Fan Club providing latest updates and everything about the Legend #MSDhoni 🏏❤️ #WhistlePodu #IPL2023 #Dhoni #Cricket',
	// 	joinedDate:'September 2013'
	// }

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

	useEffect(()=>{
		if(currentUser?.chats?.length > 0){
			setChats(currentUser?.chats);
		}
	},[currentUser])

	if(currentWindow === 'Messages'){
		return (
			<div className={`lg:w-[50.6%] md:w-[80%] xs:w-[90%] relative w-[100%] ${currentChat ? 'block':'hidden'} h-full lg:block overflow-y-scroll`}>
				<div className={`w-full ${!currentChat && 'hidden'} sticky top-0 backdrop-blur-md flex justify-end p-2`}>
					<div className="p-2 cursor-pointer rounded-full hover:bg-gray-200 transition-all duration-200 ease-in-out">
						<AiOutlineInfoCircle className="h-5 w-5 text-gray-800"/>
					</div>
				</div>
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
							<div className="flex">
								<button className="rounded-full text-lg md:px-9 px-6 md:py-3 py-1 bg-blue-500 hover:bg-blue-700 
								transition-all duration-200 ease-in-out text-white mt-7 font-bold">New message</button>
							</div>
						</div>
					</div>	
					:
					<div className="h-full mt-2 w-full flex flex-col px-5">
						<div className="w-full hover:bg-gray-100 rounded-md transition-all duration-200 ease-in-out 
						cursor-pointer px-4 py-6 pb-14 border-gray-200/70 border-b-[1px] flex flex-col">
							<img src={currentChat.image} alt="" className="h-[70px] w-[70px] rounded-full mx-auto"/>
							<h1 className="text-black text-xl font-bold text-center mx-auto">{currentChat?.name}</h1>
							<h1 className="text-gray-600 text-xl text-center mx-auto">@{currentChat?.username}</h1>
							<h1 className="text-gray-900 mt-5 text-center mx-auto">{currentChat?.description}</h1>
							<h1 className="text-gray-600 mt-2 text-center mx-auto">Joined {currentChat.joinedDate} ~ {currentChat.followers} Followers</h1>
							<h1 className="text-gray-600 text-sm mt-2 text-center mx-auto">Not followed by anyone you're following</h1>
						</div>
					</div>
				}
				<div className={`${!currentChat && 'hidden'} sticky bottom-0 w-full px-2 py-2 border-t-[1px] border-gray-200/70`}>
					<div className="bg-gray-200/70 rounded-2xl flex items-center gap-2 py-[6px] px-2">
						<div className="flex items-center">
							<div className="hover:bg-sky-200/80 transition-all box-border duration-200 ease-in-out p-2 rounded-full cursor-pointer">
								<BsCardImage className="text-sky-500 h-[18px] w-[18px]"/>
							</div>
							<div className="hover:bg-sky-200/80 transition-all box-border duration-200 ease-in-out p-2 rounded-full cursor-pointer">
								<TbGif className="text-sky-500 h-[18px] w-[18px]"/>
							</div>
							<div className="hover:bg-sky-200/80 transition-all box-border duration-200 ease-in-out p-2 rounded-full cursor-pointer">
								<BsEmojiSmile className="text-sky-500 h-[18px] w-[18px]"/>
							</div>
						</div>	
						<div className="w-[100%]">
							<input type="text" className="outline-none bg-transparent placeholder:text-gray-500 text-black text-md w-full" 
							placeholder="Start a new message"/>
						</div>
						<div className="rounded-full mr-1 hover:bg-sky-100 transition-all duration-200 ease-in-out cursor-pointer">
							<RiSendPlane2Line className="h-5 w-5 text-sky-500"/>
						</div>
					</div>
					
				</div>
				
			</div>

		)
	}else{
		return (
			<div className="lg:w-[40.4%] relative xl:w-[32.4%] w-0 hidden lg:block h-full pl-7 pr-10 overflow-y-scroll">
				<div className="flex flex-col w-full">
					<div className="mt-2 bg-gray-200/70 rounded-full px-5 py-2 focus-within:bg-transparent w-full
					focus-within:border-sky-500 border-[1.5px]  flex gap-3 items-center">
						<FiSearch className="h-5 w-5 text-gray-700 peer-active:text-sky-600 "/>
						<input type="text" placeholder="Search twitter" className="w-full bg-transparent peer outline-none placholder:text-gray-500 text-black text-lg"/>
					</div>
					<div className="mt-5 rounded-2xl bg-gray-300/20 flex flex-col overflow-hidden">
						<h1 className="my-3 mx-4 text-xl text-black font-bold">What's happening</h1>
						{
							tempEventData.map((event)=>(
								<div className="flex justify-between cursor-pointer hover:bg-gray-200 transition-all duration-200 ease-in-out p-4">
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
							tempHashData.map((hash)=>(
								<div className="flex justify-between cursor-pointer hover:bg-gray-200 transition-all duration-200 ease-in-out p-4">
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
							tempTextData.map((text)=>(
								<div className="flex justify-between cursor-pointer hover:bg-gray-200 transition-all duration-200 ease-in-out p-4">
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
				<div className={`fixed right-7 lg:w-[36.4%] xl:w-[28.4%] w-0 border-gray-200 border-[1px] flex flex-col h-full 
				overflow-hidden bg-white pt-4 h-[95%] w-full ${msgReveal ? '-bottom-[60px]' : '-bottom-[90%]'} transition-all 
				duration-200 ease-in-out  rounded-2xl shadow-xl pb-[60px]`}>
					<div 
					onClick={()=>setMsgReveal(!msgReveal)}
					className="flex cursor-pointer items-center justify-between w-full px-5 shadow-sm pb-3 mx-auto">
						<h1 className="text-black text-2xl select-none font-semibold">Messages</h1>
						<div className="flex items-center">
							<div className="p-[6px] rounded-full cursor-pointer hover:bg-gray-200/70 transition-all duration-200 ease-in-out">
								<RiMailAddLine className="h-5 w-5 text-black"/>
							</div>
							<div className="p-[6px] rounded-full cursor-pointer hover:bg-gray-200/70 transition-all duration-200 ease-in-out">
								<HiOutlineChevronDoubleDown className={`h-5 w-5 text-black ${!msgReveal && 'rotate-180'  }`}/>
							</div>
						</div>
					</div>
					<div className={`h-[100%] transition-all duration-200 ease-in-out flex-col flex w-full overflow-y-scroll`}>
						{
							chats.map((chat,i)=>(
								<div key={i}
								onClick={()=>{setCurrentChat(chat);setCurrentWindow('Messages')}}
								className="px-5 py-[14px] hover:bg-gray-200/40 transition-all duration-200 ease-in-out 
								cursor-pointer flex items-center gap-3 group w-full">
									<img src={chat.image} className="h-12 w-12 rounded-full" alt=""/>
									<div className="flex flex-col w-full">
										<div className="flex w-full flex-wrap gap-1 items-center justify-between">
											<div className="flex max-w-[85%] shrink gap-[1.7px] items-center">
												<h1 className="select-none text-black font-semibold text-lg truncate">{chat.name}</h1>
												<h1 className="select-none text-gray-500 text-lg truncate">@{chat.username}</h1>
												<h1 className="select-none text-gray-500 text-lg whitespace-nowrap"> - 3h</h1>
											</div>
											<div className="p-1 max-w-[15%] hidden group-hover:block rounded-full hover:bg-sky-200/50 peer transition-all duration-200
											ease-in-out cursor-pointer">
												<BsThreeDots className="h-5 w-5 text-gray-500 hidden hover:text-sky-500 group-hover:block"/>
											</div>
										</div>
										<h1 className="text-gray-500 text-md">{chat.lastChat}</h1>
									</div>	
								</div>
							))
						}
					</div>
				</div>
			</div>

		)		
	}
}