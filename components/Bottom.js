import {RiHome7Fill,RiFileList3Fill,RiFileList3Line,RiSearch2Fill,RiSearch2Line} from 'react-icons/ri';	
import {BiHomeCircle} from 'react-icons/bi';
import {HiOutlineMail,HiMail} from 'react-icons/hi';
import {BsBookmark,BsBookmarkFill} from 'react-icons/bs'



export default function Bottom({setCurrentWindow,currentWindow}) {
	// body...


	return (
		<div className="bottom-0 xs:hidden border-t-[1px] border-gray-200/60 fixed w-full flex p-2 justify-around bg-white backdrop-blur-xl">
			<div 
			onClick={()=>setCurrentWindow('Home')}
			className="p-[6px] cursor-pointer rounded-full hover:bg-gray-200/70 transition-all duration-200 ease-in-out">
				{
					currentWindow === 'Home'?
					<RiHome7Fill className={`h-7 w-7 text-black`}/>
					:
					<BiHomeCircle className="h-7 w-7 text-black"/>
				}
			</div>
			<div 
			onClick={()=>setCurrentWindow('Explore')}
			className="p-[6px] cursor-pointer rounded-full hover:bg-gray-200/70 transition-all duration-200 ease-in-out">
				{
					currentWindow === 'Explore'?
					<RiSearch2Fill className={`h-7 w-7 text-black`}/>
					:
					<RiSearch2Line className="h-7 w-7 text-black"/>
				}
			</div>
			<div 
			onClick={()=>{setCurrentWindow('Messages')}}
			className="p-[6px] cursor-pointer rounded-full hover:bg-gray-200/70 transition-all duration-200 ease-in-out">
				{
					currentWindow === 'Messages'?
					<HiMail className={`h-7 w-7 text-black} `}/>
					:
					<HiOutlineMail className="h-7 w-7 text-black"/>
				}
			</div>
			<div 
			onClick={()=>setCurrentWindow('Bookmarks')}
			className="p-[6px] cursor-pointer rounded-full hover:bg-gray-200/70 transition-all duration-200 ease-in-out">
				{
					currentWindow === 'Bookmarks'?
					<BsBookmarkFill className={`h-6 w-6 text-black} `}/>
					:
					<BsBookmark className="h-6 w-6 text-black"/>
				}
			</div>
		</div>

	)
}