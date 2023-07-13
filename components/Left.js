import {FiHash} from 'react-icons/fi'
import {useState} from 'react';
import {BsThreeDots} from 'react-icons/bs';
import {RiHome7Fill,RiFileList3Fill,RiFileList3Line} from 'react-icons/ri';	
import {CiHashtag} from 'react-icons/ci';
import {useRecoilState} from 'recoil'
import {currentChatState,currentUserState} from '../atoms/userAtom'
import {BiHomeCircle} from 'react-icons/bi';
import {HiOutlineMail,HiMail,HiOutlineUser,HiUser} from 'react-icons/hi';
import {BsBookmark,BsBookmarkFill} from 'react-icons/bs';
import {signOut} from 'next-auth/react'

export default function Left({setCurrentWindow,currentWindow}) {
	// body...

	const [currentUser,setCurrentUser] = useRecoilState(currentUserState);
	const [revealSignOut,setRevealSignOut] = useState(false);


	return (
		<div className="h-[100%] overflow-y-scroll xl:w-[23%]  hidden scrollbar-none xl:scrollbar-thin xs:flex border-r-[1.3px] border-gray-200 flex flex-col justify-between">
			<div className="xl:pl-10 lg:pl-5 md:pr-3 xl:pr-7 mt-4 flex flex-col w-full ">
				<img src="twitter-icon.png"
				alt="not found"
				className="h-9 w-9 ml-4"/>
				<div 
				onClick={()=>{
					setCurrentWindow('Home');
					window.history.replaceState({id:100},'Default',`/`);
				}}
				className="flex items-center gap-4 mt-4 rounded-full px-4 py-4 cursor-pointer hover:bg-gray-200/70 transition-all duration-200 ease-in-out">
					{
						currentWindow === 'Home'?
						<RiHome7Fill className={`h-7 w-7 text-black`}/>
						:
						<BiHomeCircle className="h-7 w-7 text-black"/>
					}
					<h1 className={`text-xl text-black hidden xl:block ${currentWindow === 'Home' ? 'font-semibold' : ''} `}>Home</h1>
				</div>
				{
					currentUser &&
					<div 
					onClick={()=>{
						setCurrentWindow('Explore');
						window.history.replaceState({id:100},'Default',`/`);
					}}
					className="flex items-center gap-4 rounded-full px-4 py-4 cursor-pointer hover:bg-gray-200/70 transition-all duration-200 ease-in-out">
						{
							currentWindow === 'Explore'?
							<FiHash className={`h-7 w-7 text-black} `}/>
							:
							<CiHashtag className="h-7 w-7 text-black"/>
						}
						<h1 className={`text-xl text-black hidden xl:block ${currentWindow === 'Explore' ? 'font-semibold' : ''} `}>Explore</h1>
					</div>
				}
				{
					currentUser &&
					<div 
					onClick={()=>{
						setCurrentWindow('Messages')
						window.history.replaceState({id:100},'Default',`/`);
					}}
					className="flex items-center gap-4 rounded-full px-4 py-4 cursor-pointer hover:bg-gray-200/70 transition-all duration-200 ease-in-out">
						{
							currentWindow === 'Messages'?
							<HiMail className={`h-7 w-7 text-black} `}/>
							:
							<HiOutlineMail className="h-7 w-7 text-black"/>
						}
						<h1 className={`text-xl text-black hidden xl:block ${currentWindow === 'Messages' ? 'font-semibold' : ''} `}>Messages</h1>
					</div>
				}
				{
					currentUser &&
					<div 
					onClick={()=>{
						setCurrentWindow('Lists');
						window.history.replaceState({id:100},'Default',`/`);
					}}
					className="flex items-center gap-4 rounded-full px-4 py-4 cursor-pointer hover:bg-gray-200/70 transition-all duration-200 ease-in-out">
						{
							currentWindow === 'Lists'?
							<RiFileList3Fill className={`h-7 w-7 text-black} `}/>
							:
							<RiFileList3Line className="h-7 w-7 text-black"/>
						}
						<h1 className={`text-xl text-black hidden xl:block ${currentWindow === 'Lists' ? 'font-semibold' : ''} `}>Lists</h1>
					</div>
				}
				{
					currentUser &&
					<div 
					onClick={()=>{
						setCurrentWindow('Bookmarks');
						window.history.replaceState({id:100},'Default',`/`);
					}}
					className="flex items-center gap-[17px] rounded-full px-4 py-4 cursor-pointer hover:bg-gray-200/70 transition-all duration-200 ease-in-out">
						{
							currentWindow === 'Bookmarks'?
							<BsBookmarkFill className={`h-6 w-6 text-black} `}/>
							:
							<BsBookmark className="h-6 w-6 text-black"/>
						}
						<h1 className={`text-xl text-black hidden xl:block ${currentWindow === 'Bookmarks' ? 'font-semibold' : ''} `}>Bookmarks</h1>
					</div>
				}
				{
					currentUser &&
					<div 
					onClick={()=>{
						// setCurrentWindow('Profile')
						window.history.replaceState({id:100},'Default',`?profile=${currentUser._id}`);
						if(currentWindow === 'Profile'){
							location.reload()
						}else{
							setCurrentWindow('Profile')
						}
					}}
					className="flex items-center gap-4 rounded-full px-4 py-4 cursor-pointer hover:bg-gray-200/70 transition-all duration-200 ease-in-out">
						{
							currentWindow === 'Profile'?
							<HiUser className={`h-7 w-7 text-black} `}/>
							:
							<HiOutlineUser className="h-7 w-7 text-black"/>
						}
						<h1 className={`text-xl text-black hidden xl:block ${currentWindow === 'Profile' ? 'font-semibold' : ''} `}>Profile</h1>
					</div>
				}
				{
					currentUser &&
					<button className="mt-2 hidden xl:block rounded-full text-xl p-3 font-semibold w-full flex items-center justify-center text-white bg-sky-500">
						Tweet
					</button>
				}
				{
					!currentUser &&
					<button className="mt-2 hidden xl:block rounded-full text-xl p-3 font-semibold w-full flex items-center justify-center text-white bg-sky-500">
						Login
					</button>
				}
			</div>		
			{
				currentUser &&
				<div 
				onClick={()=>setRevealSignOut(!revealSignOut)}
				className="hidden xl:flex gap-3 ml-8 px-3 py-2 mb-3 items-center mr-7 justify-between rounded-full hover:bg-gray-200 transition-all duration-200 ease-in-out cursor-pointer relative">
					{
					revealSignOut &&
					<div 
					onClick={()=>{
						localStorage.removeItem('xbird')
						setCurrentUser('');
						signOut();
					}}
					className="absolute w-full hover:bg-gray-100 left-0 bg-white -top-14 rounded-xl border-[1.7px] shadow-xl border-gray-300/70 py-3 px-3 flex flex-col">
						<div className="w-full transition-all duration-200 overflow-hidden ease-in-out">
							<h1 className="text-red-600 text-md font-semibold truncate">Log out @{currentUser.username}</h1>
						</div>
					</div>
					}
					<div className="gap-3 flex items-center overflow-hidden">
						<img src={currentUser?.image} alt="" className="h-10 w-10 rounded-full"/>
						<div className="flex-col flex justify-center overflow-hidden shrink" >
							<h1 className="text-lg font-semibold text-black truncate shrink">{currentUser?.name}</h1>
							<h1 className="text-gray-500 truncate shrink">@{currentUser?.username}</h1>
						</div>
					</div>
					<BsThreeDots className="h-5 w-5 text-black"/>
				</div>
			}

		</div>

	)
}