import {FiHash} from 'react-icons/fi'
import {useState} from 'react';
import {BsThreeDots} from 'react-icons/bs';
import {RiHome7Fill,RiFileList3Fill,RiFileList3Line} from 'react-icons/ri';	
import {CiHashtag} from 'react-icons/ci';
import {MdOutlineArrowBack} from 'react-icons/md';
import {useRecoilState} from 'recoil'
import {MdNotifications,MdNotificationsNone} from 'react-icons/md';
import {currentChatState,currentUserState,sidebarState} from '../atoms/userAtom'
import {BiHomeCircle,BiLogOut} from 'react-icons/bi';
import {HiOutlineMail,HiMail,HiOutlineUser,HiUser} from 'react-icons/hi';
import {BsBookmark,BsBookmarkFill} from 'react-icons/bs';
import {signOut} from 'next-auth/react'
import {useRouter} from 'next/navigation';
import {AiOutlineSetting,AiFillSetting} from 'react-icons/ai';
import Link from 'next/link';

export default function Left({setCurrentWindow,currentWindow}) {
	// body...

	const [currentUser,setCurrentUser] = useRecoilState(currentUserState);
	const [revealSignOut,setRevealSignOut] = useState(false);
	const [sideBar,setSideBar] = useRecoilState(sidebarState)
	const router = useRouter();
	const [nameReveal,setNameReveal] = useState(false);


	const focusOnTweetInput = () => {
		const ele = document.getElementById('tweetArea');
		if(ele){
			ele.focus()
		}
	}


	return (
		<div className={`h-[100%] xs:z-20 z-50 xs:w-auto w-full bg-white dark:bg-[#100C08] overflow-y-scroll xl:w-[23%] fixed xs:relative scrollbar-none xl:scrollbar-thin xs:flex 
		border-r-[1.3px] border-gray-200 dark:border-gray-600 flex flex-col justify-between ${sideBar ? 'left-0' : 'xs:left-0 -left-[100%]'} transition-all
		duration-300 ease-in-out`}>
			<div className="xl:pl-10 lg:pl-5 md:pr-3 xl:pr-7 mt-4 xs:px-1 px-3 flex flex-col w-full ">
				<div className="flex items-center gap-3 xs:pl-3 pl-2">
					<div 
					onClick={()=>{setSideBar(false)}}
					className="p-1 hover:bg-gray-400/20 xs:hidden rounded-full transition-all cursor-pointer duration-200 ease-in">
						<MdOutlineArrowBack className="h-7 w-7 text-black dark:text-gray-100"/>
					</div>
					<img onClick={()=>setNameReveal(!nameReveal)}
					src="https://ik.imagekit.io/d3kzbpbila/thejashari_QSzOWJHFV?updatedAt=1690659361414"
					alt="not found"
					className="h-9 w-9"/>
					<span className={`md:text-2xl text-xl dark:text-gray-200 transition-all duration-300 
					${nameReveal ? 'w-[100%]':'w-0'} block xs:hidden xl:block ease-in-out overflow-hidden text-black font-semibold`}>Trendzio</span>
				</div>
				<Link href="/"><div 
				onClick={()=>{
					if(currentWindow === 'Home'){
						document.getElementById('tweetArea').scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
					}
					// setCurrentWindow('Home');
					setSideBar(false);					
				}}
				className="flex items-center gap-4 mt-4 rounded-full px-4 py-4 cursor-pointer hover:bg-gray-200/70 dark:hover:bg-gray-800/80 transition-all duration-200 ease-in-out">
					{
						currentWindow === 'Home'?
						<RiHome7Fill className={`h-7 w-7 text-black dark:text-gray-100`}/>
						:
						<BiHomeCircle className="h-7 w-7 text-black dark:text-gray-100"/>
					}
					<h1 className={`text-xl text-black dark:text-gray-100 block xs:hidden xl:block ${currentWindow === 'Home' ? 'font-semibold' : ''} `}>Home</h1>
				</div></Link>
				{
					currentUser &&
					<Link href="/explore"><div 
					onClick={()=>{
						// setCurrentWindow('Explore');
						setSideBar(false);						
					}}
					className="flex items-center gap-4 rounded-full px-4 py-4 cursor-pointer hover:bg-gray-200/70 dark:hover:bg-gray-800/80 transition-all duration-200 ease-in-out">
						{
							currentWindow === 'Explore'?
							<FiHash className={`h-7 w-7 text-black dark:text-gray-100 `}/>
							:
							<CiHashtag className="h-7 w-7 text-black dark:text-gray-100"/>
						}
						<h1 className={`text-xl text-black dark:text-gray-100 block xs:hidden xl:block ${currentWindow === 'Explore' ? 'font-semibold' : ''} `}>Explore</h1>
					</div></Link>
				}
				{
					currentUser &&
					<Link href="/messages"><div 
					onClick={()=>{
						// setCurrentWindow('Messages')
						setSideBar(false)						
					}}
					className="flex items-center gap-4 rounded-full px-4 py-4 cursor-pointer hover:bg-gray-200/70 dark:hover:bg-gray-800/80 transition-all duration-200 ease-in-out">
						{
							currentWindow === 'Messages'?
							<HiMail className={`h-7 w-7 text-black dark:text-gray-100 `}/>
							:
							<HiOutlineMail className="h-7 w-7 text-black dark:text-gray-100"/>
						}
						<h1 className={`text-xl text-black dark:text-gray-100 block xs:hidden xl:block ${currentWindow === 'Messages' ? 'font-semibold' : ''} `}>Messages</h1>
					</div>
					</Link>
				}
				{
					currentUser &&
					<Link href="/list"><div 
					onClick={()=>{
						// setCurrentWindow('Lists');
						setSideBar(false)						
					}}
					className="flex items-center gap-4 rounded-full px-4 py-4 cursor-pointer hover:bg-gray-200/70 dark:hover:bg-gray-800/80 transition-all duration-200 ease-in-out">
						{
							currentWindow === 'Lists'?
							<RiFileList3Fill className={`h-7 w-7 text-black dark:text-gray-100 `}/>
							:
							<RiFileList3Line className="h-7 w-7 text-black dark:text-gray-100"/>
						}
						<h1 className={`text-xl text-black dark:text-gray-100 block xs:hidden xl:block ${currentWindow === 'Lists' ? 'font-semibold' : ''} `}>Lists</h1>
					</div></Link>
				}
				{
					currentUser &&
					<Link href="/bookmarks"><div 
					onClick={()=>{
						// setCurrentWindow('Bookmarks');
						setSideBar(false)						
					}}
					className="flex items-center gap-[17px] rounded-full px-4 py-4 cursor-pointer hover:bg-gray-200/70 dark:hover:bg-gray-800/80 transition-all duration-200 ease-in-out">
						{
							currentWindow === 'Bookmarks'?
							<BsBookmarkFill className={`h-6 w-6 text-black dark:text-gray-100 `}/>
							:
							<BsBookmark className="h-6 w-6 text-black dark:text-gray-100"/>
						}
						<h1 className={`text-xl text-black dark:text-gray-100 block xs:hidden xl:block ${currentWindow === 'Bookmarks' ? 'font-semibold' : ''} `}>Bookmarks</h1>
					</div></Link>
				}
				{
					currentUser &&
					<Link href={`/profile?profile=${currentUser._id}`}><div 
					onClick={()=>{
						// setCurrentWindow('Profile')
						// window.history.replaceState({id:100},'Default',`?profile=${currentUser._id}`);
						setSideBar(false)
						// if(currentWindow === 'Profile'){
						// 	location.reload()
						// }else{
						// 	// setCurrentWindow('Profile')
						// }
					}}
					className="flex items-center gap-4 rounded-full px-4 py-4 cursor-pointer hover:bg-gray-200/70 dark:hover:bg-gray-800/80 transition-all duration-200 ease-in-out">
						{
							currentWindow === 'Profile'?
							<HiUser className={`h-7 w-7 text-black  dark:text-gray-100`}/>
							:
							<HiOutlineUser className="h-7 w-7 text-black dark:text-gray-100"/>
						}
						<h1 className={`text-xl text-black dark:text-gray-100 block xs:hidden xl:block ${currentWindow === 'Profile' ? 'font-semibold' : ''} `}>Profile</h1>
					</div></Link>
				}
				{
					currentUser &&
					<Link href="/settings"><div 
					onClick={()=>{					
						setSideBar(false)
						// setCurrentWindow('Notifications')
						
					}}
					className="flex items-center gap-4 rounded-full px-4 py-4 cursor-pointer hover:bg-gray-200/70 dark:hover:bg-gray-800/80 transition-all duration-200 ease-in-out">
						{
							currentWindow === 'Notifications'?
							<AiFillSetting className={`h-7 w-7 text-black dark:text-gray-100 `}/>
							:
							<AiOutlineSetting className="h-7 w-7 text-black dark:text-gray-100"/>
						}
						<h1 className={`text-xl text-black dark:text-gray-100 block xs:hidden xl:block ${currentWindow === 'Notifications' ? 'font-semibold' : ''} `}>Settings</h1>
					</div></Link>
				}
				{
					currentUser &&
					<div 
					onClick={()=>setRevealSignOut(!revealSignOut)}
					className="relative xl:hidden xs:flex hidden items-center gap-4 rounded-full px-4 py-4 cursor-pointer hover:bg-gray-200/70 dark:hover:bg-gray-800/80 transition-all duration-200 ease-in-out">
						<div 
						onClick={()=>{
							localStorage.removeItem('xbird')
							sessionStorage.removeItem('trendzio-auth')
							setCurrentUser('');
							signOut();
						}}
						className={`fixed  hover:bg-gray-100 ${revealSignOut ? 'left-4' : '-left-[500px]' } transition-all ease-in-out
						duration-200 bg-white bottom-[90px] rounded-xl border-[1.7px] shadow-xl border-gray-300/70 py-3 px-3 flex flex-col`}>
							<div className="w-full transition-all duration-200 overflow-hidden ease-in-out">
								<h1 className="text-red-600 text-md font-semibold truncate">Log out @{currentUser.username}</h1>
							</div>
						</div>
						<BiLogOut className={`h-7 w-7 text-black dark:text-gray-200 `}/>						
					</div>
				}
				
				{
					!currentUser &&
					<button 
					onClick={()=>router.push('/signIn')}
					className="mt-2 hidden xl:block rounded-full text-xl p-3 font-semibold w-full flex items-center justify-center text-white bg-sky-500">
						Login
					</button>
				}
			</div>		
			{
				currentUser &&
				<div 
				onClick={()=>setRevealSignOut(!revealSignOut)}
				className="flex xs:hidden xl:flex gap-3 xs:ml-8 ml-2 px-3 py-2 mb-3 items-center mr-7 justify-between rounded-full hover:bg-gray-200
				dark:hover:bg-gray-800/80 transition-all duration-200 ease-in-out cursor-pointer relative">
					
					<div 
					onClick={()=>{
						localStorage.removeItem('xbird')
						sessionStorage.removeItem('trendzio-auth')						
						setCurrentUser('');
						router.push('/');
						signOut({ callbackUrl: '/' });
					}}
					className={`absolute w-full hover:bg-gray-100 ${revealSignOut ? 'left-0' : '-left-[500px]' } transition-all ease-in-out
					duration-200 bg-white dark:bg-gray-800/60 dark:backdrop-blur-md -top-14 rounded-xl border-[1.7px] shadow-xl border-gray-300/70 dark:border-gray-700/70 py-3 px-3 flex flex-col`}>
						<div className="w-full transition-all duration-200 overflow-hidden ease-in-out">
							<h1 className="text-red-600 dark:text-red-400 hover:dark:text-red-500 text-md font-semibold truncate">Log out @{currentUser.username}</h1>
						</div>
					</div>
					
					<div className="gap-3 flex items-center overflow-hidden">
						<img src={currentUser?.image} alt="" className="h-10 w-10 rounded-full"/>
						<div className="flex-col flex justify-center overflow-hidden shrink" >
							<h1 className="text-lg font-semibold text-black dark:text-gray-200 truncate shrink">{currentUser?.name}</h1>
							<h1 className="text-gray-500 truncate shrink">@{currentUser?.username}</h1>
						</div>
					</div>
					<BsThreeDots className="h-5 w-5 text-black dark:text-gray-200"/>
				</div>
			}

		</div>

	)
}
