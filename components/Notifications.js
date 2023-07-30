import {BiArrowBack} from 'react-icons/bi';
import {useRecoilState} from 'recoil'
import {currentUserState} from '../atoms/userAtom'
import {useState,useEffect} from 'react';
import {updateNotifySettings,dialerRingtonePlayUpdate,updateThemeChangeInfo} from '../utils/ApiRoutes';
import axios from 'axios';
import {AiOutlineRight} from 'react-icons/ai';
import {signOut} from 'next-auth/react'


export default function Notification({currentWindow,setCurrentWindow,setShowThemeMenu,
	setShowCategorySelector}) {
	// body...
	const [currentUser,setCurrentUser] = useRecoilState(currentUserState);
	const [notify,setNotify] = useState(false);
	const [notifyVibrate,setNotifyVibrate] = useState(false);
	const [videCallNotify,setVideCallNotify] = useState(false);
	const [currUserdialerRingtonePlay,setCurrUserdialerRingtonePlay] = useState(false);

	useEffect(()=>{
		if(currentUser){
			if(currentUser?.notify){
				setNotify(true);
				document.getElementById('mainNotify').checked = true
				if(currentUser?.notifyVibrate){
					setNotifyVibrate(true)
					document.getElementById('vibrateNotify').checked = true
				}else{
					setNotifyVibrate(false)					
					document.getElementById('vibrateNotify').checked = false
				}
				if(currentUser?.videCallNotify){
					setVideCallNotify(true)
					document.getElementById('videoNotify').checked = true
				}else{
					setVideCallNotify(false)					
					document.getElementById('videoNotify').checked = false
				}
			}else{
				setNotify(false)
				document.getElementById('mainNotify').checked = false
				
			}
			if(currentUser?.dialerRingtonePlay){
				setCurrUserdialerRingtonePlay(true);
				document.getElementById('dialerTone').checked = true
			}else{
				setCurrUserdialerRingtonePlay(false);
				document.getElementById('dialerTone').checked = false			
			}
		}
	},[currentUser])



	const updateVibrateNotify = async(result) => {		
		const {data} = await axios.post(`${updateNotifySettings}/${currentUser._id}`,{
			notify,notifyVibrate:result,videCallNotify
		})			
		setCurrentUser(data.user)
	}	

	const updateNotify = async(result) => {		
		const {data} = await axios.post(`${updateNotifySettings}/${currentUser._id}`,{
			notify:result,notifyVibrate,videCallNotify
		})			
		setCurrentUser(data.user)
	}

	const updateVideoCallNotify = async(result) => {		
		const {data} = await axios.post(`${updateNotifySettings}/${currentUser._id}`,{
			notify,notifyVibrate,videCallNotify:result
		})			
		setCurrentUser(data.user)
	}

	const dialerRingtonePlayUpdateFun = async(value) => {
		const {data} = await axios.post(`${dialerRingtonePlayUpdate}/${currentUser._id}`,{
			dialerRingtonePlay:value
		})
		// console.log(data.user)
		setCurrentUser(data.user);
	}

	return (
		<div className={`lg:w-[44.6%] md:w-[70%] xs:w-[90%] w-[100%] flex flex-col h-full border-r-[1.3px] border-gray-200 relative 
		scrollbar-none overflow-y-scroll scroll-smooth dark:border-gray-600`}>
			<div className="cursor-pointer sticky top-0 md:gap-4 gap-1 bg-gray-100/30 hover:bg-gray-100/80 dark:hover:bg-gray-900/80 w-full backdrop-blur-lg z-30 
			flex items-center md:px-4 border-b-[1px] border-gray-200/50 dark:border-gray-700/50 px-2 py-1 bg-white/50 dark:bg-[#100C08]/50
			transition-all duration-300 ease-in-out">
				<div 
				onClick={()=>{
					setCurrentWindow('Home')
				}}
				className="grid items-center p-1 hover:bg-gray-400/20 dark:hover:bg-gray-600/20 rounded-full transition-all duration-200 ease-in-out cursor-pointer select-none">
					<BiArrowBack className="h-5 w-5 text-black dark:text-gray-300"/>
				</div>
				<div className="w-full flex flex-col px-3">
					<span className="md:text-xl text-lg text-black dark:text-gray-200 font-semibold">Settings</span>
					<span className="md:text-sm text-sm text-gray-500">@{currentUser?.username}</span>
				</div>				
			</div>
			<div className="md:px-4 px-3 flex flex-col py-3">
				<h1 className="text-2xl text-black dark:text-gray-200 font-semibold">Notifications</h1>
				<div className=" px-1 py-3">
					<div 
					onClick={()=>{
						if(notify){
							updateNotify(false)
						}else{
							updateNotify(true)
						}
					}}
					className="flex items-center justify-between flex-wrap">
						<h1 className="text-lg font-semibold text-black dark:text-gray-200">In-app notifications</h1>
						<label class="switch2">
						  <input type="checkbox" id="mainNotify" class="input__check"/>
						  <span class="slider2"></span>
						</label>
					</div>
					<div className="bg-gray-500/40 my-4 h-[1px] w-full"/>
					<div 
					onClick={()=>{
						if(notifyVibrate){
							updateVibrateNotify(false)
						}else{
							updateVibrateNotify(true)
						}
					}}
					className="flex mt-1 items-center justify-between flex-wrap">
						<h1 className="text-lg font-semibold text-black dark:text-gray-200">Vibrate on messages</h1>						
						<label class="switch2">
						  <input type="checkbox" id="vibrateNotify" class="input__check"/>
						  <span class="slider2"></span>
						</label>
					</div>
					<div 
					onClick={()=>{
						if(videCallNotify){
							updateVideoCallNotify(false)
						}else{
							updateVideoCallNotify(true)
						}
					}}
					className="flex mt-4 items-center justify-between flex-wrap">
						<h1 className="text-lg font-semibold text-black dark:text-gray-200">Call ringtone</h1>
						<label class="switch2">
						  <input type="checkbox" id="videoNotify" class="input__check"/>
						  <span class="slider2"></span>
						</label>
					</div>
					<div 
					onClick={()=>{
						if(currUserdialerRingtonePlay){
							dialerRingtonePlayUpdateFun(false)
						}else{
							dialerRingtonePlayUpdateFun(true)
						}
					}}
					className="flex mt-4 items-center justify-between flex-wrap">
						<h1 className="text-lg font-semibold text-black dark:text-gray-200">Call dialer tone</h1>
						<label class="switch2">
						  <input type="checkbox" id="dialerTone" class="input__check"/>
						  <span class="slider2"></span>
						</label>
					</div>
					<div className="bg-gray-500/40 my-4 h-[1px] w-full"/>
					<div 
					onClick={()=>{
						setShowCategorySelector(true)
					}}
					className="rounded-xl border-[1px] border-gray-300/80 dark:border-gray-700/50 cursor-pointer transition
					duration-200 ease-in-out hover:bg-gray-200/50 dark:hover:bg-gray-900/70 px-3 
					py-3 flex items-center justify-between">
						<h1 className="text-xl font-semibold text-black dark:text-gray-200">Favorite categories</h1>
						<AiOutlineRight className="text-black dark:text-gray-300 h-7 w-7"/>
					</div>
					<div className="bg-gray-500/20 my-4 h-[1px] w-full"/>
					<div 
					onClick={()=>{
						setShowThemeMenu(true)
					}}
					className="rounded-xl border-[1px] border-gray-300/80 dark:border-gray-700/50 cursor-pointer transition
					duration-200 ease-in-out hover:bg-gray-200/50 dark:hover:bg-gray-900/70 px-3 
					py-3 flex items-center justify-between">
						<h1 className="text-xl font-semibold text-sky-500 dark:text-sky-600">Change theme</h1>
						<AiOutlineRight className="text-black dark:text-gray-300 h-7 w-7"/>
					</div>
					<div className="bg-gray-500/40 my-4 h-[1px] w-full"/>
					<button 
					onClick={()=>{
						localStorage.removeItem('xbird')
						sessionStorage.removeItem('trendzio-auth')
						setCurrentUser('');
						signOut();
					}}
					className="px-5 w-auto py-2 hover:bg-red-600 dark:hover:bg-red-700 transition-all duration-100 ease-in-out
					bg-red-500 dark:bg-red-600 font-semibold text-white rounded-xl">
						Log out
					</button>
				</div>

			</div>


		</div>


	)
}