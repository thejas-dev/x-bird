import {FiSearch} from 'react-icons/fi'
import {BsThreeDots} from 'react-icons/bs'
import {useRecoilState} from 'recoil'
import {currentChatState} from '../atoms/userAtom'



export default function Right({setCurrentWindow,currentWindow}) {
	const [currentChat,setCurrentChat] = useRecoilState(currentChatState);
	
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
	if(currentWindow === 'Messages'){
		return (
			<div className={`lg:w-[50.6%] md:w-[80%] xs:w-[90%] w-[100%] ${currentChat ? 'block':'hidden'} h-full px-3 lg:block pt-6 overflow-y-scroll`}>
				{
					currentChat ? 
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
					<>
					</>
				}
				
			</div>

		)
	}else{
		return (
			<div className="lg:w-[40.4%] xl:w-[32.4%] w-0 hidden lg:block h-full pl-7 pr-10 overflow-y-scroll">
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
					<div className="mt-5 mb-14 rounded-2xl bg-gray-300/20 flex flex-col overflow-hidden">
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
									<div className="bg-red-500">
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
			</div>

		)		
	}
}