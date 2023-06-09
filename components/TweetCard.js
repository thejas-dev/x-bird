import {useRef,useState,useEffect} from 'react'
import {useIsVisible} from '../hooks/useIsVisible';
import {showClipboardState} from '../atoms/userAtom';
import {useRecoilState} from 'recoil'

export default function TweetCard({main,j,setCurrentWindow,calDate,BsThreeDots,FaRegComment,millify,
	AiOutlineRetweet,retweetThisTweet,makeMeSpin,likeThisTweet,makeMePink,AiFillHeart,AiOutlineHeart,
	BsFillShareFill,BsGraphUpArrow,currentUser,viewThisTweet

}) {
	const ref = useRef()
	const isIntersecting = useIsVisible(ref)
	const [showClipboard,setShowClipboard] = useRecoilState(showClipboardState);

	useEffect(()=>{
		if(isIntersecting){
			viewThisTweet(j)
		}		
	},[isIntersecting])


	return(
		<div ref={ref} key={j} className={`w-full ${j===0 ? 'border-b-[1.6px]':'border-y-[1.6px]'} p-3 flex basis-auto md:gap-4 sm:gap-2 gap-2 
		border-gray-300/70 hover:bg-gray-200/40 transition-all z-0 duration-200 ease-in cursor-pointer`}>
			<img 
			onClick={()=>{
				setCurrentWindow('Profile')
				window.history.replaceState({id:100},'Default',`?profile=${main?.user?.id}`);
			}}
			src={main?.user?.image} alt="" className="rounded-full select-none h-12 w-12 shadow-md hover:shadow-xl hover:shadow-sky-600/30"/>
			<div className="flex flex-col w-full overflow-hidden">
				<div className='flex gap-1 w-full shrink truncate justify-between' >
					<div className="flex gap-1 truncate shrink items-center ">
						<h1 
						onClick={()=>{
							setCurrentWindow('Profile')
							window.history.replaceState({id:100},'Default',`?profile=${main?.user?.id}`);
						}}
						className="text-lg truncate font-semibold text-black select-none hover:cursor-pointer hover:underline">
							{main?.user?.name}
						</h1>
						<h1 
						onClick={()=>{
							setCurrentWindow('Profile')
							window.history.replaceState({id:100},'Default',`?profile=${main.user.id}`);
						}}
						className="text-gray-500 text-md truncate select-none hidden sm:block">@{main.user.username}</h1>
						<h1 
						onClick={()=>{
							window.history.replaceState({id:100},'Tweet',`?tweet=${main._id}`);
							setCurrentWindow('tweet')
						}}
						className="text-gray-500 text-md truncate  whitespace-nowrap select-none "> - {
							calDate(main.createdAt)
						}</h1>
					</div>
					<div className="p-1 rounded-full md:hover:bg-sky-300/20 transition-all duration-200 ease-in-out group">
						<BsThreeDots className="text-gray-500 group-hover:text-sky-500 transition-all duration-200 ease-in-out h-5 w-5"/>
					</div>
				</div>
				<div 
				onClick={()=>{
					window.history.replaceState({id:100},'Tweet',`?tweet=${main?._id}`);setCurrentWindow('tweet')
				}}
				className="w-full text-lg">
					<h1 className="w-full text-gray-900 select-none break-words">{main?.text}</h1>
				</div>	
				<div 
				onClick={()=>{
					window.history.replaceState({id:100},'Tweet',`?tweet=${main?._id}`);setCurrentWindow('tweet')
				}}
				className={`rounded-2xl ${main?.images?.length>0 && 'mt-3'} grid rounded-2xl ${main?.images?.length>1 ? 'grid-cols-2' : 'grid-cols-1'} gap-1 overflow-hidden`}>
					{
						main?.images?.length>0 &&
							main?.images?.map((ur,i)=>(
							<div className="relative group flex items-center justify-center cursor-pointer overflow-hidden" key={i}>
								<div className="absolute h-full w-full z-10 transition-all duration-200 
								ease-in-out group-hover:bg-gray-500/10"/>
								<img src={ur} alt="" className="select-none w-full aspect-square transition-all duration-300 ease-in-out"/>
							</div>
							))

					}
				</div>
				<div className="mt-3 lg:pr-10 md:pr-2 pr-0 justify-between w-full md:w-[85%] lg:w-[100%] xl:w-[90%] flex items-center flex-wrap">
					<div 
					onClick={()=>{
						window.history.replaceState({id:100},'Tweet',`?tweet=${main?._id}`);
						setCurrentWindow('tweet')
					}}
					className="flex group md:gap-[6px] gap-[3px] items-center">
						<div className="p-[10px] group-hover:bg-sky-300/30 transition-all duration-200 ease-in-out rounded-full">
							<FaRegComment className="h-4 w-4 group-hover:text-sky-500 transition-all duration-200 ease-in-out text-gray-600"/>
						</div>
						<h1 className="text-md text-gray-500 group-hover:text-sky-500">
							{millify(main.comments.length)}
						</h1>
					</div>
					<div 
					onClick={()=>{retweetThisTweet(j);
						if(currentUser){
							makeMeSpin(j)
						}
					}}
					className="flex group md:gap-[6px] gap-[3px] items-center">
						<div className="p-[10px] group-hover:bg-green-300/30 transition-all duration-200 ease-in-out rounded-full">
							<AiOutlineRetweet id={`retweet-${j}`} className={`h-5 group-hover:text-green-500 transition-all duration-200 ease-in-out w-5 text-gray-600
							${main.retweetedBy.some(element=>{
								if(element.id === currentUser?._id){
									return true;
								}
								return false
							}) &&  'text-green-500' }
							`}/>
						</div>
						<h1 className={`text-md text-gray-500
						${main?.retweetedBy?.some(element=>{
							if(element.id === currentUser?._id){
								return true;
							}
							return false
						}) &&  'text-green-500' }
						group-hover:text-green-500`}>
							{millify(main.retweetedBy.length)}
						</h1>
					</div>
					<div
					onClick={()=>{
						likeThisTweet(j);
						if(currentUser){
							makeMePink(j)
						}
					}}
					className="flex group md:gap-[6px] gap-[3px] items-center">
						<div className="p-[10px] group-hover:bg-pink-300/30 transition-all duration-200 ease-in-out rounded-full">
							{
								main?.likes?.some(element=>{
									if(element.id === currentUser?._id){
										return true;
									}
									return false
								}) ? 
								<AiFillHeart id={`like-${j}`} className="h-5 group-hover:text-pink-500 transition-all duration-200 ease-in-out w-5 text-pink-600"/>
								:
								<AiOutlineHeart 
								id={`like-${j}`}
								className="h-5 group-hover:text-pink-500 transition-all duration-200 ease-in-out w-5 text-gray-600"/>
							}
						</div>
						<h1 className={`text-md text-gray-500 group-hover:text-pink-500 
						${main?.likes?.some(element=>{
							if(element?.id === currentUser?._id){
								return true;
							}
							return false
						}) &&  'text-pink-500' }
						`}>
							{millify(main.likes.length)}
						</h1>
					</div>
					<div className="group md:gap-[6px] gap-[3px] hidden xs:flex items-center">
						<div className="p-[10px] group-hover:bg-sky-300/30 transition-all duration-200 ease-in-out rounded-full">
							<BsGraphUpArrow className="h-4 w-4 group-hover:text-sky-500 transition-all duration-200 ease-in-out text-gray-600"/>
						</div>
						<h1 className="text-md text-gray-500 group-hover:text-sky-500">
							{millify(main.views.length)}
						</h1>
					</div>
					<div 
					onClick={()=>{
						// console.log(location.toString() + '?tweet=' + main._id)
						navigator.clipboard.writeText(location.toString() + '?tweet=' + main._id)
						setShowClipboard(true)
					}}
					className="flex group md:gap-[6px] gap-[3px] items-center">
						<div className="p-[10px] group-hover:bg-sky-300/30 transition-all duration-200 ease-in-out rounded-full">
							<BsFillShareFill className="h-4 w-4 group-hover:text-sky-500 transition-all duration-200 ease-in-out text-gray-600"/>
						</div>
					</div>
				</div>


			</div>	
		</div>


	)
}