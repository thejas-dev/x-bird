import {useRef,useEffect,useState} from 'react'
import {useIsVisible} from '../hooks/useIsVisible';




export default function CommentCard({
	comment,i,calDate,BsThreeDots,likeThisComment,makeMePink,currentUser,
	millify,BsGraphUpArrow,AiOutlineHeart,AiFillHeart,viewThisComment,setCurrentWindow
}) {
	const ref = useRef()
	const isIntersecting = useIsVisible(ref)
	const [liked,setLiked] = useState(false);

	useEffect(()=>{
		if(isIntersecting){
			viewThisComment(comment.id)
		}		
	},[isIntersecting])

	useEffect(()=>{
		if(comment){
			if(comment?.likes?.some(element=>{
				if(element.id === currentUser?._id){
					return true;
				}
				return false
			})){
				setLiked(true)
			}else{
				setLiked(false)
			}
		}
	},[comment])


	return (
		<div ref={ref} key={i} className="flex gap-2 border-b-[1px] border-gray-200 dark:border-gray-700 mt-3 pb-2">
			<img src={comment?.user?.image} alt="" className="h-12 w-12 rounded-full shadow-md hover:shadow-xl hover:shadow-sky-600/30 
			duration-200 ease-in-out transition-all cursor-pointer"/>
			<div className="w-full flex flex-col">
				<div className='flex gap-1 w-full shrink truncate justify-between' >
					<div className="flex gap-1 truncate shrink items-center ">
						<h1 
						onClick={()=>{
							setCurrentWindow('Profile')
							window.history.replaceState({id:100},'Default',`?profile=${comment.user.id}`);
						}}
						className="text-lg truncate font-semibold text-black dark:text-gray-100 select-none hover:cursor-pointer hover:underline">
							{comment?.user?.name}
						</h1>
						<h1 
						onClick={()=>{
							setCurrentWindow('Profile')
							window.history.replaceState({id:100},'Default',`?profile=${comment.user.id}`);
						}}
						className="text-gray-500 text-md truncate select-none hidden sm:block">@{comment?.user?.username}</h1>
						<h1
						className="text-gray-500 text-md truncate  whitespace-nowrap select-none "> - {
							calDate(comment?.createdAt)
						}</h1>
					</div>
					<div className="p-1 rounded-full md:hover:bg-sky-300/20 transition-all duration-200 ease-in-out group">
						<BsThreeDots className="text-gray-500 group-hover:text-sky-500 transition-all duration-200 ease-in-out h-5 w-5"/>
					</div>
				</div>
				<div className="pt-1 w-full">
					{
						comment?.text?.includes('media.tenor.com') ?
						<img src={comment.text} className={`rounded-xl mt-2 shadow-lg shadow-gray-200/20 w-full`} />
						:
						<h1 className="w-full break-words text-lg text-black dark:text-gray-200">{comment?.text}</h1>
					}
				</div>
				<div className={`rounded-2xl grid ${comment.images.length > 0 && 'mt-3'} rounded-2xl ${comment?.images?.length>1 ? 'grid-cols-2' : 'grid-cols-1'} gap-1 overflow-hidden`}>
					{
						comment?.images?.length>0 &&
						comment?.images?.map((ur,i)=>(
						<div className="relative group flex items-center justify-center cursor-pointer overflow-hidden" key={i}>
							<img src={ur} alt="" className="select-none w-full aspect-square transition-all duration-300 ease-in-out"/>
						</div>
						))

					}
				</div>
				<div className="mt-2 lg:pr-10 md:pr-2 pr-0 gap-9 w-full md:w-[85%] lg:w-[100%] xl:w-[90%] flex items-center flex-wrap">
					<div
					onClick={()=>{
						if(currentUser){
							likeThisComment(comment.id);
							makeMePink(i);
						}
						setLiked(!liked)
					}}
					className="flex cursor-pointer group md:gap-[6px] gap-[3px] items-center">
						<div className="p-[10px] group-hover:bg-pink-300/30 dark:group-hover:bg-pink-700/30 transition-all duration-200 ease-in-out rounded-full">
							{
								liked ? 
								<AiFillHeart id={`commentlike-${i}`} className="h-5 group-hover:text-pink-500 transition-all duration-200 ease-in-out w-5 text-pink-600"/>
								:
								<AiOutlineHeart 
								id={`commentlike-${i}`}
								className="h-5 group-hover:text-pink-500 transition-all duration-200 ease-in-out w-5 text-gray-600"/>
							}	
						</div>
						<h1 className={`text-md select-none text-gray-500 group-hover:text-pink-500
						${comment?.likes?.some(element=>{
							if(element.id === currentUser?._id){
								return true;
							}
							return false
						}) &&  'text-pink-500' }
						`}>
							{millify(comment.likes.length)}
						</h1>
						
					</div>
					<div className="flex group md:gap-[6px] gap-[3px] items-center">
						<div className="p-[10px] group-hover:bg-sky-300/30 dark:group-hover:bg-sky-700/30 transition-all duration-200 ease-in-out rounded-full">
							<BsGraphUpArrow className="h-4 w-4 group-hover:text-sky-500 transition-all duration-200 ease-in-out text-gray-600"/>
						</div>
						<h1 className="text-md select-none text-gray-500 group-hover:text-sky-500">
							{millify(comment?.views?.length)}
						</h1>
					</div>

				</div>
			</div>
		</div>


	)
}