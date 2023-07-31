import {
  RiHome7Fill,
  RiFileList3Fill,
  RiFileList3Line,
  RiSearch2Fill,
  RiSearch2Line,
} from "react-icons/ri";
import { BiHomeCircle } from "react-icons/bi";
import { HiOutlineMail, HiMail } from "react-icons/hi";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import {useRecoilState} from 'recoil'
import {currentChatState, currentUserState, sidebarState, bottomHideState} from '../atoms/userAtom'
import {useRouter} from 'next/navigation';

export default function Bottom({ setCurrentWindow, currentWindow }) {
  // body...
  const [currentChat,setCurrentChat] = useRecoilState(currentChatState);
  const [currentUser,setCurrentUser] = useRecoilState(currentUserState);
  const [sideBar,setSideBar] = useRecoilState(sidebarState);
  const [bottomHide,setBottomHide] = useRecoilState(bottomHideState)
  const router = useRouter()
  

  return (
    <div className={`${currentChat || sideBar || bottomHide ? '-bottom-[100px]' : 'bottom-0'} transition-all duration-300 ease-in-out xs:hidden 
    border-t-[1px] border-gray-200/60 fixed w-full flex p-2 
    justify-around bg-white dark:bg-[#100C08]/80 dark:border-gray-700/60 backdrop-blur-xl ${!currentUser && 'hidden'} z-50`}>
      <div
        onClick={() => {
          if(currentWindow === 'Home'){
            document.getElementById('tweetArea').scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
          }
          router.push("/");
        }}
        className="p-[6px] cursor-pointer rounded-full hover:bg-gray-200/70 dark:hover:bg-gray-700/70 transition-all duration-200 ease-in-out"
      >
        {currentWindow === "Home" ? (
          <RiHome7Fill className={`h-7 w-7 text-black dark:text-gray-200`} />
        ) : (
          <BiHomeCircle className="h-7 w-7 text-black dark:text-gray-200" />
        )}
      </div>
      <div
        onClick={() => router.push('/explore')}
        className="p-[6px] cursor-pointer rounded-full hover:bg-gray-200/70 dark:hover:bg-gray-700/70 transition-all duration-200 ease-in-out"
      >
        {currentWindow === "Explore" ? (
          <RiSearch2Fill className={`h-7 w-7 text-black dark:text-gray-200`} />
        ) : (
          <RiSearch2Line className="h-7 w-7 text-black dark:text-gray-200" />
        )}
      </div>
      <div
        onClick={() => {
          router.push('/messages')
        }}
        className="p-[6px] cursor-pointer rounded-full hover:bg-gray-200/70 dark:hover:bg-gray-700/70 transition-all duration-200 ease-in-out"
      >
        {currentWindow === "Messages" ? (
          <HiMail className={`h-7 w-7 text-black dark:text-gray-200 `} />
        ) : (
          <HiOutlineMail className="h-7 w-7 text-black dark:text-gray-200" />
        )}
      </div>
      <div
        onClick={() => router.push('/bookmarks')}
        className="p-[6px] cursor-pointer rounded-full hover:bg-gray-200/70 dark:hover:bg-gray-700/70 transition-all duration-200 ease-in-out"
      >
        {currentWindow === "Bookmarks" ? (
          <BsBookmarkFill className={`h-6 w-6 text-black  dark:text-gray-200 `} />
        ) : (
          <BsBookmark className="h-6 w-6 text-black dark:text-gray-200" />
        )}
      </div>
    </div>
  );
}
