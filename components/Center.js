import {FiChevronDown} from 'react-icons/fi';
import {useState} from 'react';
import {BsCardImage,BsEmojiSmile} from 'react-icons/bs';
import {TbGif} from 'react-icons/tb';
import {MdSchedule} from 'react-icons/md'
import {HiOutlineLocationMarker} from 'react-icons/hi';

export default function Center({setCurrentWindow,currentWindow}) {
	// body...
	const [home,setHome] = useState('For you')


	return (
		<div className="lg:w-[44.6%] md:w-[70%] xs:w-[90%] w-[100%] flex flex-col h-full border-r-[1.3px] border-gray-200">
			{
				currentWindow === 'Home' ?
				<div className="h-full relative w-full" >
					<div className="absolute top-0 backdrop-blur-lg bg-white/50 border-b-[1.3px] border-gray-200 w-full flex flex-col">
						<h1 className="ml-5 xs:block hidden mt-4 text-2xl font-semibold">
							Home
						</h1>
						<div className="w-full xs:hidden flex items-center pt-3 justify-center">
							<img src="twitter-icon.png" className="left-3 absolute top-3 cursor-pointer left-5 h-8 w-8 rounded-full"/>
							<center>
								<img src="twitter-icon.png" className="h-7 cursor-pointer w-7"/>
							</center>
						</div>
						<div className="mt-4 flex w-full">
							<div 
							onClick={()=>setHome('For you')}
							className="w-[50%] cursor-pointer hover:bg-gray-200/80 transition-all duration-200 
							ease-in-out flex items-center justify-center">
								<div className={`py-3 border-b-[3px] ${home=== 'For you' ? 'border-sky-600' : 'border-transparent'}`}>
									<h1 className={`text-md font-semibold ${home === 'For you' ? "text-black font-bold" : "text-gray-600"}`}>
										For you
									</h1>
								</div>
							</div>
							<div 
							onClick={()=>setHome('Following')}
							className="w-[50%] cursor-pointer hover:bg-gray-200/80 transition-all duration-200 
							ease-in-out flex items-center justify-center">
								<div className={`py-3 border-b-[3px] ${home=== 'Following' ? 'border-sky-600' : 'border-transparent'}`}>
									<h1 className={`text-md font-semibold ${home === 'Following' ? "text-black font-bold" : "text-gray-600"}`}>
										Following
									</h1>
								</div>
							</div>
						</div>
					</div>	
					<div className="mt-[130px] md:px-5 px-3 md:gap-2 lg:gap-4 gap-1 w-full flex border-b-[1.3px] border-gray-200">
						<img src="twitter-icon.png" alt="" className="h-12 w-12 rounded-full"/>
						<div className=" w-full flex flex-col">
							<div className="flex ">
								<div className="rounded-full border-[1px] border-gray-400/60 py-[2px] px-3 gap-2 flex items-center text-sky-500">
									<h1 className="text-sky-600 font-semibold text-md">Everyone</h1>
									<FiChevronDown className="h-4 w-4 text-sky-600 mt-1"/>
								</div>
							</div>
							<div className="mt-4 w-full">
 								<input type="text" className="text-2xl w-full placeholder:text-gray-500 text-gray-900 bg-transparent outline-none"
 								placeholder="What is happeing?!"
 								/>
							</div>
							<div className="mt-4 h-[1px] w-full bg-gray-200/80"/>
							<div className="flex items-center justify-between py-3">
								<div className="flex items-center">
									<div className="cursor-pointer rounded-full p-2 hover:bg-sky-200/60 transition-all duration-200 ease-in-out">
										<BsCardImage className="h-5 w-5 text-sky-500"/>
									</div>
									<div className="cursor-pointer rounded-full p-2 hover:bg-sky-200/60 transition-all duration-200 ease-in-out">
										<TbGif className="h-5 w-5 text-sky-500"/>
									</div>
									<div className="cursor-pointer rounded-full p-2 hover:bg-sky-200/60 transition-all duration-200 ease-in-out">
										<BsEmojiSmile className="h-5 w-5 text-sky-500"/>
									</div>
									<div className="cursor-pointer rounded-full p-2 hover:bg-sky-200/60 transition-all duration-200 ease-in-out">
										<MdSchedule className="h-5 w-5 text-sky-500"/>
									</div>
									<div className="cursor-pointer rounded-full p-2 hover:bg-sky-200/60 transition-all duration-200 ease-in-out">
										<HiOutlineLocationMarker className="h-5 w-5 text-sky-500"/>
									</div>
								</div>
								<button className={`px-5 py-[6px] rounded-full text-white font-bold bg-sky-500`}>
									Tweet
								</button>
							</div>
						</div>	
					</div>
				</div>
				:
				<>
				</>
			}
			
		</div>

	)
}