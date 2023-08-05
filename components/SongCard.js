import {AiOutlinePauseCircle,AiOutlinePlayCircle} from 'react-icons/ai'
import {useState,useEffect} from 'react';
import {useSound} from 'use-sound';
import {playingSong} from '../atoms/userAtom';
import {useRecoilState} from 'recoil';

let player;

export default function SongCard({res,j,setSongUrl,songUrl,audioUrl,setAudioUrl,searchSongValue,
	audioFileName,setAudioFileName,openSongSelection,setOpenSongSelection}) {
	
	const [isPlaying,setIsPlaying] = useState(false);
	const [nowPlaying,setNowPlaying] = useRecoilState(playingSong);


	const [play, { stop }] = useSound(res?.preview,{
		onend :()=>{
			stop();setIsPlaying(false)
		}
	});

	useEffect(()=>{
		if(nowPlaying){
			if(nowPlaying !== res?.preview){
				stop()
				setIsPlaying(false);
			}
		}
	},[nowPlaying])

	useEffect(()=>{
		player = document.getElementById('audioEle')

		return ()=>{
			stop();setIsPlaying(false);
		}
	},[])

	useEffect(()=>{
		if(!openSongSelection){
			stop();
		}
	},[openSongSelection])

	useEffect(()=>{
		if(res){
			stop();
			setIsPlaying(false);
		}
	},[res])

	useEffect(()=>{
		if(searchSongValue){
			stop()
		}
	},[searchSongValue])

	useEffect(()=>{
		if(isPlaying){
			play()
		}else{
			stop()
		}
	},[isPlaying])


	return(
		<div 
		className="w-full flex items-center gap-2 py-1 px-2 border-y-[1px] border-y-gray-300/50 cursor-pointer 
		hover:bg-gray-200/50 dark:hover:bg-gray-800/50 transition-all duration-200 ease-in-out xs:gap-5 gap-3">
			<div 
			onClick={()=>{
				setAudioFileName(res?.album?.title);
				setSongUrl(res?.preview);
				stop();
				setAudioUrl('');
				setOpenSongSelection(false);
			}} className="flex items-center gap-2 w-full w-[90%]">
				<div className="rounded-full sm:w-auto w-auto overflow-hidden">
					<img src={res?.album?.cover_big} alt="" className="h-11 w-11 aspect-square object-cover rounded-full"/>
				</div>
				<h6 className="text-md leading-normal break-all md:w-[80%]
				sm:w-auto w-[80%] font-semibold dark:text-gray-200 text-black ">{res?.album?.title}</h6>
			</div>
			<div 
			onClick={()=>{setIsPlaying(!isPlaying);setNowPlaying(res?.preview)}}
			className="rounded-full border-[1px] border-sky-500 ">
				{
					isPlaying ? 
					<AiOutlinePauseCircle className="h-7 w-7 text-sky-500"/>					
					:
					<AiOutlinePlayCircle className="h-7 w-7 text-sky-500"/>
				}
			</div>
			<audio className="" id="audioEle" src={res.preview}/>
		</div>

	)
}