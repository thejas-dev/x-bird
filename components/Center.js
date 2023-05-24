import {FiChevronDown} from 'react-icons/fi';
import {useState,useEffect} from 'react';
import {BsCardImage,BsEmojiSmile} from 'react-icons/bs';
import {TbGif} from 'react-icons/tb';
import {useRecoilState} from 'recoil'
import {currentChatState,currentUserState} from '../atoms/userAtom'
import {MdSchedule} from 'react-icons/md'
import {HiOutlineLocationMarker} from 'react-icons/hi';

export default function Center({setCurrentWindow,currentWindow}) {
	// body...
	const [home,setHome] = useState('For you');
	const [currentChat,setCurrentChat] = useRecoilState(currentChatState);
	const [currentUser,setCurrentUser] = useRecoilState(currentUserState);
	const [tweetText,setTweetText] = useState('');	
	const [path,setPath] = useState('');
	const [url,setUrl] = useState([]);

	const pathCheck = (path) =>{
		if(path){
			if(path.split('.').includes('jpg')){
				return true;
			}else if(path.split('.').includes('jpeg')){
				return true;
			}else if(path.split('.').includes('png')){
				return true;
			}
		}
	}

	useEffect(()=>{
		const image_input = document.querySelector('#file1');
		if(image_input){

		image_input.addEventListener('change',()=>{
			const reader = new FileReader();
		
			reader.addEventListener('load',()=>{
				let uploaded_image = reader.result;
				if(url<4){
					setUrl((url)=>[...url,uploaded_image]);
				}
			});
			reader.readAsDataURL(image_input.files[0]);
			})
		}
	
	},[path])
	console.log(url)

	useEffect(()=>{
		function autoResize() {
			this.style.height = 'auto',
			this.style.height = this.scrollHeight + 'px'
		}
		const ele = document.getElementById('tweetArea');
		ele.addEventListener('input',autoResize,false);

	},[])

	const openFileInput = () => {
		document.getElementById('file1').click();
	}

	return (
		<div className="lg:w-[44.6%] md:w-[70%] xs:w-[90%] w-[100%] flex flex-col h-full border-r-[1.3px] border-gray-200 overflow-y-scroll">
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
						<img src={currentUser?.image} alt="" className="h-12 w-12 rounded-full"/>
						<div className=" w-full mt-2 flex flex-col">
							<div className="flex ">
								<div className="rounded-full border-[1px] border-gray-400/60 py-[2px] px-3 gap-2 flex items-center text-sky-500">
									<h1 className="text-sky-600 font-semibold text-md">Everyone</h1>
									<FiChevronDown className="h-4 w-4 text-sky-600 mt-1"/>
								</div>
							</div>
							<div className="mt-4 w-full">
 								<textarea type="text" id="tweetArea"
 								value={tweetText}
 								onChange={(e)=>setTweetText(e.target.value)}
 								className="text-xl resize-none overflow-hidden h-7 w-full placeholder:text-gray-500 text-gray-900 bg-transparent outline-none"
 								placeholder="What is happeing?!"
 								/>
							</div>
							{
								url.length>0 &&
								<div className={`mt-4 grid rounded-2xl ${url.length>1 ? 'grid-cols-2' : 'grid-cols-1'} overflow-hidden w-full`}>
									{
										url.map((ur,i)=>(
										<div className="relative group cursor-pointer overflow-hidden" key={i}>
											<div className="absolute h-full w-full z-20 transition-all duration-200 
											ease-in-out group-hover:bg-black/30"/>
											<img src={url} alt="" className="w-full transition-all duration-300 ease-in-out group-hover:scale-150"/>
										</div>
										))
									}
								</div>

							}
							<div className="mt-4 h-[1px] w-full bg-gray-200/80"/>
							<div className="flex items-center justify-between py-3">
								<div className="flex items-center">
									<div className="cursor-pointer rounded-full p-2 hover:bg-sky-200/60 transition-all duration-200 ease-in-out">
										<BsCardImage onClick={openFileInput} className="h-5 w-5 text-sky-500"/>
										<input type="file" id="file1" accept="image/*" 
										value={path}
										onChange={(e)=>setPath(e.target.value)}
										hidden
										/>
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