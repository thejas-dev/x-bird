import {AiOutlineSetting} from 'react-icons/ai';
import {RiMailAddLine} from 'react-icons/ri';
import {BiSearchAlt2} from 'react-icons/bi';
import {useRecoilState} from 'recoil'
import {currentChatState} from '../atoms/userAtom'
import {useState} from 'react'
import {BsThreeDots} from 'react-icons/bs';

export default function Message(argument) {
	// body...

	const [currentChat,setCurrentChat] = useRecoilState(currentChatState);
	const [search,setSearch] = useState('');

	const [chats,setChats] = useState([
	{
		name:'Dhoni',
		username:'msdhoni123',
		image:'https://pbs.twimg.com/profile_images/1641363952608108546/3MncKdlW_400x400.jpg',
		lastChat:'uwu'
	},
	{
		name:'MS Dhoni Fans',
		username:'BleedDhonism',
		image:'https://pbs.twimg.com/profile_images/1407536632908050432/u-GOFBjP_400x400.jpg',
		lastChat:'Hello'
	}
	]);

	return(

		<div className={`lg:w-[36.4%] xl:w-[30.4%] overflow-hidden ${currentChat ? 'hidden' : 'block'} md:w-[70%] w-[100%] lg:block flex flex-col h-full   pt-4 border-r-[1.3px] border-gray-200`}>
			<div className="flex items-center justify-between w-[90%] mx-auto">
				<h1 className="text-black text-2xl font-semibold">Messages</h1>
				<div className="flex items-center">
					<div className="p-[6px] rounded-full cursor-pointer hover:bg-gray-200/70 transition-all duration-200 ease-in-out">
						<AiOutlineSetting className="h-5 w-5 text-black"/>
					</div>
					<div className="p-[6px] rounded-full cursor-pointer hover:bg-gray-200/70 transition-all duration-200 ease-in-out">
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
			<div className="mt-4 flex-col flex">
				{
					chats.map((chat,i)=>(
						<div key={i} className="px-5 py-[14px] hover:bg-gray-200/40 transition-all duration-200 ease-in-out 
						cursor-pointer flex items-center gap-3 group w-full">
							<img src={chat.image} className="h-12 w-12 rounded-full" alt=""/>
							<div className="flex flex-col w-full">
								<div className="flex w-full gap-1 items-center justify-between">
									<div className="flex items-center">
										<h1 className="text-black font-semibold text-lg truncate">{chat.name}</h1>
										<h1 className="text-gray-500 text-lg truncate">@{chat.username}</h1>
										<h1 className="text-gray-500 text-lg whitespace-nowrap"> - 3h</h1>
									</div>
									<BsThreeDots className="h-5 w-5 text-gray-500 hidden group-hover:block"/>
								</div>
								<h1 className="text-gray-500 text-md">{chat.lastChat}</h1>
							</div>	
						</div>
					))
				}
			</div>
		</div>
	)
}