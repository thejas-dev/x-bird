import {useRef,useState,useEffect} from 'react'
import {useIsVisible} from '../hooks/useIsVisible';
import {showClipboardState,searchTextState,soundAllowedState,imPlayingState,
	maxImageState,showMaxImageState} from '../atoms/userAtom';
import {useRouter} from 'next/router'
import {host} from '../utils/ApiRoutes'
import {useRecoilState} from 'recoil'
import { faVolumeXmark, faVolumeHigh } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {motion} from 'framer-motion'
import ReactPlayer from 'react-player/lazy'
import {useSound} from 'use-sound';
import React from 'react';
import ReactAudioPlayer from 'react-audio-player';
import Image from 'next/image';

let audio;
var timer;

export default function TweetCard({main,j,setCurrentWindow,calDate,BsThreeDots,FaRegComment,millify,
	AiOutlineRetweet,retweetThisTweet,makeMeSpin,likeThisTweet,makeMePink,AiFillHeart,AiOutlineHeart,
	BsFillShareFill,BsGraphUpArrow,currentUser,viewThisTweet,currentWindow,own,deleteThisOwnTweet,displayUser,
	home
}) {
	const ref = useRef()
	const playerRef = useRef(null);
	const audioRef = useRef(null);
	const isIntersecting = useIsVisible(ref)
	const [showClipboard,setShowClipboard] = useRecoilState(showClipboardState);
	const [searchText,setSearchText] = useRecoilState(searchTextState);
	const [soundAllowed,setSoundAllowed] = useRecoilState(soundAllowedState);
	const [imPlaying,setImPlaying] = useRecoilState(imPlayingState);
	const [showMaxImage,setShowMaxImage] = useRecoilState(showMaxImageState)					
	const [maxImage,setMaxImage] = useRecoilState(maxImageState)
	const [liked,setLiked] = useState(false);
	const [haveAudio,setHaveAudio] = useState(false);
	const router = useRouter();
	const [audioPlaying,setAudioPlaying] = useState(false);
	const [imagekitAudio,setImagekitAudio] = useState(false);
	const [showHeartAnimation,setShowHeartAnimation] = useState(false);
	const [songUrl,setSongUrl] = useState('');
	const [videoUrl,setVideoUrl] = useState('');
	// const [play, { stop:stopAudio8 }] = useSound(main?.audio,{
	// 	loop:true,
	// 	format:"mp3",
	// 	key:j
	// });

	const play = () => {
	    if (audioRef.current) {
	      audioRef.current.audioEl.current.play();
	    }
	};

	const stopAudio8 = () => {
	    if (audioRef.current) {
	      audioRef.current.audioEl.current.pause();
	    }
	};


	const handlePlay = () => {
	    playerRef.current?.getInternalPlayer()?.play();
	  };

	  const handlePause = () => {
	    playerRef.current?.getInternalPlayer()?.pause();
	  };

	const playImagekitAudio = () => {
		if(audio){
			audio.play()
		}
	}

	const stopAudio8ImagekitAudio = () => {
		if(audio){
			audio.pause()
			audio.currentTime = 0;
		}
	}

	const loadAudio = () => {
		audio = new Audio();
		if(main?.audio){			 
			audio.loop = true;
			audio.src = main?.audio
		}			
		
	}

	useEffect(()=>{
		if(main){
			isLiked()
		}
	},[main])

	useEffect(()=>{
		setSongUrl(main?.audio);
		return ()=> {
			stopAudio8();
			stopAudio8ImagekitAudio()
			setImPlaying(false);
			setHaveAudio(false);
		}
	},[])

	useEffect(()=>{
		if(home){
			stopAudio8();
			stopAudio8ImagekitAudio();
			setImPlaying(false);
			setSoundAllowed(false);
		}
	},[home])

	useEffect(()=>{
		if(isIntersecting){
			viewThisTweet(j);
			if(main?.videos && !videoUrl){
				setVideoUrl(main?.videos)
			}			
			if(soundAllowed && !audioPlaying && main?.audio && !imPlaying){
				setSongUrl(main?.audio);
				if(imagekitAudio){
					playImagekitAudio()
				}else{
					play()	
				}
				setAudioPlaying(true)
				setImPlaying(true)
			}
		}else{
			if(main?.audio && audioPlaying){
				setSongUrl(main?.audio);
				stopAudio8ImagekitAudio()
				stopAudio8()
				setAudioPlaying(false)
				setImPlaying(false)	
			}

		}
	},[isIntersecting])

	useEffect(()=>{
		if(soundAllowed){
			if(isIntersecting && main?.audio && !audioPlaying && !imPlaying){
				setSongUrl(main?.audio);
				if(imagekitAudio){
					playImagekitAudio()
				}else{
					play()
				}
				setAudioPlaying(true)
				setImPlaying(true)				
			}
		}else{
			if(main?.audio){
				setSongUrl(main?.audio);
				stopAudio8ImagekitAudio()
				stopAudio8()		
				setAudioPlaying(false)
				setImPlaying(false)
			}
		}
	},[soundAllowed])

	const isLiked = async() => {
		let res = await main?.likes?.some(element=>{
			if(element?.id === currentUser?._id){
				return true;
				
			}
			return false
		})
		setLiked(res);		
	}

	useEffect(()=>{
		if(main?.audio.length > 1){
			setHaveAudio(true);
			loadAudio()
		}else{
			setHaveAudio(false);
		}
		if(main?.audio){
			setSongUrl(main?.audio);
			let mainSplitted = main?.audio?.split('.');
			if(main?.audio?.split('.')[mainSplitted.length - 1] === 'mp3'){
				setImagekitAudio(false)
			}else{
				setImagekitAudio(true)
			}
		}
	},[main,j])

	function onClickHandler(event,ur) {
	  clearTimeout(timer);
	  
	  if (event.detail === 1) {
	    timer = setTimeout(() => {
	      	stopAudio8()
			setSoundAllowed(false);
			let route = `/trend?trend=${main._id}`
			router.push(route)
	    }, 200)

	  } else if (event.detail === 2) {
	  	if(currentUser){
	  		setShowHeartAnimation(true);
	  		setTimeout(()=>{setShowHeartAnimation(false)},1000)
	  	}
	    document.getElementById(`like-${j}`).classList.add('scale-75');
	    setTimeout(()=>{
	    	document.getElementById(`like-${j}`).classList.remove('scale-75');
	    },300)
		likeThisTweet(j);
		setLiked(!liked)
	  }
	}

	return(
		<motion.div 
		initial={{
			opacity:0,
		}}
		whileInView={{opacity:1}}
		transition={{duration:0.4}}
		viewport={{ once: true }}

		ref={ref} key={j} className={`w-full ${j===0 ? 'border-b-[1.6px]':'border-y-[1.6px]'} p-3 flex basis-auto md:gap-4 sm:gap-2 gap-2 
		border-gray-300/70 select-none dark:border-gray-800/70 hover:bg-gray-200/40 dark:hover:bg-gray-800/40 transition-all z-0 duration-200 
		no_highlights ease-in cursor-pointer`}>
			<img 
			onClick={()=>{
				setSoundAllowed(false)
				stopAudio8()
				let route = `/profile?profile=${main?.user?.id}`
				router.push(route)
			}}
			src={main?.user?.image} alt="" className="rounded-full select-none h-12 w-12 shadow-md hover:shadow-xl hover:shadow-sky-600/30"/>
			<div className="flex flex-col w-full overflow-hidden">
				<div className='flex gap-1 w-full shrink truncate justify-between' >
					<div className="flex gap-1 truncate shrink items-center ">
						<h1 
						onClick={()=>{
							let route = `/profile?profile=${main?.user?.id}`
							router.push(route)
							setSoundAllowed(false)
							stopAudio8()

						}}
						className="text-lg truncate font-semibold text-black dark:text-gray-100 select-none hover:cursor-pointer hover:underline">
							{main?.user?.name}
						</h1>
						<h1 
						onClick={()=>{
							let route = `/profile?profile=${main?.user?.id}`
							router.push(route)
							stopAudio8()
							setSoundAllowed(false);
						}}
						className="text-gray-500 text-lg truncate select-none hidden sm:block">@{main?.user?.username}</h1>
						<h1 
						onClick={()=>{
							stopAudio8()
							setSoundAllowed(false);
							let route = `/trend?trend=${main._id}`
							router.push(route)
						}}
						className="text-gray-500 text-md truncate  whitespace-nowrap select-none "> - {
							calDate(main.createdAt)
						}</h1>
					</div>
					{
						own ? 
						<div className="p-1 relative rounded-full md:hover:bg-sky-300/20 dark:md:hover:bg-sky-800/20 transition-all duration-200 ease-in-out group">
							<div 
							id={`post-${j}`}
							onClick={()=>{
								deleteThisOwnTweet(j);
							}}
							className="absolute px-2 py-1 rounded-xl backdrop-blur-lg border-[1px] 
							right-8 z-50 top-0 bottom-0 my-auto flex items-center justify-center border-red-500 
							text-black dark:text-gray-200 hidden font-semibold hover:bg-gray-200/70 dark:hover:bg-gray-800/70 transition-all duration-200 ease-in-out">
								Delete Post
							</div>
							<BsThreeDots 
							onClick={()=>{
								if(displayUser._id === currentUser._id){
									let btn = document.getElementById(`post-${j}`)
									if(btn.classList.value.includes('hidden')){
										btn.classList.remove('hidden');
									}else{
										btn.classList.add('hidden')
									}												
								}

							}}
							className="text-gray-500 group-hover:text-sky-500 transition-all duration-200 ease-in-out h-5 w-5"/>
						</div>
						:
						<div className="p-1 rounded-full md:hover:bg-sky-300/20 transition-all duration-200 ease-in-out group">
							<BsThreeDots className="text-gray-500 group-hover:text-sky-500 transition-all duration-200 ease-in-out h-5 w-5"/>
						</div>
					}
				</div>
				<div
				className={`w-full text-md ${main?.text?.length < 1 && 'hidden'} `}>
					<h1 className="w-full z-50 text-gray-900 dark:text-gray-200 break-words"
					style={{ whiteSpace: 'pre-line' }}>
					{main?.text?.split('\n')?.map((line, i) => (
					    <React.Fragment key={i}>
					      {line.split(' ')?.map((txt, j) => {
					        if (txt.startsWith('#')) {
					          return (
					            <span key={j}>
					              {' '}
					              <a
					                onClick={() => {
					                  stopAudio8();
					                  setSoundAllowed(false);
					                  setSearchText(txt);
					                  router.push('/explore');
					                }}
					                className="text-sky-500 hover:underline"
					                key={j}
					              >
					                {txt}
					              </a>
					            </span>
					          );
					        } else if (txt.startsWith('@')) {
					          const username = txt.substring(1); // Remove the @ symbol
					          return (
					            <span key={j}>
					              {' '}
					              <a
					                onClick={() => {
					                  stopAudio8();
					                  setSoundAllowed(false);
					                  let route = `/profile?username=${username}`
									  router.push(route)
					                }}
					                className="text-sky-500 hover:underline"
					                key={j}
					              >
					                {txt}
					              </a>
					            </span>
					          );
					        } else {
					          return (
					            <span key={j}>
					              {' '}
					              <a
					                onClick={() => {
					                  stopAudio8();
					                  setSoundAllowed(false);
					                  let route = `/trend?trend=${main._id}`;
					                  router.push(route);
					                }}
					                key={j}
					              >
					                {txt}
					              </a>
					            </span>
					          );
					        }
					      })}
					      <br />
					    </React.Fragment>
					  ))}
					  </h1>
				</div>	
				<div 
				className={`rounded-2xl ${main?.images?.length>0 && 'mt-3'} grid rounded-2xl ${main?.images?.length>1 ? 'grid-cols-2' : 'grid-cols-1'} 
				gap-1 overflow-hidden relative z-0`}>
					<div className={`absolute h-[70px] z-10 w-[70px] inset-0 
					m-auto opacity-0 ${showHeartAnimation ? 'pop' : ''} ${main?.images?.length < 1 && 'hidden'} `}>
						<AiFillHeart className="h-full w-full text-white"/>
					</div>
					<ReactAudioPlayer ref={audioRef} src={songUrl} autoPlay={false} controls={false} />
					{
						main?.images?.length>0 &&
							main?.images?.map((ur,i)=>(
							<div 
							onClick={(e)=>{
								onClickHandler(e,ur)
							}}
							className="relative group flex items-center justify-center cursor-pointer overflow-hidden" key={i}>
								<div className="absolute h-full w-full transition-all duration-200 
								ease-in-out group-hover:bg-gray-500/10"/>
					            <Image
					              src={ur}
					              alt=""
					              width={500}
      							  height={500}
					              objectFit="cover"
					              loading="lazy"
					              className="select-none transition-all duration-300 ease-in-out"
					            />
							</div>
							))

					}
					{
						main?.videos &&
						<div className="relative rounded-md mt-2 overflow-hidden">												
							<ReactPlayer ref={playerRef} url={videoUrl} controls={true} width='100%' height='100%'/>								
						</div>
					}
					{
						haveAudio &&
						<div 
						onClick={()=>{
							if(!soundAllowed){
								play();
								setImPlaying(true);
								setAudioPlaying(true)
							}else{
								stopAudio8()
							}
							setSoundAllowed(!soundAllowed);
						}}
						className="absolute z-30 right-2 bottom-2 rounded-full p-1 bg-black/40 cursor-pointer
						transition-all duration-200 ease-in-out hover:bg-black/50 flex items-center justify-center
						backdrop-blur-md h-6 w-6">
							{
								soundAllowed ? 
								<FontAwesomeIcon icon={faVolumeHigh} className="h-full w-full text-white"/>
								:
								<FontAwesomeIcon icon={faVolumeXmark} className="h-full w-full text-white" />
							}

						</div>
					}
				</div>
				<div className="mt-3 lg:pr-10 md:pr-2 pr-0 justify-between w-full md:w-[85%] lg:w-[100%] xl:w-[90%] flex items-center flex-wrap">
					<div 
					onClick={()=>{
						stopAudio8()
						setSoundAllowed(false);
						let route = `/trend?trend=${main._id}`
						router.push(route)
					}}
					className="flex group md:gap-[6px] gap-[3px] items-center">
						<div className="p-[10px] group-hover:bg-sky-300/30 dark:group-hover:bg-sky-700/30 transition-all duration-200 ease-in-out rounded-full">
							<FaRegComment className="h-4 w-4 group-hover:text-sky-500 transition-all duration-200 ease-in-out text-gray-600"/>
						</div>
						<h1 className="text-md text-gray-500 group-hover:text-sky-500">
							{millify(main?.comments?.length)}
						</h1>
					</div>
					<div 
					onClick={()=>{
						retweetThisTweet(j);
						if(currentUser){
							makeMeSpin(j)
						}
					}}
					className="flex group md:gap-[6px] gap-[3px] items-center">
						<div className="p-[10px] sm:group-hover:bg-green-300/30 sm:dark:group-hover:bg-green-700/30 active:scale-50 transition-all duration-200 ease-in-out rounded-full">
							<AiOutlineRetweet id={`retweet-${j}`} className={`h-5 group-hover:text-green-500 transition-all duration-200 ease-in-out w-5 text-gray-600
							${main?.retweetedBy?.some(element=>{
								if(element?.id === currentUser?._id){
									return true;
								}
								return false
							}) &&  'text-green-500' }
							`}/>
						</div>
						<h1 className={`text-md text-gray-500
						${main?.retweetedBy?.some(element=>{
							if(element?.id === currentUser?._id){
								return true;
							}
							return false
						}) &&  'text-green-500' }
						group-hover:text-green-500`}>
							{millify(main?.retweetedBy?.length)}
						</h1>
					</div>
					<div
					onClick={()=>{
						if(currentUser){
							makeMePink(j)
							setLiked(!liked)
							likeThisTweet(j);
						}else{
							likeThisTweet(j);
						}
					}}
					className="flex group md:gap-[6px] gap-[3px] items-center">
						<div className="p-[10px] sm:group-hover:bg-pink-300/30 sm:dark:group-hover:bg-pink-700/30 active:scale-50 transition-all duration-200 ease-in-out rounded-full">
							{
								liked ? 
								<AiFillHeart id={`like-${j}`} className="h-5 group-hover:text-pink-500 dark:group-hover:text-pink-600 transition-all duration-200 ease-in-out w-5 text-pink-600
								focus:scale-75 transition-all duration-800 ease-in-out 
								"/>
								:
								<AiOutlineHeart 
								id={`like-${j}`}
								className="h-5 group-hover:text-pink-500 dark:group-hover:text-pink-600 transition-all duration-200 ease-in-out w-5 text-gray-600
								focus:scale-75 transition-all duration-800 ease-in-out 
								"/>
							}
						</div>
						<h1 className={`text-md text-gray-500 group-hover:text-pink-500 select-none
						${main?.likes?.some(element=>{
							if(element?.id === currentUser?._id){
								return true;
							}
							return false
						}) &&  'text-pink-500' }
						`}>
							{millify(main?.likes?.length)}
						</h1>
					</div>
					<div className="group md:gap-[6px] gap-[3px] hidden xs:flex items-center">
						<div className="p-[10px] group-hover:bg-sky-300/30 dark:group-hover:bg-sky-700/30 transition-all duration-200 ease-in-out rounded-full">
							<BsGraphUpArrow className="h-4 w-4 group-hover:text-sky-500 transition-all duration-200 ease-in-out text-gray-600"/>
						</div>
						<h1 className="text-md text-gray-500 group-hover:text-sky-500">
							{millify(main?.views?.length)}
						</h1>
					</div>
					<div 
					onClick={()=>{
						navigator.clipboard.writeText('https://trendzio-v1.vercel.app' + '/trend?trend=' + main._id)
						setShowClipboard(true)
					}}
					className="flex group md:gap-[6px] gap-[3px] items-center">
						<div className="p-[10px] group-hover:bg-sky-300/30 dark:group-hover:bg-sky-700/30 transition-all duration-200 ease-in-out rounded-full">
							<BsFillShareFill className="h-4 w-4 group-hover:text-sky-500 transition-all duration-200 ease-in-out text-gray-600"/>
						</div>
					</div>
				</div>


			</div>	
		</motion.div>


	)
}
