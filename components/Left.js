import {FiHash} from 'react-icons/fi'
import {BsThreeDots} from 'react-icons/bs';
import {RiHome7Fill,RiFileList3Fill,RiFileList3Line} from 'react-icons/ri';	
import {CiHashtag} from 'react-icons/ci';
import {useRecoilState} from 'recoil'
import {currentChatState,currentUserState} from '../atoms/userAtom'
import {BiHomeCircle} from 'react-icons/bi';
import {HiOutlineMail,HiMail,HiOutlineUser,HiUser} from 'react-icons/hi';
import {BsBookmark,BsBookmarkFill} from 'react-icons/bs'

export default function Left({setCurrentWindow,currentWindow}) {
	// body...

	const [currentUser,setCurrentUser] = useRecoilState(currentUserState);


	return (
		<div className="h-[100%] overflow-y-scroll xl:w-[23%]  hidden scrollbar-none xl:scrollbar-thin xs:flex border-r-[1.3px] border-gray-200 flex flex-col justify-between">
			<div className="xl:pl-10 lg:pl-5 md:pr-3 xl:pr-7 mt-4 flex flex-col w-full ">
				<img src="twitter-icon.png"
				alt="not found"
				className="h-9 w-9 ml-4"/>
				<div 
				onClick={()=>setCurrentWindow('Home')}
				className="flex items-center gap-4 mt-4 rounded-full px-4 py-4 cursor-pointer hover:bg-gray-200/70 transition-all duration-200 ease-in-out">
					{
						currentWindow === 'Home'?
						<RiHome7Fill className={`h-7 w-7 text-black`}/>
						:
						<BiHomeCircle className="h-7 w-7 text-black"/>
					}
					<h1 className={`text-xl text-black hidden xl:block ${currentWindow === 'Home' ? 'font-semibold' : ''} `}>Home</h1>
				</div>
				<div 
				onClick={()=>setCurrentWindow('Explore')}
				className="flex items-center gap-4 rounded-full px-4 py-4 cursor-pointer hover:bg-gray-200/70 transition-all duration-200 ease-in-out">
					{
						currentWindow === 'Explore'?
						<FiHash className={`h-7 w-7 text-black} `}/>
						:
						<CiHashtag className="h-7 w-7 text-black"/>
					}
					<h1 className={`text-xl text-black hidden xl:block ${currentWindow === 'Explore' ? 'font-semibold' : ''} `}>Explore</h1>
				</div>
				<div 
				onClick={()=>{setCurrentWindow('Messages')}}
				className="flex items-center gap-4 rounded-full px-4 py-4 cursor-pointer hover:bg-gray-200/70 transition-all duration-200 ease-in-out">
					{
						currentWindow === 'Messages'?
						<HiMail className={`h-7 w-7 text-black} `}/>
						:
						<HiOutlineMail className="h-7 w-7 text-black"/>
					}
					<h1 className={`text-xl text-black hidden xl:block ${currentWindow === 'Messages' ? 'font-semibold' : ''} `}>Messages</h1>
				</div>
				<div 
				onClick={()=>setCurrentWindow('Lists')}
				className="flex items-center gap-4 rounded-full px-4 py-4 cursor-pointer hover:bg-gray-200/70 transition-all duration-200 ease-in-out">
					{
						currentWindow === 'Lists'?
						<RiFileList3Fill className={`h-7 w-7 text-black} `}/>
						:
						<RiFileList3Line className="h-7 w-7 text-black"/>
					}
					<h1 className={`text-xl text-black hidden xl:block ${currentWindow === 'Lists' ? 'font-semibold' : ''} `}>Lists</h1>
				</div>
				<div 
				onClick={()=>setCurrentWindow('Bookmarks')}
				className="flex items-center gap-[17px] rounded-full px-4 py-4 cursor-pointer hover:bg-gray-200/70 transition-all duration-200 ease-in-out">
					{
						currentWindow === 'Bookmarks'?
						<BsBookmarkFill className={`h-6 w-6 text-black} `}/>
						:
						<BsBookmark className="h-6 w-6 text-black"/>
					}
					<h1 className={`text-xl text-black hidden xl:block ${currentWindow === 'Bookmarks' ? 'font-semibold' : ''} `}>Bookmarks</h1>
				</div>
				<div 
				onClick={()=>setCurrentWindow('Profile')}
				className="flex items-center gap-4 rounded-full px-4 py-4 cursor-pointer hover:bg-gray-200/70 transition-all duration-200 ease-in-out">
					{
						currentWindow === 'Profile'?
						<HiUser className={`h-7 w-7 text-black} `}/>
						:
						<HiOutlineUser className="h-7 w-7 text-black"/>
					}
					<h1 className={`text-xl text-black hidden xl:block ${currentWindow === 'Profile' ? 'font-semibold' : ''} `}>Profile</h1>
				</div>
				<button className="mt-2 hidden xl:block rounded-full text-xl p-3 font-semibold w-full flex items-center justify-center text-white bg-sky-500">
					Tweet
				</button>
			</div>
			<div className="hidden xl:flex gap-3 ml-8 px-3 py-2 mb-3 items-center mr-7 justify-between rounded-full hover:bg-gray-200 transition-all duration-200 ease-in-out cursor-pointer">
				<div className="gap-3 flex items-center">
				<img src={currentUser?.image} alt="" className="h-10 w-10 rounded-full"/>
				<div className="flex-col flex items-center" >
					<h1 className="text-lg font-semibold text-black">{currentUser?.name}</h1>
					<h1 className="text-gray-500 ">@{currentUser?.username}</h1>
				</div>
				</div>
				<BsThreeDots className="h-5 w-5 text-black"/>
			</div>
		</div>

	)
}